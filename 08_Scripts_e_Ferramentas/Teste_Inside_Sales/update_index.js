const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'public', 'index.html');
let html = fs.readFileSync(indexPath, 'utf-8');

// 1. Remove category badge
html = html.replace('<span class="badge" id="question-category">Comportamental</span>', '');

// 2. Change start button text
html = html.replace('Iniciar Avaliação (10 perguntas)', 'Iniciar Avaliação (30 perguntas)');

// 3. Questions array
const newQuestions = `const questions = [
    // --- SOFT SKILLS (20 questions) ---
    { text: "Você liga para o dono de um restaurante famoso que não conhece a Zapizi. Ele atende e diz: 'Estou ocupado agora, já uso a Stone há 5 anos'. O que você faz?", options: [
        { text: "Agradeço e desligo, para não incomodar.", scores: { persuasion: 1, emotional: 3, action: 2, fit: 1 } },
        { text: "Pergunto rápido: 'A Stone te repassa PIX com taxa? Me dê 30s, se eu não cortar seu custo eu desligo.'", scores: { persuasion: 10, emotional: 8, action: 10, fit: 10 } },
        { text: "Peço para mandar um e-mail com apresentação.", scores: { persuasion: 3, emotional: 4, action: 3, fit: 3 } },
        { text: "Digo que a Stone tem taxas abusivas e ele perde dinheiro.", scores: { persuasion: 4, emotional: 1, action: 6, fit: 2 } }
    ]},
    { text: "O cliente quer fechar, mas exige uma taxa de débito de 0.79% (nossa mínima é 0.99%). O que você faz?", options: [
        { text: "Digo que não posso cobrir e deixo ir.", scores: { persuasion: 2, emotional: 4, action: 2, fit: 2 } },
        { text: "Ofereço 0.79% e depois vejo com o gerente.", scores: { persuasion: 5, emotional: 2, action: 6, fit: 0 } },
        { text: "Foco no valor: mostro o CS e a máquina ZAP PRO que concilia PIX rápido, compensando a taxa.", scores: { persuasion: 10, emotional: 8, action: 9, fit: 10 } },
        { text: "Digo que a concorrência vai aumentar a taxa depois.", scores: { persuasion: 6, emotional: 5, action: 5, fit: 4 } }
    ]},
    { text: "Você tem 20 leads que enviaram docs há 3 dias (sem assinar) e 50 leads inbound novos hoje. Como prioriza?", options: [
        { text: "Ligo para os 50 novos para tentar fechar rápido.", scores: { persuasion: 5, emotional: 5, action: 6, fit: 4 } },
        { text: "Foco nos 20 que mandaram docs (urgência) e depois ataco os novos.", scores: { persuasion: 9, emotional: 8, action: 10, fit: 10 } },
        { text: "Mando e-mail em massa para todos.", scores: { persuasion: 2, emotional: 3, action: 2, fit: 1 } },
        { text: "Divido meu tempo meio a meio.", scores: { persuasion: 4, emotional: 6, action: 5, fit: 3 } }
    ]},
    { text: "Um lead (dono de padaria) sofre com fraudes no PIX. Como você vende?", options: [
        { text: "Digo que as máquinas rodam Android e são bonitas.", scores: { persuasion: 2, emotional: 4, action: 3, fit: 2 } },
        { text: "Ofereço taxas baixas no crédito para evitar PIX.", scores: { persuasion: 5, emotional: 5, action: 5, fit: 4 } },
        { text: "Apresento a ZAP PRO, provando que o PIX sai impresso na hora, eliminando fraudes e filas.", scores: { persuasion: 10, emotional: 8, action: 10, fit: 10 } },
        { text: "Pergunto qual a taxa atual dele.", scores: { persuasion: 3, emotional: 2, action: 4, fit: 2 } }
    ]},
    { text: "Dia 25 do mês, 60% da meta batida, e você perdeu a maior venda do mês. Qual a atitude?", options: [
        { text: "Aceito que o mês está perdido e prospecto para o mês que vem.", scores: { persuasion: 3, emotional: 5, action: 2, fit: 2 } },
        { text: "Fico desmotivado e reclamo com o time.", scores: { persuasion: 1, emotional: 0, action: 1, fit: 0 } },
        { text: "Analiso a perda, ajusto o pitch e dobro o volume em tickets menores para salvar a meta.", scores: { persuasion: 9, emotional: 10, action: 10, fit: 10 } },
        { text: "Ligo implorando pro cliente reconsiderar.", scores: { persuasion: 2, emotional: 1, action: 4, fit: 1 } }
    ]},
    { text: "Lead de farmácia liga apressado e pergunta só: 'Qual a taxa de débito?'. Como conduz?", options: [
        { text: "Passo a taxa de cara para ser objetivo.", scores: { persuasion: 3, emotional: 4, action: 5, fit: 2 } },
        { text: "Faço perguntas do negócio dele para ancorar o valor da Zapizi antes do preço.", scores: { persuasion: 10, emotional: 8, action: 9, fit: 10 } },
        { text: "Digo que a taxa é a melhor do mercado e cubro qualquer uma.", scores: { persuasion: 4, emotional: 3, action: 6, fit: 1 } },
        { text: "Pergunto a taxa atual e já cubro na hora.", scores: { persuasion: 5, emotional: 3, action: 7, fit: 3 } }
    ]},
    { text: "Cliente exige um relatório que a Zapizi não tem, para poder fechar. O que você faz?", options: [
        { text: "Prometo que temos só pra fechar.", scores: { persuasion: 6, emotional: 2, action: 8, fit: 0 } },
        { text: "Digo que temos e torço pra ele não cobrar.", scores: { persuasion: 5, emotional: 2, action: 5, fit: 0 } },
        { text: "Sou transparente, mostro que nossos relatórios resolvem 90% da dor dele. Venda sem churn.", scores: { persuasion: 9, emotional: 10, action: 8, fit: 10 } },
        { text: "Desisto da venda na hora.", scores: { persuasion: 1, emotional: 4, action: 1, fit: 2 } }
    ]},
    { text: "Lead Inbound (Pessoa Física, fatura R$ 500/mês) quer ZAP PRO. O foco é B2B. O que faz?", options: [
        { text: "Gasto 40 min tentando vender a máquina com isenção.", scores: { persuasion: 5, emotional: 5, action: 5, fit: 1 } },
        { text: "Qualifico em 5 min, explico a regra e vendo Link de Pagamento.", scores: { persuasion: 9, emotional: 8, action: 10, fit: 10 } },
        { text: "Ignoro o lead.", scores: { persuasion: 1, emotional: 2, action: 1, fit: 0 } },
        { text: "Prometo a máquina com aluguel altíssimo.", scores: { persuasion: 6, emotional: 2, action: 6, fit: 2 } }
    ]},
    { text: "Prospect é arrogante, diz que 'empresas de maquininha só querem roubar'.", options: [
        { text: "Bato boca com ele defendendo a empresa.", scores: { persuasion: 2, emotional: 1, action: 4, fit: 1 } },
        { text: "Desligo na cara.", scores: { persuasion: 1, emotional: 3, action: 2, fit: 2 } },
        { text: "Dou razão parcial à frustração dele e mostro como a Zapizi foca no sucesso do cliente.", scores: { persuasion: 10, emotional: 10, action: 9, fit: 10 } },
        { text: "Fico calado, peço desculpas e desligo.", scores: { persuasion: 2, emotional: 2, action: 1, fit: 2 } }
    ]},
    { text: "O que define um Top Performer na Zapizi?", options: [
        { text: "Aquele que vende o máximo de volume sem ligar pro faturamento.", scores: { persuasion: 6, emotional: 3, action: 8, fit: 2 } },
        { text: "Aquele que foca em dar desconto máximo.", scores: { persuasion: 4, emotional: 2, action: 5, fit: 1 } },
        { text: "Vende valor, qualifica bem, e traz clientes saudáveis (baixo churn).", scores: { persuasion: 10, emotional: 9, action: 10, fit: 10 } },
        { text: "Aquele que preenche CRM certinho mas não bate meta.", scores: { persuasion: 2, emotional: 6, action: 3, fit: 4 } }
    ]},
    { text: "Durante uma call de qualificação, o prospect diz que não tem tempo para conversar. Qual a sua reação?", options: [
        { text: "Ofereço 10% de desconto de cara para segurá-lo.", scores: { persuasion: 3, emotional: 3, action: 5, fit: 2 } },
        { text: "Mostro empatia, mas lanço um 'hook' rápido sobre como otimizar o tempo dele com a Zapizi.", scores: { persuasion: 10, emotional: 9, action: 9, fit: 10 } },
        { text: "Insisto repetidamente, mesmo ele pedindo para desligar.", scores: { persuasion: 2, emotional: 2, action: 8, fit: 2 } },
        { text: "Desligo e envio um e-mail padrão.", scores: { persuasion: 4, emotional: 5, action: 4, fit: 4 } }
    ]},
    { text: "O cliente pede uma demonstração completa do sistema, mas você percebe que ele ainda não é o tomador de decisão. O que você faz?", options: [
        { text: "Faço a demonstração de 1 hora de qualquer forma.", scores: { persuasion: 5, emotional: 6, action: 5, fit: 4 } },
        { text: "Recuso a demonstração até que o chefe dele participe.", scores: { persuasion: 4, emotional: 4, action: 5, fit: 4 } },
        { text: "Faço um overview de 10 min e condiciono a apresentação completa à presença do decisor.", scores: { persuasion: 9, emotional: 8, action: 10, fit: 10 } },
        { text: "Passo um vídeo gravado genérico e desligo.", scores: { persuasion: 2, emotional: 3, action: 3, fit: 2 } }
    ]},
    { text: "Seu gerente aponta que sua taxa de conversão caiu 15% esta semana. Como você responde?", options: [
        { text: "Culpo os leads que vieram ruins do marketing.", scores: { persuasion: 2, emotional: 2, action: 3, fit: 0 } },
        { text: "Fico na defensiva e digo que estou fazendo meu máximo.", scores: { persuasion: 3, emotional: 2, action: 4, fit: 1 } },
        { text: "Analiso minhas calls, peço feedback pro gerente e aplico o ajuste no próximo dia.", scores: { persuasion: 8, emotional: 10, action: 10, fit: 10 } },
        { text: "Ignoro e continuo fazendo do meu jeito.", scores: { persuasion: 2, emotional: 2, action: 2, fit: 1 } }
    ]},
    { text: "Você descobre que a Stone cobriu sua oferta para um lead quente. Qual o próximo passo?", options: [
        { text: "Ligo pro lead e mostro planilhas provando onde está a pegadinha no contrato da Stone.", scores: { persuasion: 10, emotional: 8, action: 9, fit: 10 } },
        { text: "Peço pro gerente liberar taxa negativa pra ganhar o negócio.", scores: { persuasion: 4, emotional: 3, action: 6, fit: 2 } },
        { text: "Desisto, não dá pra brigar com banco grande.", scores: { persuasion: 1, emotional: 2, action: 1, fit: 1 } },
        { text: "Digo ao cliente que a Stone é um lixo.", scores: { persuasion: 3, emotional: 1, action: 5, fit: 0 } }
    ]},
    { text: "Faltam 2 vendas para a meta e o sistema de assinatura eletrônica cai no último dia do mês. O que faz?", options: [
        { text: "Aviso o cliente e peço para assinar amanhã.", scores: { persuasion: 3, emotional: 5, action: 3, fit: 3 } },
        { text: "Imprimo, vou até o cliente (se local) ou aciono contingência aprovada (e-mail formal) para garantir a venda hoje.", scores: { persuasion: 8, emotional: 9, action: 10, fit: 10 } },
        { text: "Reclamo no grupo da empresa.", scores: { persuasion: 1, emotional: 2, action: 1, fit: 0 } },
        { text: "Faço a venda sem assinatura.", scores: { persuasion: 4, emotional: 1, action: 6, fit: 1 } }
    ]},
    { text: "O prospect pergunta: 'Qual a diferença entre vocês e o Mercado Pago?'", options: [
        { text: "Digo que somos mais baratos.", scores: { persuasion: 4, emotional: 5, action: 5, fit: 3 } },
        { text: "Explico o nosso CS dedicado, a conciliação automática e a proximidade do time Zapizi.", scores: { persuasion: 10, emotional: 9, action: 8, fit: 10 } },
        { text: "Não sei responder direito.", scores: { persuasion: 1, emotional: 3, action: 2, fit: 1 } },
        { text: "Falo mal do Mercado Pago.", scores: { persuasion: 3, emotional: 2, action: 4, fit: 1 } }
    ]},
    { text: "Você recebe um lead fora do perfil da empresa (ICM muito baixo). O que faz?", options: [
        { text: "Gasto 1 hora validando.", scores: { persuasion: 4, emotional: 5, action: 3, fit: 2 } },
        { text: "Atendo bem, mas qualifico rápido fora do funil para focar em leads quentes.", scores: { persuasion: 8, emotional: 9, action: 10, fit: 10 } },
        { text: "Trato mal porque ele não vai dar comissão.", scores: { persuasion: 1, emotional: 1, action: 1, fit: 0 } },
        { text: "Fecho o negócio oferecendo o melhor produto só pelo volume.", scores: { persuasion: 6, emotional: 3, action: 7, fit: 2 } }
    ]},
    { text: "O seu colega de equipe conseguiu uma venda enorme, enquanto você está zerado no dia. Qual o sentimento?", options: [
        { text: "Fico com inveja e reclamo que a base dele é melhor.", scores: { persuasion: 2, emotional: 1, action: 2, fit: 0 } },
        { text: "Parabenizo, pergunto como ele contornou objeções e uso as dicas no meu pitch.", scores: { persuasion: 8, emotional: 10, action: 10, fit: 10 } },
        { text: "Não ligo, sigo meu trabalho.", scores: { persuasion: 4, emotional: 6, action: 5, fit: 5 } },
        { text: "Desanimo e passo o dia no celular.", scores: { persuasion: 1, emotional: 1, action: 1, fit: 1 } }
    ]},
    { text: "Você ligou 10 vezes e o lead pediu pra retornar. Na 11ª ele atende irritado.", options: [
        { text: "Peço mil desculpas e desligo.", scores: { persuasion: 2, emotional: 3, action: 1, fit: 2 } },
        { text: "Brinco com a situação ('Pelo menos agora você atendeu!'), quebro o gelo e apresento o valor rápido.", scores: { persuasion: 10, emotional: 10, action: 9, fit: 10 } },
        { text: "Digo que só liguei porque ele pediu.", scores: { persuasion: 4, emotional: 3, action: 4, fit: 3 } },
        { text: "Me irrito junto e pergunto se ele quer ou não comprar.", scores: { persuasion: 2, emotional: 1, action: 5, fit: 1 } }
    ]},
    { text: "Você descobre uma brecha na regra de preços para ganhar mais comissão prejudicando a margem da empresa. O que faz?", options: [
        { text: "Uso a brecha sem contar a ninguém.", scores: { persuasion: 5, emotional: 2, action: 7, fit: 0 } },
        { text: "Conto pros amigos para todos ganharem.", scores: { persuasion: 4, emotional: 3, action: 6, fit: 0 } },
        { text: "Aviso o gerente imediatamente para corrigir, preservando a saúde da empresa.", scores: { persuasion: 8, emotional: 10, action: 8, fit: 10 } },
        { text: "Não uso, mas também não aviso.", scores: { persuasion: 5, emotional: 6, action: 5, fit: 5 } }
    ]},

    // --- DISC PROFILE (10 questions) ---
    { text: "Em um ambiente de trabalho novo, como você se comporta?", options: [
        { text: "Assumo a liderança e começo a delegar tarefas rapidamente.", disc: "d" },
        { text: "Procuro conversar, me entrosar e conhecer todo mundo.", disc: "i" },
        { text: "Observo a dinâmica, ajudo os outros e me adapto à rotina.", disc: "s" },
        { text: "Foco em entender as regras, processos e fazer o trabalho com precisão.", disc: "c" }
    ]},
    { text: "Quando enfrenta um problema complexo, você prefere:", options: [
        { text: "Tomar uma decisão rápida e corrigir no caminho se der errado.", disc: "d" },
        { text: "Reunir o time para debater ideias e encontrar algo criativo juntos.", disc: "i" },
        { text: "Buscar uma solução estável e testada, sem grandes sobressaltos.", disc: "s" },
        { text: "Analisar profundamente todos os dados e detalhes antes de agir.", disc: "c" }
    ]},
    { text: "Qual palavra melhor descreve seu foco principal?", options: [
        { text: "Resultados.", disc: "d" },
        { text: "Pessoas.", disc: "i" },
        { text: "Estabilidade.", disc: "s" },
        { text: "Qualidade.", disc: "c" }
    ]},
    { text: "Durante uma discussão acalorada, você geralmente:", options: [
        { text: "Defende seu ponto com firmeza e vai direto ao ponto.", disc: "d" },
        { text: "Usa o humor ou carisma para apaziguar e convencer.", disc: "i" },
        { text: "Ouve atentamente e tenta encontrar um consenso amigável.", disc: "s" },
        { text: "Apresenta fatos lógicos e concretos, evitando emoções.", disc: "c" }
    ]},
    { text: "Como você prefere que seus objetivos sejam definidos?", options: [
        { text: "Metas agressivas e desafiadoras.", disc: "d" },
        { text: "Metas inspiradoras e com reconhecimento público.", disc: "i" },
        { text: "Metas claras, passo a passo e sem pressão súbita.", disc: "s" },
        { text: "Metas precisas, lógicas e baseadas em dados concretos.", disc: "c" }
    ]},
    { text: "O que mais te desmotiva no trabalho?", options: [
        { text: "Perder autonomia ou o controle das decisões.", disc: "d" },
        { text: "Falta de interação social ou reconhecimento.", disc: "i" },
        { text: "Mudanças constantes e imprevisíveis na rotina.", disc: "s" },
        { text: "Desorganização, falta de regras ou trabalho mal feito.", disc: "c" }
    ]},
    { text: "Como você age sob extrema pressão?", options: [
        { text: "Fico autoritário e exijo ação imediata.", disc: "d" },
        { text: "Tento manter a energia alta e converso bastante.", disc: "i" },
        { text: "Me retraio e busco manter a harmonia a todo custo.", disc: "s" },
        { text: "Fico muito crítico e exijo perfeição nos detalhes.", disc: "c" }
    ]},
    { text: "Ao comunicar uma ideia, você costuma:", options: [
        { text: "Ir direto ao ponto, resumindo o impacto no resultado final.", disc: "d" },
        { text: "Falar com entusiasmo e contar histórias.", disc: "i" },
        { text: "Explicar calmamente como isso vai ajudar todos na equipe.", disc: "s" },
        { text: "Apresentar planilhas, gráficos e provas detalhadas.", disc: "c" }
    ]},
    { text: "No seu grupo de amigos, você é aquele que:", options: [
        { text: "Decide onde ir e o que fazer.", disc: "d" },
        { text: "Anima a festa e junta as pessoas.", disc: "i" },
        { text: "Apoia as decisões e cuida para que todos estejam bem.", disc: "s" },
        { text: "Organiza o dinheiro, o mapa e o roteiro.", disc: "c" }
    ]},
    { text: "A melhor maneira de reconhecer o seu bom trabalho é:", options: [
        { text: "Dando-me mais poder e responsabilidade.", disc: "d" },
        { text: "Com um prêmio ou elogio em frente à equipe.", disc: "i" },
        { text: "Com um feedback sincero e privado valorizando minha lealdade.", disc: "s" },
        { text: "Reconhecendo a precisão e excelência técnica do meu projeto.", disc: "c" }
    ]}
];`;

