const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Enable JSON parsing
app.use(express.json());
// Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));

// Configuração do Nodemailer (SMTP Zapizi)
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.zapizi.com.br',
    port: process.env.SMTP_PORT || 465,
    secure: process.env.SMTP_PORT == 465, // true para 465, false para outras portas
    auth: {
        user: process.env.SMTP_USER || 'seu-email@zapizi.com.br',
        pass: process.env.SMTP_PASS || 'sua-senha'
    }
});

// API Route to submit test
app.post('/api/submit', async (req, res) => {
    const { name, email, phone, linkedin, salary, finalScore, persuasion, emotional, action, fit } = req.body;
    
    if (!name || !email || !phone || !linkedin || !salary) {
        return res.status(400).json({ error: 'Name, email, phone, linkedin, and salary are required.' });
    }

    const mailOptions = {
        from: `"Avaliação Inside Sales Zapizi" <${process.env.SMTP_USER || 'onboarding@zapizi.com.br'}>`,
        to: process.env.DESTINATION_EMAIL || 'balazzarini@gmail.com', // Envia para este email
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
            <h3>Cápsula de Dados para IA (Copie o bloco abaixo)</h3>
            <pre><code>
{
  "nome": "${name}",
  "linkedin": "${linkedin}",
  "telefone": "${phone}",
  "pretensao_salarial": "${salary}",
  "fit_score": ${finalScore},
  "skills": { "persuasion": ${persuasion}, "emotional": ${emotional}, "action": ${action}, "fit": ${fit} }
}
            </code></pre>
            <hr>
            <p><small>Este e-mail foi gerado automaticamente pelo sistema de avaliação Inside Sales Zapizi.</small></p>
        `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`Email enviado via SMTP com ID: ${info.messageId}`);
        res.json({ success: true });
    } catch (error) {
        console.error('Erro crítico no servidor ao enviar e-mail:', error);
        res.status(500).json({ error: 'Falha ao processar os resultados e enviar email.' });
    }
});

app.listen(port, () => {
    console.log(`🚀 Zapizi Inside Sales Test App running on http://localhost:${port}`);
});
