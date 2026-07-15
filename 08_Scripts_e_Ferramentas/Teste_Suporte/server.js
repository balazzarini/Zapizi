const express = require('express');
const { Resend } = require('resend');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Enable JSON parsing
app.use(express.json());
// Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));

// Configuração da API do Resend
// Usando a chave fornecida com fallback para variável de ambiente
const resend = new Resend(process.env.RESEND_API_KEY || 're_P1x5iQ9c_GuyhvknEwNhbwAfXTZDJ6hyJ');

// API Route to submit test
app.post('/api/submit', async (req, res) => {
    const { name, email, phone, linkedin, salary, finalScore, analytical, emotional, action, fit, disc, predominant } = req.body;
    
    if (!name || !email || !phone || !linkedin || !salary) {
        return res.status(400).json({ error: 'Name, email, phone, linkedin, and salary are required.' });
    }

    const mailOptions = {
        from: '"Avaliação Suporte Zapizi" <onboarding@resend.dev>', // Endereço padrão de teste do Resend
        to: 'balazzarini@gmail.com', // Envia para o email cadastrado na sua conta Resend
        subject: `Novo Teste Finalizado: ${name} (Score: ${finalScore}%)`,
        html: `
            <h2>Novo Candidato: ${name}</h2>
            <p><strong>E-mail:</strong> ${email}</p>
            <p><strong>Telefone/WhatsApp:</strong> ${phone}</p>
            <p><strong>LinkedIn:</strong> <a href="${linkedin}">${linkedin}</a></p>
            <p><strong>Pretensão Salarial:</strong> ${salary}</p>
            <hr>
            <h3>Resultados da Avaliação</h3>
            <p><strong>Score Global (Fit Score):</strong> ${finalScore}%</p>
            <ul>
                <li>🧠 Rigor Analítico & Lógica: ${analytical}%</li>
                <li>🤝 Inteligência Emocional & Empatia: ${emotional}%</li>
                <li>⚡ Pró-atividade & Resolução: ${action}%</li>
                <li>💙 Fit Cultural (Zapizi Way): ${fit}%</li>
            </ul>
            <hr>
            <h3>Perfil Comportamental DISC</h3>
            <p><strong>Perfil Predominante:</strong> ${predominant}</p>
            <ul>
                <li>(D) Dominância: ${disc?.D || 0}%</li>
                <li>(I) Influência: ${disc?.I || 0}%</li>
                <li>(S) Estabilidade: ${disc?.S || 0}%</li>
                <li>(C) Cautela: ${disc?.C || 0}%</li>
            </ul>
            <hr>
            <h3>Cápsula de Dados para IA (Copie o bloco abaixo)</h3>
            <pre><code>
{
  "nome": "${name}",
  "linkedin": "${linkedin}",
  "telefone": "${phone}",
  "pretensao_salarial": "${salary}",
  "fit_score": ${finalScore},
  "skills": { "analytical": ${analytical}, "emotional": ${emotional}, "action": ${action}, "fit": ${fit} },
  "disc": { "D": ${disc?.D || 0}, "I": ${disc?.I || 0}, "S": ${disc?.S || 0}, "C": ${disc?.C || 0} },
  "perfil_predominante": "${predominant}"
}
            </code></pre>
            <hr>
            <p><small>Este e-mail foi gerado automaticamente pelo sistema de avaliação Suporte Zapizi.</small></p>
        `
    };

    try {
        const { data, error } = await resend.emails.send(mailOptions);
        
        if (error) {
            console.error('Erro da API do Resend:', error);
            return res.status(500).json({ error: 'Falha ao enviar e-mail via API.' });
        }
        
        console.log(`Email enviado via Resend com ID: ${data?.id}`);
        res.json({ success: true });
    } catch (error) {
        console.error('Erro crítico no servidor ao enviar e-mail:', error);
        res.status(500).json({ error: 'Falha ao processar os resultados.' });
    }
});

app.listen(port, () => {
    console.log(`🚀 Zapizi Suporte Test App running on http://localhost:${port}`);
});
