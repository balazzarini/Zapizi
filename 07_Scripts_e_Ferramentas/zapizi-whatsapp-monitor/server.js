import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import qrcode from 'qrcode';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pkg from 'whatsapp-web.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const { Client, LocalAuth } = pkg;

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Estado da Conexão
let connectionStatus = 'INITIALIZING'; // 'INITIALIZING', 'QR_CODE', 'READY', 'DISCONNECTED'
let qrCodeBase64 = '';
let activeChats = [];
const messageBuffers = {};

// Configurações
const CONFIG_PATH = path.join(__dirname, 'config.json');
const ALERTS_PATH = path.join(__dirname, 'alerts.json');

const loadJSON = (filePath, defaultValue = []) => {
  if (fs.existsSync(filePath)) {
    try {
      return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } catch (e) {
      console.error(`Erro ao ler ${filePath}:`, e);
    }
  }
  return defaultValue;
};

const saveJSON = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error(`Erro ao salvar ${filePath}:`, e);
  }
};

let settings = loadJSON(CONFIG_PATH, {
  keywords: ["grua", "pelucia", "pelúcia", "máquina", "maquina", "bichinho", "vending"],
  geminiApiKey: process.env.GEMINI_API_KEY || ""
});

let alerts = loadJSON(ALERTS_PATH, []);

// Inicialização do WhatsApp Client
const isRailway = process.env.RAILWAY_ENVIRONMENT || process.env.NIXPACKS;
const puppeteerConfig = {
  headless: isRailway ? true : false,
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-accelerated-2d-canvas',
    '--no-first-run',
    '--no-zygote',
    '--disable-gpu'
  ]
};

if (!isRailway) {
  puppeteerConfig.executablePath = 'C:\\Users\\Bruno\\.cache\\puppeteer\\chrome\\win64-146.0.7680.31\\chrome-win64\\chrome.exe';
} else if (process.env.PUPPETEER_EXECUTABLE_PATH) {
  puppeteerConfig.executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
}

const client = new Client({
  authStrategy: new LocalAuth({
    dataPath: path.join(__dirname, '.wwebjs_auth')
  }),
  puppeteer: puppeteerConfig,
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
});

client.on('qr', (qr) => {
  console.log('Novo QR Code gerado.');
  connectionStatus = 'QR_CODE';
  qrcode.toDataURL(qr, (err, url) => {
    if (!err) {
      qrCodeBase64 = url;
    }
  });
});

client.on('ready', () => {
  console.log('WhatsApp Web está pronto!');
  connectionStatus = 'READY';
  qrCodeBase64 = '';
  syncRecentMessages();
});

client.on('authenticated', () => {
  console.log('Autenticado com sucesso.');
});

client.on('auth_failure', (msg) => {
  console.error('Falha de autenticação:', msg);
  connectionStatus = 'DISCONNECTED';
});

client.on('disconnected', (reason) => {
  console.log('Desconectado do WhatsApp:', reason);
  connectionStatus = 'DISCONNECTED';
  qrCodeBase64 = '';
});