const questionRegex = /const questions = \[[\s\S]*?\];/;
html = html.replace(questionRegex, newQuestions);

// 4. Update calculateScores function
const calculateScoresString = `function calculateScores() {
            let totalPersuasion = 0;
            let totalEmotional = 0;
            let totalAction = 0;
            let totalFit = 0;
            
            let maxScore = 20 * 10; // 20 questions * 10 points

            let discScores = { d: 0, i: 0, s: 0, c: 0 };

            answers.forEach((ansIndex, qIndex) => {
                if (ansIndex !== null) {
                    const option = questions[qIndex].options[ansIndex];
                    if (qIndex < 20) {
                        // Soft Skills
                        totalPersuasion += option.scores.persuasion;
                        totalEmotional += option.scores.emotional;
                        totalAction += option.scores.action;
                        totalFit += option.scores.fit;
                    } else {
                        // DISC
                        discScores[option.disc] += 1;
                    }
                }
            });

            const pPersuasion = Math.round((totalPersuasion / maxScore) * 100);
            const pEmotional = Math.round((totalEmotional / maxScore) * 100);
            const pAction = Math.round((totalAction / maxScore) * 100);
            const pFit = Math.round((totalFit / maxScore) * 100);

            // Fit Score (30% Fit, 30% Persuasion, 20% Emotional, 20% Action)
            const finalScore = Math.round(
                (pFit * 0.3) + 
                (pPersuasion * 0.3) + 
                (pEmotional * 0.2) + 
                (pAction * 0.2)
            );

            // DISC percentages (out of 10 questions)
            const pD = Math.round((discScores.d / 10) * 100);
            const pI = Math.round((discScores.i / 10) * 100);
            const pS = Math.round((discScores.s / 10) * 100);
            const pC = Math.round((discScores.c / 10) * 100);

            return { finalScore, pPersuasion, pEmotional, pAction, pFit, pD, pI, pS, pC };
        }`;

