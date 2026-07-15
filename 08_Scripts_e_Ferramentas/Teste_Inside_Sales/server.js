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
// Usando a chave da variável de ambiente 'APIKEY' configurada no container
const resend = new Resend(process.env.APIKEY);

// API Route to submit test
app.post('/api/submit', async (req, res) => {
    const { name, email, phone, linkedin, salary, finalScore, persuasion, emotional, action, fit, discD, discI, discS, discC } = req.body;
    
    if (!name || !email || !phone || !linkedin || !salary) {
        return res.status(400).json({ error: 'Name, email, phone, linkedin, and salary are required.' });
    }

    const mailOptions = {
        from: '"Avaliação Inside Sales Zapizi" <onboarding@resend.dev>', // Endereço padrão de teste do Resend
        to: 'balazzarini@gmail.com', // Envia para o email cadastrado na conta Resend
        subject: `Novo Teste Finalizado - Vendas: ${name} (Score: ${finalScore}%)`,
        html: `
            <h2>Novo Candidato a Inside Sales: ${name}</h2>
            <p><strong>E-mail:</strong> ${email}</p>
            <p><strong>Telefone/WhatsApp:</strong> ${phone}</p>
            <p><strong>LinkedIn:</strong> <a href="${linkedin}">${linkedin}</a></p>
            <p><strong>Pretensão Salarial:</strong> ${salary}</p>
            <hr>
            <h3>Resultados da Avaliação</h3>
            <p><strong>Score Global (Fit Score):</strong> ${finalScore}%</p>
            <ul>
                <li>🎯 Persuasão & Negociação: ${persuasion}%</li>
                <li>🤝 Resiliência & Inteligência Emocional: ${emotional}%</li>
                <li>⚡ Pró-atividade & Foco em Metas: ${action}%</li>
                <li>💙 Fit Cultural (Zapizi Way): ${fit}%</li>
            </ul>
            <hr>
            <h3>Perfil DISC</h3>
            <ul>
                <li>🔥 Dominância (D): ${discD}%</li>
                <li>🗣️ Influência (I): ${discI}%</li>
                <li>🤝 Estabilidade (S): ${discS}%</li>
                <li>📊 Conformidade (C): ${discC}%</li>
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
  "skills": { "persuasion": ${persuasion}, "emotional": ${emotional}, "action": ${action}, "fit": ${fit} },
  "disc": { "d": ${discD}, "i": ${discI}, "s": ${discS}, "c": ${discC} }
}
            </code></pre>
            <hr>
            <p><small>Este e-mail foi gerado automaticamente pelo sistema de avaliação Inside Sales Zapizi.</small></p>
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
    console.log(`🚀 Zapizi Inside Sales Test App running on http://localhost:${port}`);
});