// Classificação de Mensagem (Gemini ou Heurística Offline)
async function classifyMessage(messageText, groupName, senderName) {
  const geminiKey = settings.geminiApiKey || process.env.GEMINI_API_KEY;
  
  if (geminiKey) {
    try {
      const genAI = new GoogleGenerativeAI(geminiKey);
      
      const systemInstruction = `Você é o analisador de mensagens inteligente do Zapizi WhatsApp Monitor.
A Zapizi é uma empresa líder que fornece sistemas de pagamento (cartão de crédito/débito, aproximação e PIX) e telemetria para o mercado de autosserviço: gruas de pelúcia (plush cranes), vending machines, micro-mercados, máquinas de café, lava-jatos e terminais de autoatendimento.

Canais Oficiais de Contato da Zapizi:
- Website: https://zapizi.com.br
- Comercial/Suporte: Disponível via canais oficiais da empresa.

Sua tarefa é analisar mensagens enviadas em grupos de operadores de máquinas e classificá-las. Você deve ir além de simples palavras-chave e entender a real intenção (o significado semântico) da mensagem.

Categorias de Classificação:
1. "Oportunidade":
   - Operadores demonstrando interesse em comprar leitores de cartão, telemetria ou sistemas de pagamento.
   - Operadores perguntando sobre preços, planos ou como contratar a Zapizi.
   - Mensagens perguntando como falar com o comercial da Zapizi, ou pedindo o link do site/contato da empresa para novas aquisições.
   - Buscas por pontos comerciais ou parcerias onde a Zapizi possa se encaixar.
2. "Problema":
   - Reclamações sobre falhas de pagamento, PIX fora do ar, erro no leitor, sinal da máquina caindo ou máquina travada.
   - Operadores pedindo suporte, ajuda técnica ou relatando problemas operacionais.
   - Mensagens pedindo o contato de suporte da Zapizi para resolver problemas de transação ou estornos.
3. "Outro":
   - Spams, propagandas de terceiros (vendedores de pelúcias, atacadistas, fornecedores de brinquedos, rifas, sorteios).
   - Conversas casuais, cumprimentos ou discussões não relacionadas às soluções da Zapizi.

REGRAS CRÍTICAS:
- Vá além de palavras-chave: analise o contexto completo e a intenção do emissor. Se um operador diz "alguém aí usa o sistema azul na máquina de pelúcia e está fora do ar?" ou "como consigo falar com o atendimento deles?", identifique a intenção como Oportunidade ou Problema.
- Se a mensagem for propaganda de terceiros (venda de pelúcia, venda de máquina usada, divulgação de atacado), classifique SEMPRE como "Outro".
- Não sugira nenhuma resposta. Foque exclusivamente na classificação e na justificativa.

Você deve responder EXCLUSIVAMENTE em formato JSON com a seguinte estrutura:
{
  "category": "Oportunidade" | "Problema" | "Outro",
  "urgency": "Alta" | "Média" | "Baixa",
  "reason": "Justificativa curta em português explicando por que foi classificado dessa forma."
}`;

      const model = genAI.getGenerativeModel({ 
        model: 'gemini-1.5-flash',
        systemInstruction: systemInstruction
      });
      
      const prompt = `Grupo: "${groupName}"
Remetente: "${senderName}"
Mensagem:
"""${messageText}"""`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text().trim();
      
      if (text.startsWith('```')) {
        text = text.replace(/```json|```/g, '').trim();
      }
      
      return JSON.parse(text);
    } catch (e) {
      console.error("Erro na classificação via Gemini API, usando fallback offline:", e);
    }
  }

  // Fallback Heurístico Offline
  const textLower = messageText.toLowerCase();
  let category = 'Outro';
  let urgency = 'Baixa';
  let reason = 'Classificação offline baseada em palavras-chave.';

  const spamKeywords = ['chama no pv', 'vendo', 'atacadista', 'promoção', 'tabela', 'frete', 'fornecedor', 'rifa', 'sorteio', 'whatsapp'];
  const isSpam = spamKeywords.some(kw => textLower.includes(kw));

  if (!isSpam) {
    const problemKeywords = ['erro', 'pix', 'cartao', 'cartão', 'fora', 'travou', 'falha', 'problema', 'suporte', 'ajuda', 'cobrou', 'perdi'];
    const opportunityKeywords = ['comprar leitor', 'telemetria', 'sistema', 'zapizi', 'ponto', 'locação', 'pagamento'];

    if (problemKeywords.some(kw => textLower.includes(kw))) {
      category = 'Problema';
      urgency = 'Alta';
    } else if (opportunityKeywords.some(kw => textLower.includes(kw))) {
      category = 'Oportunidade';
      urgency = 'Média';
    }
  }

  return { category, urgency, reason };
}

