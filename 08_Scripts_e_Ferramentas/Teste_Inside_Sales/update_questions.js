const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'public', 'index.html');
let html = fs.readFileSync(indexPath, 'utf-8');

const newQuestions = `const questions = [
    // --- PARTE 1: MÚLTIPLA ESCOLHA & RACIOCÍNIO ---
    { text: "Raciocínio de Funil: Se a sua meta de vendas é fechar 40 novos contratos por mês, e a sua taxa de conversão final (Lead Bruto para Fechamento) é de 5%, quantos leads brutos você precisa colocar no seu funil mensalmente?", options: [
        { text: "200 leads.", scores: { persuasion: 0, emotional: 0, action: 0, fit: 0 } },
        { text: "400 leads.", scores: { persuasion: 0, emotional: 0, action: 0, fit: 0 } },
        { text: "800 leads.", scores: { persuasion: 10, emotional: 10, action: 10, fit: 10 } },
        { text: "1200 leads.", scores: { persuasion: 0, emotional: 0, action: 0, fit: 0 } }
    ]},
    { text: "Ética e Contorno: Uma nova atualização da plataforma apresentou falha crítica em 30% da base. Qual é sua ação com um lead que está com contrato na mão prestes a assinar com você hoje?", options: [
        { text: "Omito a informação para garantir a venda hoje e deixo para o Suporte lidar amanhã.", scores: { persuasion: 5, emotional: 2, action: 7, fit: 0 } },
        { text: "Pauso a negociação imediatamente e peço para ele voltar na semana que vem, quando tudo estiver resolvido.", scores: { persuasion: 2, emotional: 5, action: 2, fit: 3 } },
        { text: "Aviso sobre a instabilidade com transparência, reforço a atuação da engenharia e a solidez da ferramenta para avançar a assinatura.", scores: { persuasion: 10, emotional: 10, action: 9, fit: 10 } },
        { text: "Concedo um desconto agressivo no custo de adesão para cobrir o 'inconveniente' e fecho a venda.", scores: { persuasion: 4, emotional: 3, action: 6, fit: 2 } }
    ]},
    { text: "Visão de Negócio (Take Rate): Nossa receita vem exclusivamente de um percentual (Take Rate) sobre o volume transacionado. Qual cenário de fechamento abaixo é mais lucrativo e estratégico?", options: [
        { text: "Fechar contrato com 1 cliente que comprará apenas 1 equipamento, transacionando R$ 15.000/mês.", scores: { persuasion: 10, emotional: 8, action: 9, fit: 10 } },
        { text: "Fechar contrato com 1 cliente que comprará 10 equipamentos, transacionando R$ 500/mês cada (total R$ 5.000/mês).", scores: { persuasion: 3, emotional: 3, action: 4, fit: 2 } },
        { text: "Vender o máximo de equipamentos possíveis, cobrando pela adesão, independente do volume transacionado.", scores: { persuasion: 2, emotional: 2, action: 5, fit: 0 } },
        { text: "Não fechar nenhum dos dois e buscar um cliente de R$ 100.000/mês.", scores: { persuasion: 1, emotional: 5, action: 2, fit: 3 } }
    ]},
    { text: "Gestão de CRM: Faltam 2 dias úteis para fechar o mês e você está 30% abaixo da sua meta. Como você prioriza a sua próxima hora de trabalho?", options: [
        { text: "Fazer 50 ligações para leads completamente frios (Outbound).", scores: { persuasion: 4, emotional: 6, action: 8, fit: 3 } },
        { text: "Ligar para 8 leads quentes que já receberam sua proposta há 10 dias, mas pararam de responder.", scores: { persuasion: 9, emotional: 10, action: 10, fit: 10 } },
        { text: "Atualizar todos os dados, nomes e tarefas em atraso no CRM para não tomar bronca da gestão.", scores: { persuasion: 1, emotional: 3, action: 2, fit: 2 } },
        { text: "Reunir-se com a equipe de Marketing para exigir mais leads qualificados urgentemente.", scores: { persuasion: 2, emotional: 2, action: 4, fit: 1 } }
    ]},
    { text: "Diagnóstico de Funil: Você não bateu a meta, mesmo recebendo muitos leads. Qual indicador melhor diagnostica de forma isolada ONDE no processo a sua venda está travando?", options: [
        { text: "A taxa de conversão de cada etapa intermediária (Lead -> Conexão -> Apresentação).", scores: { persuasion: 10, emotional: 9, action: 10, fit: 10 } },
        { text: "A taxa de cancelamento (Churn) dos clientes no 6º mês.", scores: { persuasion: 2, emotional: 3, action: 2, fit: 2 } },
        { text: "A quantidade total de MQLs (Marketing Qualified Leads) gerados no trimestre.", scores: { persuasion: 3, emotional: 2, action: 4, fit: 3 } },
        { text: "O número total de ligações feitas na semana.", scores: { persuasion: 4, emotional: 4, action: 5, fit: 4 } }
    ]},
    { text: "SLA de Inbound: Um lead preencheu os dados de contato no site. Qual é a janela de tempo ideal em que você DEVE fazer a primeira tentativa de ligação?", options: [
        { text: "Em até 5 minutos.", scores: { persuasion: 10, emotional: 9, action: 10, fit: 10 } },
        { text: "Em até 4 horas.", scores: { persuasion: 4, emotional: 4, action: 5, fit: 3 } },
        { text: "Em até 24 horas.", scores: { persuasion: 2, emotional: 3, action: 2, fit: 2 } },
        { text: "Em até 48 horas.", scores: { persuasion: 0, emotional: 1, action: 1, fit: 0 } }
    ]},
    
    // --- PARTE 2: DISCURSIVAS ADAPTADAS (CENÁRIOS STAR) ---
    { text: "Em ambientes ágeis sem processos maduros, como você cria um método de vendas para bater a meta?", options: [
        { text: "Reclamo com a gestão até que me passem um script e um playbook pronto.", scores: { persuasion: 1, emotional: 1, action: 1, fit: 0 } },
        { text: "Espero alguém da equipe descobrir o que funciona e copio a estratégia.", scores: { persuasion: 3, emotional: 4, action: 2, fit: 2 } },
        { text: "Estruturo um MVP do processo: testo abordagens no telefone, anoto as objeções comuns, crio um script base iterativo e rodo rápido.", scores: { persuasion: 10, emotional: 9, action: 10, fit: 10 } },
        { text: "Tento vender sem nenhum processo ou anotação, confiando apenas no talento no improviso.", scores: { persuasion: 6, emotional: 5, action: 7, fit: 4 } }
    ]},
    { text: "Você tinha certeza absoluta que ia fechar uma venda enorme, mas o cliente desistiu na reta final. O que você faz a seguir?", options: [
        { text: "Fico frustrado, fecho o CRM e tiro o resto do dia para esfriar a cabeça.", scores: { persuasion: 2, emotional: 2, action: 2, fit: 1 } },
        { text: "Analiso cada interação, entendo a objeção oculta que deixei passar, ajusto minha etapa de qualificação para não errar no próximo lead e sigo ligando.", scores: { persuasion: 9, emotional: 10, action: 10, fit: 10 } },
        { text: "Ligo imediatamente para o cliente implorando por uma segunda chance.", scores: { persuasion: 4, emotional: 3, action: 6, fit: 3 } },
        { text: "Coloco a culpa no produto da Zapizi que era inferior ao concorrente.", scores: { persuasion: 1, emotional: 1, action: 2, fit: 0 } }
    ]},
    { text: "Você está prospectando um dono de PME muito analógico que desconfia de 'soluções em nuvem'. Como você conduz a venda?", options: [
        { text: "Uso termos técnicos avançados (API, Cloud, Dashboard) para ele ver que somos modernos.", scores: { persuasion: 3, emotional: 4, action: 5, fit: 2 } },
        { text: "Traduzo a tecnologia para a dor dele: mostro como ele vai parar de perder dinheiro e tempo com papel, provando o ROI sem jargões complexos.", scores: { persuasion: 10, emotional: 10, action: 9, fit: 10 } },
        { text: "Digo que se ele não modernizar, a empresa dele vai falir em um ano.", scores: { persuasion: 4, emotional: 3, action: 7, fit: 1 } },
        { text: "Desqualifico o lead porque clientes analógicos dão muito trabalho de Suporte.", scores: { persuasion: 2, emotional: 4, action: 3, fit: 2 } }
    ]},
    { text: "O Inbound secou e você precisa prospectar ativamente (Outbound). Qual a melhor estratégia?", options: [
        { text: "Compro uma lista genérica na internet e mando 1.000 e-mails padrão por dia.", scores: { persuasion: 3, emotional: 4, action: 6, fit: 2 } },
        { text: "Fico no LinkedIn o dia todo adicionando conexões e esperando alguém aceitar.", scores: { persuasion: 4, emotional: 5, action: 5, fit: 3 } },
        { text: "Mapeio nichos com alta taxa de transação física (ex: redes de padarias), pesquiso os decisores, e faço ligações frias com scripts hiper-personalizados focando na dor.", scores: { persuasion: 10, emotional: 9, action: 10, fit: 10 } },
        { text: "Aviso ao gestor que não é minha função gerar leads e cruzo os braços.", scores: { persuasion: 1, emotional: 1, action: 1, fit: 0 } }
    ]},
    { text: "Um lead quer muito comprar a máquina, mas durante a call você percebe que ele fatura apenas R$ 300 por mês no cartão. O que você faz?", options: [
        { text: "Vendo do mesmo jeito, meta é meta e eu preciso da ativação.", scores: { persuasion: 6, emotional: 4, action: 8, fit: 1 } },
        { text: "Fico com pena e dou um desconto gigante na adesão para ele poder comprar.", scores: { persuasion: 3, emotional: 2, action: 5, fit: 0 } },
        { text: "Desqualifico o lead precocemente de forma educada, explico que o modelo da máquina não tem ROI para ele agora e ofereço um Link de Pagamento.", scores: { persuasion: 9, emotional: 10, action: 9, fit: 10 } },
        { text: "Simplesmente desligo o telefone na cara dele ao ouvir o faturamento.", scores: { persuasion: 1, emotional: 1, action: 2, fit: 0 } }
    ]},
    { text: "Em um ciclo longo de vendas, como você realiza os follow-ups sem parecer um 'vendedor chato'?", options: [
        { text: "Mando mensagem a cada 3 dias perguntando 'E aí, conseguiu ver minha proposta?'.", scores: { persuasion: 3, emotional: 4, action: 7, fit: 2 } },
        { text: "Não faço follow-up, se o cliente quiser comprar, ele me procura.", scores: { persuasion: 1, emotional: 5, action: 2, fit: 1 } },
        { text: "Agrego valor em cada contato: envio um artigo do setor dele, um estudo de caso, ou uma dica, mantendo a marca Zapizi quente de forma consultiva.", scores: { persuasion: 10, emotional: 10, action: 9, fit: 10 } },
        { text: "Ligo de diferentes números de telefone para ele não saber que sou eu e ser forçado a atender.", scores: { persuasion: 2, emotional: 1, action: 8, fit: 1 } }
    ]},
    { text: "Você toma uma 'porta na cara' bem agressiva de um cliente numa ligação fria. O que faz em seguida?", options: [
        { text: "Respiro, não levo para o lado pessoal (inteligência emocional), analiso se falei algo errado na abertura e disco o próximo número em 30 segundos.", scores: { persuasion: 9, emotional: 10, action: 10, fit: 10 } },
        { text: "Xingo o cliente mentalmente e passo os próximos 15 minutos reclamando no grupo da empresa.", scores: { persuasion: 2, emotional: 1, action: 3, fit: 0 } },
        { text: "Desisto de fazer outbound pelo resto do dia para não estragar meu humor.", scores: { persuasion: 2, emotional: 2, action: 2, fit: 2 } },
        { text: "Mando uma mensagem no WhatsApp dele questionando a falta de educação.", scores: { persuasion: 3, emotional: 1, action: 5, fit: 1 } }
    ]},
    { text: "O cliente assinou, pagou a adesão, mas você ganha por volume transacionado (Take Rate). O que você faz?", options: [
        { text: "O trabalho de vendas acabou na assinatura. Passo pro time de CS e não olho mais.", scores: { persuasion: 3, emotional: 4, action: 3, fit: 2 } },
        { text: "Acompanho o envio, garanto que o CS configurou e acompanho a primeira semana de transações para garantir o 'Go-Live' do cliente.", scores: { persuasion: 9, emotional: 9, action: 10, fit: 10 } },
        { text: "Ligo pedindo indicação de outros clientes antes mesmo de ele ligar a máquina.", scores: { persuasion: 6, emotional: 4, action: 7, fit: 3 } },
        { text: "Espero passar um mês e ligo se não tiver transação.", scores: { persuasion: 4, emotional: 5, action: 5, fit: 4 } }
    ]},
    { text: "O cliente diz que precisa pensar e enrola. Como você usa o 'Custo de Oportunidade'?", options: [
        { text: "Digo: 'Se você não fechar, vai perder o desconto na adesão que acaba hoje!'", scores: { persuasion: 6, emotional: 4, action: 7, fit: 4 } },
        { text: "Digo: 'Cada dia sem a nossa solução você perde cerca de R$ X por causa das taxas atuais e falta de conciliação. Em 30 dias de espera, você jogou R$ Y fora.'", scores: { persuasion: 10, emotional: 9, action: 10, fit: 10 } },
        { text: "Digo: 'Eu entendo, pense com calma e me retorne quando decidir.'", scores: { persuasion: 2, emotional: 5, action: 2, fit: 2 } },
        { text: "Digo: 'Nenhum outro concorrente tem esse sistema, você tá perdendo a chance.'", scores: { persuasion: 4, emotional: 3, action: 6, fit: 3 } }
    ]},
    { text: "Você quer prometer uma funcionalidade que a Zapizi não tem para garantir a venda. O que faz?", options: [
        { text: "Prometo e depois peço desculpas pro cliente, colocando a culpa na Engenharia.", scores: { persuasion: 5, emotional: 2, action: 6, fit: 0 } },
        { text: "Não prometo. Valido se a solução atual resolve a dor e faço o alinhamento correto, preservando a relação interna e evitando Churn futuro.", scores: { persuasion: 9, emotional: 10, action: 9, fit: 10 } },
        { text: "Prometo e brigo com o time de Produto para eles criarem a funcionalidade às pressas.", scores: { persuasion: 7, emotional: 1, action: 8, fit: 1 } },
        { text: "Perco a venda sem tentar contornar ou mostrar o valor das features atuais.", scores: { persuasion: 1, emotional: 5, action: 2, fit: 2 } }
    ]},

    // --- PARTE 3: SIMULAÇÕES PRÁTICAS ---
    { text: "Abertura Fria (Cold Call): O decisor atende seco 'Alô, com quem eu falo?'. Qual o seu script de 20 segundos?", options: [
        { text: "'Oi, aqui é o Bruno da Zapizi, uma empresa de tecnologia. Você teria 5 minutos para ouvir minha proposta?' (Permissão clássica)", scores: { persuasion: 3, emotional: 5, action: 5, fit: 4 } },
        { text: "'Oi! Eu sei que te peguei de surpresa. O motivo da ligação é que ajudamos padarias na sua região a reduzir as fraudes no PIX em 90%. Se não for o seu caso, eu desligo. Podemos falar por 1 minuto?' (Quebra de padrão + Dor)", scores: { persuasion: 10, emotional: 10, action: 10, fit: 10 } },
        { text: "'Tudo bem? Nosso sistema é o melhor do mercado em automação de terminais e eu queria marcar uma reunião de apresentação.'", scores: { persuasion: 4, emotional: 4, action: 6, fit: 3 } },
        { text: "Fico nervoso, falo super rápido e leio o script inteiro sem pausas até ele desligar.", scores: { persuasion: 1, emotional: 2, action: 3, fit: 1 } }
    ]},
    { text: "Objeção Financeira: O lead manda no WhatsApp: 'O concorrente me dá a máquina de graça e taxa menor. Vocês cobram setup e a taxa é maior. Por quê pagar mais caro?'", options: [
        { text: "'Você tem razão, me mande a proposta deles que eu cobrirei a taxa e te isento do equipamento agora mesmo.'", scores: { persuasion: 5, emotional: 3, action: 7, fit: 2 } },
        { text: "'A máquina de graça deles trava sexta à noite. Nossa taxa remunera estabilidade de 99.9% e suporte que atende em 1 min. Quanto você perde de vendas quando sua máquina atual fica fora do ar? É mais que essa diferença de taxa?' (Foca em Disponibilidade).", scores: { persuasion: 10, emotional: 9, action: 10, fit: 10 } },
        { text: "'A escolha é sua, mas a nossa tecnologia é superior e os clientes preferem.'", scores: { persuasion: 4, emotional: 5, action: 4, fit: 4 } },
        { text: "Ignoro a mensagem e ligo pra ele tentando mudar de assunto.", scores: { persuasion: 2, emotional: 2, action: 5, fit: 1 } }
    ]},
    { text: "Ancoragem e Urgência: O lead viu valor, mas diz: 'Vou falar com o sócio e lá pro dia 15 do mês que vem a gente fecha, ok?'", options: [
        { text: "'Sem problemas, anotei aqui. Dia 15 te chamo!'", scores: { persuasion: 2, emotional: 5, action: 2, fit: 2 } },
        { text: "'Maravilha! Mas a isenção parcial de setup que consegui para a sua volumetria só vale se assinarmos até sexta. Vamos fazer assim: mandamos o contrato agora, e se o sócio vetar até sexta, cancelamos sem custo. Pode ser?'", scores: { persuasion: 10, emotional: 9, action: 10, fit: 10 } },
        { text: "'Poxa, mas se você não fechar agora eu não bato a minha meta desse mês.'", scores: { persuasion: 1, emotional: 2, action: 4, fit: 0 } },
        { text: "'Tem certeza? O sócio precisa mesmo participar da decisão? Você não tem autonomia?'", scores: { persuasion: 4, emotional: 3, action: 6, fit: 3 } }
    ]},
    { text: "O Push de Ativação: Cliente assinou, máquina chegou, mas ele diz: 'Tô sem tempo pra instalar a máquina, mês que vem eu olho'. Seu Take Rate depende da instalação.", options: [
        { text: "'Tudo bem, a máquina é sua, instale quando preferir.'", scores: { persuasion: 2, emotional: 5, action: 2, fit: 2 } },
        { text: "'João, máquina guardada é dinheiro na mesa! Você está perdendo R$ X/dia em conciliação. Me dê 5 minutos numa vídeo-chamada agora, eu ligo com você e já deixamos faturando hoje.'", scores: { persuasion: 10, emotional: 10, action: 10, fit: 10 } },
        { text: "'João, preciso que você instale porque senão eu não recebo minha comissão da venda!'", scores: { persuasion: 1, emotional: 1, action: 3, fit: 0 } },
        { text: "'Se não instalar a gente vai cobrar uma multa no contrato por inatividade.'", scores: { persuasion: 3, emotional: 2, action: 5, fit: 1 } }
    ]},

    // --- DISC PROFILE (10 questions - Mantidas iguais) ---
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

fs.writeFileSync(indexPath, html, 'utf-8');
console.log('Questions updated successfully based on the provided Markdown file.');