const calcRegex = /function calculateScores\(\) \{[\s\S]*?return \{ finalScore, pPersuasion, pEmotional, pAction, pFit \};\s*\}/;
html = html.replace(calcRegex, calculateScoresString);

// 5. Update UI results to include DISC radar chart
const radarChartReplacement = `<div class="radar-chart">
                    <h3 style="margin-top: 1rem; color: #fff;">Comportamental & Metas</h3>
                    <div class="metric">
                        <div class="metric-header">
                            <span>🎯 Persuasão & Negociação</span>
                            <span id="score-persuasion">0%</span>
                        </div>
                        <div class="metric-bar-bg">
                            <div class="metric-fill" id="bar-persuasion" style="background-color: #3B82F6;"></div>
                        </div>
                    </div>
                    
                    <div class="metric">
                        <div class="metric-header">
                            <span>🤝 Resiliência & Inteligência Emocional</span>
                            <span id="score-emotional">0%</span>
                        </div>
                        <div class="metric-bar-bg">
                            <div class="metric-fill" id="bar-emotional" style="background-color: #10B981;"></div>
                        </div>
                    </div>

                    <div class="metric">
                        <div class="metric-header">
                            <span>⚡ Pró-atividade & Foco em Metas</span>
                            <span id="score-action">0%</span>
                        </div>
                        <div class="metric-bar-bg">
                            <div class="metric-fill" id="bar-action" style="background-color: #F59E0B;"></div>
                        </div>
                    </div>

                    <div class="metric">
                        <div class="metric-header">
                            <span>💙 Fit Cultural (Zapizi Way)</span>
                            <span id="score-fit">0%</span>
                        </div>
                        <div class="metric-bar-bg">
                            <div class="metric-fill" id="bar-fit" style="background-color: #8B5CF6;"></div>
                        </div>
                    </div>

                    <hr style="border-color: var(--border); margin: 2rem 0;">
                    
                    <h3 style="margin-top: 0; color: #fff;">Perfil DISC</h3>
                    <div class="metric">
                        <div class="metric-header">
                            <span>🔥 Dominância (D)</span>
                            <span id="score-d">0%</span>
                        </div>
                        <div class="metric-bar-bg">
                            <div class="metric-fill" id="bar-d" style="background-color: #EF4444;"></div>
                        </div>
                    </div>
                    <div class="metric">
                        <div class="metric-header">
                            <span>🗣️ Influência (I)</span>
                            <span id="score-i">0%</span>
                        </div>
                        <div class="metric-bar-bg">
                            <div class="metric-fill" id="bar-i" style="background-color: #F59E0B;"></div>
                        </div>
                    </div>
                    <div class="metric">
                        <div class="metric-header">
                            <span>🤝 Estabilidade (S)</span>
                            <span id="score-s">0%</span>
                        </div>
                        <div class="metric-bar-bg">
                            <div class="metric-fill" id="bar-s" style="background-color: #10B981;"></div>
                        </div>
                    </div>
                    <div class="metric">
                        <div class="metric-header">
                            <span>📊 Conformidade (C)</span>
                            <span id="score-c">0%</span>
                        </div>
                        <div class="metric-bar-bg">
                            <div class="metric-fill" id="bar-c" style="background-color: #3B82F6;"></div>
                        </div>
                    </div>
                </div>`;