// Sincronizar mensagens antigas dos grupos monitorados
async function syncRecentMessages() {
  console.log('Iniciando sincronização de mensagens recentes dos grupos...');
  try {
    const chats = await client.getChats();
    const keywords = settings.keywords || [];
    
    // Filtrar grupos que contenham keywords
    const matchedGroups = chats.filter(c => c.isGroup && keywords.some(kw => c.name.toLowerCase().includes(kw)));
    console.log(`Encontrados ${matchedGroups.length} grupos correspondentes para sincronização.`);

    for (const group of matchedGroups) {
      console.log(`Sincronizando grupo: ${group.name}...`);
      const messages = await group.fetchMessages({ limit: 15 });
      
      for (const msg of messages) {
        if (!msg.body || msg.fromMe) continue;

        const body = msg.body;
        const sender = await msg.getContact();
        const senderName = sender.pushname || sender.name || msg.author || msg.from;
        const messageId = msg.id._serialized;

        const alreadyAlerted = alerts.some(a => a.messageId === messageId);
        if (alreadyAlerted) continue;

        const spamKeywords = ['chama no pv', 'vendo', 'atacadista', 'promoção', 'tabela', 'frete', 'fornecedor', 'rifa', 'sorteio', 'whatsapp'];
        if (spamKeywords.some(kw => body.toLowerCase().includes(kw))) continue;

        const matchesKeywords = keywords.some(kw => 
          group.name.toLowerCase().includes(kw) || body.toLowerCase().includes(kw)
        );

        if (matchesKeywords) {
          console.log(`[Sincronizado] Grupo: ${group.name} | Msg: ${body}`);
          const analysis = await classifyMessage(body, group.name, senderName);

          if (analysis.category === 'Oportunidade' || analysis.category === 'Problema') {
            const dateObj = new Date(msg.timestamp * 1000);
            const newAlert = {
              id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
              messageId: messageId,
              group: group.name,
              sender: senderName,
              message: body,
              timestamp: dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
              date: dateObj.toLocaleDateString('pt-BR'),
              category: analysis.category,
              urgency: analysis.urgency,
              reason: analysis.reason,
              resolved: false
            };

            alerts.unshift(newAlert);
          }
        }
      }
    }
    
    alerts = alerts.slice(0, 100);
    saveJSON(ALERTS_PATH, alerts);
    console.log('Sincronização concluída com sucesso!');
  } catch (e) {
    console.error('Erro na sincronização de mensagens recentes:', e);
  }
}

// Evento de Recebimento de Mensagem
client.on('message', async (message) => {
  try {
    const chat = await message.getChat();
    
    // Processar apenas mensagens de grupo
    if (chat.isGroup) {
      const groupName = chat.name;
      const body = message.body;
      
      if (!body) return;

      const messageId = message.id._serialized;
      const alreadyAlerted = alerts.some(a => a.messageId === messageId);
      if (alreadyAlerted) return;

      const spamKeywords = ['chama no pv', 'vendo', 'atacadista', 'promoção', 'tabela', 'frete', 'fornecedor', 'rifa', 'sorteio', 'whatsapp'];
      if (spamKeywords.some(kw => body.toLowerCase().includes(kw))) {
        return; // Ignora imediatamente propagandas
      }

      const keywords = settings.keywords || [];
      const matchesKeywords = keywords.some(kw => 
        groupName.toLowerCase().includes(kw) || body.toLowerCase().includes(kw)
      );

      if (matchesKeywords) {
        const sender = await message.getContact();
        const senderName = sender.pushname || sender.name || message.author || message.from;
        const bufferKey = `${chat.id._serialized}_${message.author || message.from}`;
        
        console.log(`[Filtrado/Buffer] Grupo: ${groupName} | Msg: ${body}`);

        if (!messageBuffers[bufferKey]) {
          messageBuffers[bufferKey] = {
            messages: [],
            groupName,
            senderName,
            lastMessageId: messageId,
            timer: null
          };
        }

        const buf = messageBuffers[bufferKey];
        buf.messages.push(body);
        buf.lastMessageId = messageId;

        if (buf.timer) clearTimeout(buf.timer);

        buf.timer = setTimeout(async () => {
          const combinedMessage = buf.messages.join(' \\n ');
          const refMessageId = buf.lastMessageId;
          const gName = buf.groupName;
          const sName = buf.senderName;
          
          delete messageBuffers[bufferKey];

          // Classificar mensagem agrupada
          const analysis = await classifyMessage(combinedMessage, gName, sName);

          if (analysis.category === 'Oportunidade' || analysis.category === 'Problema') {
            const newAlert = {
              id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
              messageId: refMessageId,
              group: gName,
              sender: sName,
              message: combinedMessage,
              timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
              date: new Date().toLocaleDateString('pt-BR'),
              category: analysis.category,
              urgency: analysis.urgency,
              reason: analysis.reason,
              resolved: false
            };

            alerts.unshift(newAlert);
            alerts = alerts.slice(0, 100);
            saveJSON(ALERTS_PATH, alerts);
          }
        }, 300000); // 5 minutes buffer
      }
    }
  } catch (e) {
    console.error('Erro ao processar mensagem recebida:', e);
  }
});

