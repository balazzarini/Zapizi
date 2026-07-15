const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'public', 'index.html');
let html = fs.readFileSync(indexPath, 'utf-8');

const newQuestions = `const questions = [
    // --- PARTE 1: AVALIAÇÃO TÉCNICA E LÓGICA ---
    { text: "Raciocínio Lógico Básico: Um cliente relata que 'a máquina de bichinhos de pelúcia não está ligando'. Qual é a sua primeira pergunta para investigar a raiz do problema de forma lógica?", options: [
        { text: "Você já tentou atualizar o software da máquina pelo portal?", scores: { analytical: 0, emotional: 0, action: 0, fit: 0 } },
        { text: "A máquina está conectada corretamente na tomada e a tomada tem energia?", scores: { analytical: 10, emotional: 5, action: 10, fit: 10 } },
        { text: "Há quanto tempo o equipamento parou de funcionar?", scores: { analytical: 5, emotional: 5, action: 5, fit: 5 } },
        { text: "Você poderia me mandar a nota fiscal de compra do equipamento?", scores: { analytical: 0, emotional: 0, action: 0, fit: 0 } }
    ]},
    { text: "Gestão de Crise e SLA: São 18h de uma sexta-feira. Você tem 3 chamados novos na sua tela:\\nA) Dúvida sobre troca de senha.\\nB) Cliente 'Diamante' com 50 máquinas fora do ar.\\nC) Pedido de segunda via de boleto.\\nQual é a ordem correta de atendimento?", options: [
        { text: "A, depois B, depois C (ordem de facilidade).", scores: { analytical: 0, emotional: 0, action: 0, fit: 0 } },
        { text: "B primeiro (crítico e afeta faturamento de VIP). Depois C e A.", scores: { analytical: 10, emotional: 8, action: 10, fit: 10 } },
        { text: "C primeiro, depois A, deixando B por último pois vai demorar.", scores: { analytical: 0, emotional: 0, action: 0, fit: 0 } },
        { text: "Mando mensagem automática para os três aguardarem até segunda-feira.", scores: { analytical: 0, emotional: 0, action: 0, fit: 0 } }
    ]},
    { text: "Didática Técnica: Você detectou que o problema do cliente é uma 'Falha de DNS na rede Wi-Fi local dele'. Como você explica isso para o cliente leigo?", options: [
        { text: "Senhor, o seu roteador não está resolvendo os endereços IP. Altere o DNS primário para 8.8.8.8.", scores: { analytical: 8, emotional: 2, action: 5, fit: 3 } },
        { text: "O problema é na sua internet. Não podemos ajudar.", scores: { analytical: 0, emotional: 0, action: 0, fit: 0 } },
        { text: "O nosso equipamento perdeu a comunicação com a internet. Por favor, reinicie o seu roteador. Se não voltar, precisaremos falar com o seu provedor.", scores: { analytical: 10, emotional: 10, action: 10, fit: 10 } },
        { text: "Houve uma perda de pacotes na camada 3 do modelo OSI. Favor dar um ping no roteador.", scores: { analytical: 0, emotional: 0, action: 0, fit: 0 } }
    ]},
    { text: "O Cliente Ansioso: Um chamado complexo (SLA 48h) está com a Engenharia. O cliente está na linha exigindo solução imediata. Qual a melhor abordagem?", options: [
        { text: "Informo que a Engenharia já está cuidando e desligo, pois meu trabalho acabou.", scores: { analytical: 0, emotional: 0, action: 0, fit: 0 } },
        { text: "Prometo que em 1 hora estará resolvido para acalmá-lo.", scores: { analytical: 0, emotional: 0, action: 0, fit: 0 } },
        { text: "Explico a gravidade com empatia, reitero o prazo de 48h, mas prometo dar um status update em 4 horas, independentemente de estar pronto.", scores: { analytical: 9, emotional: 10, action: 10, fit: 10 } },
        { text: "Sugiro que ele reclame na Ouvidoria para 'apressar' a Engenharia.", scores: { analytical: 0, emotional: 0, action: 0, fit: 0 } }
    ]},
    { text: "Multitarefas Sob Pressão: O sistema inteiro cai. Em cinco minutos, você recebe 15 mensagens simultâneas. Como você reage?", options: [
        { text: "Entro em desespero e pauso os atendimentos até voltar.", scores: { analytical: 0, emotional: 0, action: 0, fit: 0 } },
        { text: "Respondo um por um demoradamente, investigando individualmente.", scores: { analytical: 2, emotional: 5, action: 2, fit: 2 } },
        { text: "Faço um envio em massa (Broadcast): 'Identificamos uma instabilidade geral e a equipe já está atuando. Retorno em 15 minutos.'", scores: { analytical: 10, emotional: 9, action: 10, fit: 10 } },
        { text: "Ignoro as mensagens, pois ele perceberá quando voltar.", scores: { analytical: 0, emotional: 0, action: 0, fit: 0 } }
    ]},
    { text: "Isolamento de Falhas: O cliente diz: 'A máquina aceita Cartão, mas quando tenta pagar no PIX, o QR Code não aparece'. Qual é a dedução mais provável?", options: [
        { text: "A máquina está sem internet (falha geral).", scores: { analytical: 0, emotional: 0, action: 0, fit: 0 } },
        { text: "A máquina está quebrada fisicamente.", scores: { analytical: 0, emotional: 0, action: 0, fit: 0 } },
        { text: "A internet funciona, mas há uma falha de comunicação específica com a API do PIX.", scores: { analytical: 10, emotional: 8, action: 9, fit: 10 } },
        { text: "O cliente final está sem limite no cartão.", scores: { analytical: 0, emotional: 0, action: 0, fit: 0 } }
    ]},
    { text: "Investigação Reversa: Um cliente manda apenas: 'O sistema de vocês é muito lento!'. Como você conduz a triagem?", options: [
        { text: "Respondo: 'Nosso sistema está normal. O problema deve ser o seu celular.'", scores: { analytical: 0, emotional: 0, action: 0, fit: 0 } },
        { text: "Respondo: 'Lamento ouvir isso! Poderia me dar um exemplo? É na hora de abrir o app, passar o cartão ou gerar relatório?'", scores: { analytical: 10, emotional: 10, action: 10, fit: 10 } },
        { text: "Abro chamado para a Engenharia analisar a lentidão.", scores: { analytical: 2, emotional: 2, action: 5, fit: 2 } },
        { text: "Sugiro que ele limpe o cache do navegador e fecho o chamado.", scores: { analytical: 0, emotional: 0, action: 0, fit: 0 } }
    ]},
    { text: "Autonomia Técnica: Você se depara com um erro 'Erro 994' na maquininha que não existe nos manuais da empresa. Qual é a sua ação?", options: [
        { text: "Digo ao cliente que a máquina quebrou e mando outra.", scores: { analytical: 0, emotional: 0, action: 0, fit: 0 } },
        { text: "Ignoro e peço para ele tentar de novo até dar certo.", scores: { analytical: 0, emotional: 0, action: 0, fit: 0 } },
        { text: "Pesquiso o erro no Google (fabricante), documento os sintomas e aciono o N2 com as evidências mastigadas.", scores: { analytical: 10, emotional: 8, action: 10, fit: 10 } },
        { text: "Mando o cliente ligar para a fabricante da máquina para descobrir o que é.", scores: { analytical: 0, emotional: 0, action: 0, fit: 0 } }
    ]},

    // --- PARTE 2: SIMULAÇÕES PRÁTICAS E INTELIGÊNCIA EMOCIONAL ---
    { text: "A Ativação Tensa: O cliente tentou instalar sozinho, conectou fios errados e agora a máquina não liga. Ele exige o dinheiro de volta irritado. Como responder com QE?", options: [
        { text: "'Você fez a ligação errada. Não devolvemos o dinheiro por imperícia.'", scores: { analytical: 2, emotional: 0, action: 2, fit: 0 } },
        { text: "'Acalme-se. Envie o equipamento de volta que nosso laboratório instala.'", scores: { analytical: 5, emotional: 5, action: 5, fit: 5 } },
        { text: "'Fique tranquilo, João. Essas ligações confundem no começo! Pode mandar uma foto da fiação? Eu te guio fio a fio agora.'", scores: { analytical: 10, emotional: 10, action: 10, fit: 10 } },
        { text: "'Não assumimos responsabilidade por imperícia. Chame um eletricista.'", scores: { analytical: 0, emotional: 0, action: 0, fit: 0 } }
    ]},
    { text: "A Falsa Cobrança: Cliente acusa: 'A máquina cobrou e não liberou a pelúcia. Seu sistema rouba dinheiro!'. Você vê que foi negado por Saldo Insuficiente no banco. Como responder?", options: [
        { text: "'Você está equivocado. Nosso sistema não rouba. Foi negada.'", scores: { analytical: 5, emotional: 2, action: 5, fit: 2 } },
        { text: "'Isso é impossível. Peça o extrato carimbado pelo gerente.'", scores: { analytical: 0, emotional: 0, action: 0, fit: 0 } },
        { text: "'João, fique em paz! A máquina não liberou porque o banco recusou por Saldo Insuficiente. O dinheiro foi barrado no banco, não saiu da conta.'", scores: { analytical: 10, emotional: 10, action: 10, fit: 10 } },
        { text: "'Foi um atraso de rede. Pede para tentar de novo.'", scores: { analytical: 0, emotional: 0, action: 0, fit: 0 } }
    ]},
    { text: "O Problema de Terceiros: A máquina parou pois o sinal da operadora Claro caiu na região. Como comunicar sem parecer que está 'tirando o corpo fora'?", options: [
        { text: "'O problema é da Claro. Teremos que aguardar.'", scores: { analytical: 2, emotional: 2, action: 2, fit: 2 } },
        { text: "'Senhor, o sistema está 100%. O sinal da Claro caiu na sua rua. Para não perder vendas, pode conectar no Wi-Fi temporariamente?'", scores: { analytical: 10, emotional: 10, action: 10, fit: 10 } },
        { text: "'Falha de LTE na ERB da operadora celular. Reinicie a cada 5 mins.'", scores: { analytical: 8, emotional: 2, action: 5, fit: 4 } },
        { text: "'As operadoras no Brasil são ruins. Quer que eu mande outro chip?'", scores: { analytical: 0, emotional: 0, action: 0, fit: 0 } }
    ]},
    { text: "Gestão de Erros: Você comete um grande erro (ex: cancela um plano sem querer). Ao descobrir, qual sua atitude?", options: [
        { text: "Tento desfazer silenciosamente antes que descubram.", scores: { analytical: 0, emotional: 0, action: 0, fit: 0 } },
        { text: "Aviso supervisor, reverto e atualizo o manual para garantir que não aconteça de novo.", scores: { analytical: 10, emotional: 9, action: 10, fit: 10 } },
        { text: "Peço desculpas chorando e fico com medo de atender chamados.", scores: { analytical: 0, emotional: 0, action: 0, fit: 0 } },
        { text: "Digo ao cliente que 'o sistema falhou'.", scores: { analytical: 0, emotional: 0, action: 0, fit: 0 } }
    ]},
    { text: "O Cliente 'VIP' Agressivo: Um cliente VIP te xinga no chat dizendo que a equipe é inútil. Como você lida?", options: [
        { text: "Desligo o chat ou bloqueio na hora.", scores: { analytical: 0, emotional: 0, action: 0, fit: 0 } },
        { text: "Continuo o atendimento tremendo de nervoso.", scores: { analytical: 0, emotional: 0, action: 0, fit: 0 } },
        { text: "Entendo que ele está estressado com perdas. Digo: 'Entendo sua urgência, estou aqui para resolver. Peço apenas respeito. O que parou de funcionar?'", scores: { analytical: 9, emotional: 10, action: 10, fit: 10 } },
        { text: "Xingo de volta para 'impor respeito'.", scores: { analytical: 0, emotional: 0, action: 0, fit: 0 } }
    ]},
    { text: "Falha de Comunicação: A Engenharia resolveu um bug e subiu a atualização sem te avisar. O cliente agradece que 'voltou'. Como você age?", options: [
        { text: "Finjo que fui eu quem resolveu.", scores: { analytical: 0, emotional: 0, action: 0, fit: 0 } },
        { text: "Digo 'Que bom! Nem me avisaram que tinham arrumado...'", scores: { analytical: 2, emotional: 2, action: 2, fit: 2 } },
        { text: "Fico feliz, mas internamente cobro o N3 para melhorar a comunicação de atualizações.", scores: { analytical: 10, emotional: 9, action: 10, fit: 10 } },
        { text: "Peço para testar 5 vezes porque não confio na TI.", scores: { analytical: 0, emotional: 0, action: 0, fit: 0 } }
    ]},
    { text: "Solicitação Financeira: A máquina ficou offline 1 hora e o cliente pede desconto de R$50. Você não tem alçada para isso. O que diz?", options: [
        { text: "'Claro, já te dei o desconto!' (mesmo sem poder).", scores: { analytical: 0, emotional: 0, action: 0, fit: 0 } },
        { text: "'Não damos desconto por 1 horinha.'", scores: { analytical: 0, emotional: 0, action: 0, fit: 0 } },
        { text: "'Entendo. Minha permissão não deixa aplicar descontos, mas vou escalar ao Financeiro e te retorno até amanhã.'", scores: { analytical: 9, emotional: 10, action: 10, fit: 10 } },
        { text: "'Reclamações só no e-mail financeiro@...'", scores: { analytical: 0, emotional: 0, action: 0, fit: 0 } }
    ]},
    { text: "Empatia com o Concorrente: O cliente diz que vai cancelar e voltar para a Cielo se der problema de novo. O que você responde?", options: [
        { text: "'Pode voltar, o sistema deles trava muito mais.'", scores: { analytical: 0, emotional: 0, action: 0, fit: 0 } },
        { text: "'Senhor, trabalhamos duro para evitar falhas, e nosso diferencial é o suporte humanizado. Vamos resolver isso juntos.'", scores: { analytical: 10, emotional: 10, action: 10, fit: 10 } },
        { text: "'Faça como achar melhor.'", scores: { analytical: 0, emotional: 0, action: 0, fit: 0 } },
        { text: "'A Cielo não aceita vending machines, não tem pra onde fugir.'", scores: { analytical: 0, emotional: 0, action: 0, fit: 0 } }
    ]},

    // --- PARTE 3: PERFIL, MOTIVAÇÃO E CARREIRA ---
    { text: "Autoanálise MBTI: Diante de um problema técnico totalmente novo, como sua mente trabalha?", options: [
        { text: "Busco padrões em problemas do passado e aplico soluções testadas e seguras (Sensorial).", scores: { analytical: 10, emotional: 8, action: 8, fit: 10 } },
        { text: "Adoro criar teorias, testar hipóteses novas e descobrir soluções 'fora da caixa' (Intuição).", scores: { analytical: 8, emotional: 8, action: 10, fit: 10 } },
        { text: "Espero alguém mais experiente me dizer o que fazer.", scores: { analytical: 2, emotional: 5, action: 2, fit: 2 } },
        { text: "Abro um chamado direto para a fabricante resolver.", scores: { analytical: 2, emotional: 2, action: 2, fit: 2 } }
    ]},
    { text: "Autoanálise Comunicação: Ao entrar na empresa, como prefere ser treinado no sistema?", options: [
        { text: "Lendo todos os POPs e fluxogramas antes de tocar em qualquer coisa.", scores: { analytical: 10, emotional: 5, action: 8, fit: 10 } },
        { text: "Sentando ao lado de alguém, vendo atender e aprendendo na conversa.", scores: { analytical: 5, emotional: 10, action: 8, fit: 10 } },
        { text: "Tentando usar o sistema sozinho até descobrir como funciona na marra.", scores: { analytical: 5, emotional: 5, action: 10, fit: 8 } },
        { text: "Não gosto de treinar, prefiro improvisar na hora do chamado.", scores: { analytical: 0, emotional: 0, action: 0, fit: 0 } }
    ]},
    { text: "O Perfil N1 vs N3: No suporte agitado, qual rotina te faz mais feliz?", options: [
        { text: "Investigar sozinho, cavar dados e achar a causa raiz de falhas complexas em silêncio.", scores: { analytical: 10, emotional: 5, action: 8, fit: 10 } },
        { text: "Conversar, acalmar cliente frustrado e virar o jogo no relacionamento.", scores: { analytical: 5, emotional: 10, action: 8, fit: 10 } },
        { text: "Ficar apenas respondendo e-mails padronizados sem falar com ninguém.", scores: { analytical: 2, emotional: 2, action: 2, fit: 2 } },
        { text: "Criar planilhas de controle de estoque de equipamentos.", scores: { analytical: 5, emotional: 5, action: 5, fit: 5 } }
    ]},
    { text: "Âncora de Carreira: O que mais te motiva profissionalmente pros próximos anos?", options: [
        { text: "Gerência/Liderança: Liderar pessoas e processos.", scores: { analytical: 8, emotional: 8, action: 10, fit: 10 } },
        { text: "Especialização Técnica: Ser o 'Mago da Infra' que resolve os piores bugs.", scores: { analytical: 10, emotional: 5, action: 8, fit: 10 } },
        { text: "Autonomia Total: Sem chefes monitorando.", scores: { analytical: 5, emotional: 5, action: 5, fit: 5 } },
        { text: "Segurança e Estabilidade: Emprego garantido e previsível.", scores: { analytical: 5, emotional: 5, action: 5, fit: 5 } }
    ]},

    // --- DISC PROFILE (10 questions) ---
    { text: "Em um ambiente de trabalho novo, como você se comporta?", options: [
        { text: "Assumo a liderança e começo a delegar tarefas rapidamente.", discScore: 'D', isDisc: true },
        { text: "Procuro conversar, me entrosar e conhecer todo mundo.", discScore: 'I', isDisc: true },
        { text: "Observo a dinâmica, ajudo os outros e me adapto à rotina.", discScore: 'S', isDisc: true },
        { text: "Foco em entender as regras, processos e fazer o trabalho com precisão.", discScore: 'C', isDisc: true }
    ], isDisc: true },
    { text: "Quando enfrenta um problema complexo, você prefere:", options: [
        { text: "Tomar uma decisão rápida e corrigir no caminho se der errado.", discScore: 'D', isDisc: true },
        { text: "Reunir o time para debater ideias e encontrar algo criativo juntos.", discScore: 'I', isDisc: true },
        { text: "Buscar uma solução estável e testada, sem grandes sobressaltos.", discScore: 'S', isDisc: true },
        { text: "Analisar profundamente todos os dados e detalhes antes de agir.", discScore: 'C', isDisc: true }
    ], isDisc: true },
    { text: "Qual palavra melhor descreve seu foco principal?", options: [
        { text: "Resultados.", discScore: 'D', isDisc: true },
        { text: "Pessoas.", discScore: 'I', isDisc: true },
        { text: "Estabilidade.", discScore: 'S', isDisc: true },
        { text: "Qualidade.", discScore: 'C', isDisc: true }
    ], isDisc: true },
    { text: "Durante uma discussão acalorada, você geralmente:", options: [
        { text: "Defende seu ponto com firmeza e vai direto ao ponto.", discScore: 'D', isDisc: true },
        { text: "Usa o humor ou carisma para apaziguar e convencer.", discScore: 'I', isDisc: true },
        { text: "Ouve atentamente e tenta encontrar um consenso amigável.", discScore: 'S', isDisc: true },
        { text: "Apresenta fatos lógicos e concretos, evitando emoções.", discScore: 'C', isDisc: true }
    ], isDisc: true },
    { text: "Como você prefere que seus objetivos sejam definidos?", options: [
        { text: "Metas agressivas e desafiadoras.", discScore: 'D', isDisc: true },
        { text: "Metas inspiradoras e com reconhecimento público.", discScore: 'I', isDisc: true },
        { text: "Metas claras, passo a passo e sem pressão súbita.", discScore: 'S', isDisc: true },
        { text: "Metas precisas, lógicas e baseadas em dados concretos.", discScore: 'C', isDisc: true }
    ], isDisc: true },
    { text: "O que mais te desmotiva no trabalho?", options: [
        { text: "Perder autonomia ou o controle das decisões.", discScore: 'D', isDisc: true },
        { text: "Falta de interação social ou reconhecimento.", discScore: 'I', isDisc: true },
        { text: "Mudanças constantes e imprevisíveis na rotina.", discScore: 'S', isDisc: true },
        { text: "Desorganização, falta de regras ou trabalho mal feito.", discScore: 'C', isDisc: true }
    ], isDisc: true },
    { text: "Como você age sob extrema pressão?", options: [
        { text: "Fico autoritário e exijo ação imediata.", discScore: 'D', isDisc: true },
        { text: "Tento manter a energia alta e converso bastante.", discScore: 'I', isDisc: true },
        { text: "Me retraio e busco manter a harmonia a todo custo.", discScore: 'S', isDisc: true },
        { text: "Fico muito crítico e exijo perfeição nos detalhes.", discScore: 'C', isDisc: true }
    ], isDisc: true },
    { text: "Ao comunicar uma ideia, você costuma:", options: [
        { text: "Ir direto ao ponto, resumindo o impacto no resultado final.", discScore: 'D', isDisc: true },
        { text: "Falar com entusiasmo e contar histórias.", discScore: 'I', isDisc: true },
        { text: "Explicar calmamente como isso vai ajudar todos na equipe.", discScore: 'S', isDisc: true },
        { text: "Apresentar planilhas, gráficos e provas detalhadas.", discScore: 'C', isDisc: true }
    ], isDisc: true },
    { text: "No seu grupo de amigos, você é aquele que:", options: [
        { text: "Decide onde ir e o que fazer.", discScore: 'D', isDisc: true },
        { text: "Anima a festa e junta as pessoas.", discScore: 'I', isDisc: true },
        { text: "Apoia as decisões e cuida para que todos estejam bem.", discScore: 'S', isDisc: true },
        { text: "Organiza o dinheiro, o mapa e o roteiro.", discScore: 'C', isDisc: true }
    ], isDisc: true },
    { text: "A melhor maneira de reconhecer o seu bom trabalho é:", options: [
        { text: "Dando-me mais poder e responsabilidade.", discScore: 'D', isDisc: true },
        { text: "Com um prêmio ou elogio em frente à equipe.", discScore: 'I', isDisc: true },
        { text: "Com um feedback sincero e privado valorizando minha lealdade.", discScore: 'S', isDisc: true },
        { text: "Reconhecendo a precisão e excelência técnica do meu projeto.", discScore: 'C', isDisc: true }
    ], isDisc: true }
];`;

const questionRegex = /const questions = \[[\s\S]*?\];/;
html = html.replace(questionRegex, newQuestions);

// Update title in html
html = html.replace(/Avaliação de Perfil CS/g, 'Avaliação de Perfil Suporte');
html = html.replace(/Customer Success na Zapizi/g, 'Suporte Técnico na Zapizi');

fs.writeFileSync(indexPath, html, 'utf-8');
console.log('Questions updated successfully for Suporte.');