const radarMatch = /<div class="radar-chart">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/;
html = html.replace(radarMatch, radarChartReplacement + `\n            </div>\n        </div>\n    </div>`);

// 6. Update showResults UI assignments (setTimeout logic)
const showResultsRegex = /setTimeout\(\(\) => \{[\s\S]*?\}, 500\);/;
const showResultsStr = `setTimeout(() => {
                document.getElementById('bar-persuasion').style.width = \`\${scores.pPersuasion}%\`;
                document.getElementById('score-persuasion').innerText = \`\${scores.pPersuasion}%\`;

                document.getElementById('bar-emotional').style.width = \`\${scores.pEmotional}%\`;
                document.getElementById('score-emotional').innerText = \`\${scores.pEmotional}%\`;

                document.getElementById('bar-action').style.width = \`\${scores.pAction}%\`;
                document.getElementById('score-action').innerText = \`\${scores.pAction}%\`;

                document.getElementById('bar-fit').style.width = \`\${scores.pFit}%\`;
                document.getElementById('score-fit').innerText = \`\${scores.pFit}%\`;
                
                // DISC bars
                document.getElementById('bar-d').style.width = \`\${scores.pD}%\`;
                document.getElementById('score-d').innerText = \`\${scores.pD}%\`;
                document.getElementById('bar-i').style.width = \`\${scores.pI}%\`;
                document.getElementById('score-i').innerText = \`\${scores.pI}%\`;
                document.getElementById('bar-s').style.width = \`\${scores.pS}%\`;
                document.getElementById('score-s').innerText = \`\${scores.pS}%\`;
                document.getElementById('bar-c').style.width = \`\${scores.pC}%\`;
                document.getElementById('score-c').innerText = \`\${scores.pC}%\`;

                // Color the main circle based on score
                const circle = document.querySelector('.score-circle');
                if(scores.finalScore >= 80) { circle.style.borderColor = '#10B981'; circle.style.boxShadow = '0 0 30px rgba(16, 185, 129, 0.3)'; }
                else if(scores.finalScore >= 60) { circle.style.borderColor = '#F59E0B'; circle.style.boxShadow = '0 0 30px rgba(245, 158, 11, 0.3)'; }
                else { circle.style.borderColor = '#EF4444'; circle.style.boxShadow = '0 0 30px rgba(239, 68, 68, 0.3)'; }

            }, 500);`;

html = html.replace(showResultsRegex, showResultsStr);

// 7. Update fetch payload
const fetchPayloadRegex = /body: JSON\.stringify\(\{[\s\S]*?\}\)/;
const fetchPayloadStr = `body: JSON.stringify({
                        name: candidateName,
                        email: candidateEmail,
                        phone: candidatePhone,
                        linkedin: candidateLinkedin,
                        salary: candidateSalary,
                        finalScore: scores.finalScore,
                        persuasion: scores.pPersuasion,
                        emotional: scores.pEmotional,
                        action: scores.pAction,
                        fit: scores.pFit,
                        discD: scores.pD,
                        discI: scores.pI,
                        discS: scores.pS,
                        discC: scores.pC
                    })`;
html = html.replace(fetchPayloadRegex, fetchPayloadStr);

// 8. questionCategory was removed, but it's used in renderQuestion. We must remove its line.
html = html.replace('questionCategory.innerText = q.category;', '');

fs.writeFileSync(indexPath, html, 'utf-8');
console.log('index.html updated successfully.');