// Inicializa o cliente do WhatsApp
client.initialize().catch(err => {
  console.error("Erro na inicialização do cliente WhatsApp Web:", err);
});

const MONITOR_PASSWORD = process.env.MONITOR_PASSWORD || settings.password || 'admin123';

// Middleware de Autenticação
const authenticate = (req, res, next) => {
  if (!MONITOR_PASSWORD) {
    return next();
  }
  
  const authHeader = req.headers['authorization'] || req.headers['x-monitor-password'];
  let token = authHeader;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  }
  
  if (token === MONITOR_PASSWORD) {
    return next();
  }
  
  return res.status(401).json({ error: 'Não autorizado. Senha inválida.' });
};

// --- Rotas da API REST ---

// Rota de Login (Pública)
app.post('/api/login', (req, res) => {
  const { password } = req.body;
  if (!MONITOR_PASSWORD || password === MONITOR_PASSWORD) {
    return res.json({ success: true, message: 'Autenticado com sucesso' });
  }
  res.status(401).json({ error: 'Senha incorreta' });
});

// Proteger todas as outras rotas /api
app.use('/api', authenticate);

// Status Geral
app.get('/api/status', (req, res) => {
  res.json({
    status: connectionStatus,
    qr: qrCodeBase64
  });
});

// Lista de Alertas
app.get('/api/alerts', (req, res) => {
  res.json(alerts);
});

// Marcar Alerta como Resolvido / Excluir
app.delete('/api/alerts/:id', (req, res) => {
  const { id } = req.params;
  alerts = alerts.filter(a => a.id !== id);
  saveJSON(ALERTS_PATH, alerts);
  res.json({ success: true });
});

// Forçar Sincronização de Mensagens Recentes
app.post('/api/sync', async (req, res) => {
  if (connectionStatus !== 'READY') {
    return res.status(400).json({ error: 'WhatsApp não está conectado' });
  }
  syncRecentMessages(); // Roda em segundo plano
  res.json({ success: true, message: 'Sincronização de histórico iniciada.' });
});

// Grupos Ativos
app.get('/api/groups', async (req, res) => {
  if (connectionStatus !== 'READY') {
    return res.json([]);
  }
  try {
    const chats = await client.getChats();
    const keywords = settings.keywords || [];
    const filtered = chats
      .filter(c => c.isGroup && keywords.some(kw => c.name.toLowerCase().includes(kw)))
      .map(c => ({
        id: c.id._serialized,
        name: c.name,
        unreadCount: c.unreadCount
      }));
    res.json(filtered);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Obter Configurações
app.get('/api/settings', (req, res) => {
  res.json({
    keywords: settings.keywords,
    hasApiKey: !!settings.geminiApiKey
  });
});

// Salvar Configurações
app.post('/api/settings', (req, res) => {
  const { keywords, geminiApiKey } = req.body;
  
  if (keywords) settings.keywords = keywords;
  if (geminiApiKey !== undefined) settings.geminiApiKey = geminiApiKey;

  saveJSON(CONFIG_PATH, settings);
  res.json({ success: true });
});

// Forçar Geração de Nova Resposta (para quando o usuário altera a chave API)
app.post('/api/alerts/:id/regenerate', async (req, res) => {
  const { id } = req.params;
  const alertIndex = alerts.findIndex(a => a.id === id);
  
  if (alertIndex === -1) {
    return res.status(404).json({ error: 'Alerta não encontrado' });
  }

  const alert = alerts[alertIndex];
  const analysis = await classifyMessage(alert.message, alert.group, alert.sender);
  
  alert.urgency = analysis.urgency;
  alert.category = analysis.category;
  alert.reason = analysis.reason;

  alerts[alertIndex] = alert;
  saveJSON(ALERTS_PATH, alerts);
  res.json(alert);
});

// Servidor Ouvindo
app.listen(PORT, () => {
  console.log(`Zapizi WhatsApp Monitor rodando na porta ${PORT}`);
  console.log(`Acesse http://localhost:${PORT} no seu navegador para configurar.`);
});
