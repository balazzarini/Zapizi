// Zapizi WhatsApp Monitor Frontend Logic

// Autenticação e Fetch Seguro
let monitorPassword = localStorage.getItem('monitor_password') || '';

function showLoginModal() {
  const overlay = document.getElementById('login-overlay');
  if (overlay) {
    overlay.classList.remove('hidden');
  }
}

function hideLoginModal() {
  const overlay = document.getElementById('login-overlay');
  if (overlay) {
    overlay.classList.add('hidden');
  }
}

async function apiFetch(url, options = {}) {
  if (!options.headers) {
    options.headers = {};
  }
  if (monitorPassword) {
    options.headers['Authorization'] = `Bearer ${monitorPassword}`;
  }

  try {
    const res = await fetch(url, options);
    if (res.status === 401) {
      showLoginModal();
      throw new Error('Não autorizado. Senha inválida.');
    }
    return res;
  } catch (e) {
    if (e.message !== 'Não autorizado. Senha inválida.') {
      console.error(`Erro ao acessar ${url}:`, e);
    }
    throw e;
  }
}

function setupLoginForm() {
  const loginForm = document.getElementById('login-form');
  const passwordInput = document.getElementById('login-password');
  const loginError = document.getElementById('login-error');

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const pwd = passwordInput.value.trim();
      loginError.classList.add('hidden');

      try {
        const res = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: pwd })
        });

        if (res.ok) {
          monitorPassword = pwd;
          localStorage.setItem('monitor_password', pwd);
          hideLoginModal();
          // Recarregar dados do painel
          fetchStatus();
          fetchAlerts();
          fetchGroups();
          fetchSettings();
        } else {
          loginError.textContent = 'Senha incorreta.';
          loginError.classList.remove('hidden');
        }
      } catch (err) {
        loginError.textContent = 'Erro ao conectar ao servidor.';
        loginError.classList.remove('hidden');
      }
    });
  }
}

// Estado global
let currentTab = 'dashboard';
let connectionStatus = 'INITIALIZING';
let alertsList = [];
let groupsList = [];
let hasGeminiKey = false;

// Configuração do DOM
document.addEventListener('DOMContentLoaded', () => {
  setupLoginForm();
  
  if (!monitorPassword) {
    showLoginModal();
  }

  setupNavigation();
  setupSettingsForm();
  
  // Loops de atualização periódica
  fetchStatus();
  fetchAlerts();
  fetchGroups();
  fetchSettings();
  
  setInterval(fetchStatus, 3000);
  setInterval(fetchAlerts, 5000);
  
  // Botão mostrar/esconder chave API
  const toggleKeyBtn = document.getElementById('toggle-key-visibility');
  const apiKeyInput = document.getElementById('api-key-input');
  if (toggleKeyBtn && apiKeyInput) {
    toggleKeyBtn.addEventListener('click', () => {
      if (apiKeyInput.type === 'password') {
        apiKeyInput.type = 'text';
        toggleKeyBtn.textContent = 'Esconder';
      } else {
        apiKeyInput.type = 'password';
        toggleKeyBtn.textContent = 'Mostrar';
      }
    });
  }

  // Botão sincronizar histórico
  const syncBtn = document.getElementById('sync-history-btn');
  if (syncBtn) {
    syncBtn.addEventListener('click', async () => {
      const originalText = syncBtn.textContent;
      syncBtn.disabled = true;
      syncBtn.textContent = 'Sincronizando histórico...';
      try {
        const res = await apiFetch('/api/sync', { method: 'POST' });
        if (res.ok) {
          alert('Sincronização de histórico iniciada em segundo plano! Em breve novos alertas podem aparecer.');
        } else {
          const err = await res.json();
          alert(`Erro: ${err.error || 'Não foi possível sincronizar.'}`);
        }
      } catch (e) {
        alert('Erro ao se conectar ao servidor ou login necessário.');
      } finally {
        syncBtn.disabled = false;
        syncBtn.textContent = originalText;
      }
    });
  }
});

// Alternar entre abas
function setupNavigation() {
  const navBtns = document.querySelectorAll('.nav-btn');
  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      switchTab(tabId);
    });
  });
}

function switchTab(tabId) {
  currentTab = tabId;
  
  // Atualiza classes ativas nos botões
  document.querySelectorAll('.nav-btn').forEach(btn => {
    if (btn.getAttribute('data-tab') === tabId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Atualiza visualização das seções
  document.querySelectorAll('.tab-content').forEach(content => {
    if (content.id === `tab-${tabId}`) {
      content.classList.add('active');
    } else {
      content.classList.remove('active');
    }
  });

  // Ações específicas ao abrir a aba
  if (tabId === 'groups') {
    fetchGroups();
  } else if (tabId === 'settings') {
    fetchSettings();
  }
}

// Chamar switchTab globalmente
window.switchTab = switchTab;

// Buscar status do WhatsApp no Servidor
async function fetchStatus() {
  try {
    const res = await apiFetch('/api/status');
    const data = await res.json();
    
    connectionStatus = data.status;
    updateStatusUI(data.status, data.qr);
  } catch (e) {
    console.error('Erro ao buscar status de conexão:', e);
    updateStatusUI('DISCONNECTED', '');
  }
}

// Atualizar a interface com base no status do WhatsApp
function updateStatusUI(status, qrData) {
  const badge = document.getElementById('status-badge');
  const badgeText = document.getElementById('status-text');
  
  const qrLoader = document.getElementById('qr-loader');
  const qrDisplay = document.getElementById('qr-display');
  const qrSuccess = document.getElementById('qr-success');
  const qrImage = document.getElementById('qr-image');

  // Limpa classes anteriores do badge
  badge.className = 'status-badge';

  if (status === 'INITIALIZING') {
    badge.classList.add('status-loading');
    badgeText.textContent = 'Inicializando...';
    qrLoader.classList.remove('hidden');
    qrDisplay.classList.add('hidden');
    qrSuccess.classList.add('hidden');
  } 
  else if (status === 'QR_CODE') {
    badge.classList.add('status-qr');
    badgeText.textContent = 'Aguardando QR Code';
    qrLoader.classList.add('hidden');
    qrSuccess.classList.add('hidden');
    
    if (qrData) {
      qrDisplay.classList.remove('hidden');
      qrImage.src = qrData;
    } else {
      qrLoader.classList.remove('hidden');
      qrDisplay.classList.add('hidden');
    }
  } 
  else if (status === 'READY') {
    badge.classList.add('status-ready');
    badgeText.textContent = 'Conectado';
    qrLoader.classList.add('hidden');
    qrDisplay.classList.add('hidden');
    qrSuccess.classList.remove('hidden');
  } 
  else {
    badge.classList.add('status-disconnected');
    badgeText.textContent = 'Desconectado';
    qrLoader.classList.add('hidden');
    qrDisplay.classList.remove('hidden'); // Mostra instrução para reconectar
    qrSuccess.classList.add('hidden');
  }
}

// Buscar Alertas do Servidor
async function fetchAlerts() {
  try {
    const res = await apiFetch('/api/alerts');
    const data = await res.json();
    
    alertsList = data;
    renderAlerts();
  } catch (e) {
    console.error('Erro ao carregar alertas:', e);
  }
}

// Renderizar Alertas nas Telas (Dashboard e Feed Completo)
function renderAlerts() {
  const dashboardList = document.getElementById('dashboard-alerts-list');
  const feedList = document.getElementById('alerts-feed-container');
  const countBadge = document.getElementById('alerts-count-badge');
  const statCount = document.getElementById('stat-alerts-count');

  // Filtrar apenas não resolvidos para estatísticas
  const activeAlerts = alertsList.filter(a => !a.resolved);
  
  // Atualiza contadores
  if (activeAlerts.length > 0) {
    countBadge.textContent = activeAlerts.length;
    countBadge.classList.remove('hidden');
  } else {
    countBadge.classList.add('hidden');
  }
  statCount.textContent = activeAlerts.length;

  // Renderizar na aba principal (Dashboard) - Limita a 3 mais recentes
  if (alertsList.length === 0) {
    dashboardList.innerHTML = '<div class="empty-state">Nenhum alerta recente para exibir.</div>';
  } else {
    const recents = alertsList.slice(0, 3);
    dashboardList.innerHTML = recents.map(alert => createAlertMarkup(alert, true)).join('');
  }

  // Renderizar no Feed Completo
  if (alertsList.length === 0) {
    feedList.innerHTML = '<div class="empty-state">Nenhum alerta ou oportunidade detectado até o momento.</div>';
  } else {
    feedList.innerHTML = alertsList.map(alert => createAlertMarkup(alert, false)).join('');
  }
}

// Helper para gerar marcação HTML do card de alerta
function createAlertMarkup(alert, isDashboardView = false) {
  const urgencyClass = alert.urgency.toLowerCase() === 'alta' ? 'tag-urgency-alta' : '';
  const categoryTag = alert.category === 'Oportunidade' ? 'tag-opportunity' : 'tag-problem';
  const categoryEmoji = alert.category === 'Oportunidade' ? '🟢' : '🔴';
  
  // Se for visualização do dashboard, encurta o markup
  const actionsHtml = isDashboardView 
    ? `<button class="btn btn-secondary" onclick="switchTab('alerts')">Ver Detalhes</button>`
    : `
      <button class="btn btn-danger" onclick="deleteAlert('${alert.id}')">
        Excluir
      </button>
      <button class="btn btn-secondary" onclick="regenerateReply('${alert.id}', this)">
        Regerar Resposta
      </button>
      <button class="btn btn-primary" onclick="copyReply('${alert.id}', this)">
        Copiar Resposta
      </button>
    `;

  return `
    <div class="alert-card" id="alert-${alert.id}">
      <div class="alert-header">
        <div class="alert-group-meta">
          <span class="alert-group-name">${alert.group}</span>
          <span class="alert-sender-info">Enviado por <strong>${alert.sender}</strong> às ${alert.timestamp} em ${alert.date}</span>
        </div>
        <div class="alert-tags">
          <span class="tag ${categoryTag}">${categoryEmoji} ${alert.category}</span>
          <span class="tag tag-urgency ${urgencyClass}">${alert.urgency}</span>
        </div>
      </div>
      
      <div class="alert-message-content">
        ${escapeHtml(alert.message)}
      </div>

      <div class="alert-analysis-box">
        <div class="analysis-title">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="feather"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
          Análise e Sugestão de Resposta (Zapizi AI)
        </div>
        <div class="analysis-reason">
          <strong>Motivo:</strong> ${escapeHtml(alert.reason)}
        </div>
        <div class="suggested-reply-text" id="reply-text-${alert.id}">
          ${alert.suggestedReply ? escapeHtml(alert.suggestedReply) : '<em>Nenhuma resposta disponível. Configure sua chave API do Gemini para gerar automaticamente.</em>'}
        </div>
      </div>

      <div class="alert-actions">
        ${actionsHtml}
      </div>
    </div>
  `;
}

// Excluir / Resolver Alerta
async function deleteAlert(id) {
  if (confirm('Tem certeza que deseja remover este alerta do feed?')) {
    try {
      const res = await apiFetch(`/api/alerts/${id}`, { method: 'DELETE' });
      if (res.ok) {
        alertsList = alertsList.filter(a => a.id !== id);
        renderAlerts();
      }
    } catch (e) {
      alert('Erro ao excluir alerta.');
    }
  }
}
window.deleteAlert = deleteAlert;

// Copiar resposta sugerida para a área de transferência
function copyReply(id, buttonEl) {
  const replyText = document.getElementById(`reply-text-${id}`).textContent.trim();
  navigator.clipboard.writeText(replyText).then(() => {
    const originalText = buttonEl.innerHTML;
    buttonEl.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Copiado!`;
    buttonEl.style.backgroundColor = 'var(--accent-green)';
    buttonEl.style.color = 'white';
    
    setTimeout(() => {
      buttonEl.innerHTML = originalText;
      buttonEl.style.backgroundColor = '';
      buttonEl.style.color = '';
    }, 2000);
  }).catch(err => {
    alert('Não foi possível copiar o texto automaticamente.');
  });
}
window.copyReply = copyReply;

// Regerar a resposta (chama a API do Gemini novamente)
async function regenerateReply(id, buttonEl) {
  const originalText = buttonEl.textContent;
  buttonEl.disabled = true;
  buttonEl.textContent = 'Gerando...';
  
  try {
    const res = await apiFetch(`/api/alerts/${id}/regenerate`, { method: 'POST' });
    if (res.ok) {
      const updatedAlert = await res.json();
      
      // Atualiza o alerta na lista global
      const idx = alertsList.findIndex(a => a.id === id);
      if (idx !== -1) {
        alertsList[idx] = updatedAlert;
        renderAlerts();
      }
    } else {
      alert('Falha ao gerar resposta. Verifique sua chave API nas configurações.');
    }
  } catch (e) {
    alert('Erro ao se conectar ao servidor.');
  } finally {
    buttonEl.disabled = false;
    buttonEl.textContent = originalText;
  }
}
window.regenerateReply = regenerateReply;

// Buscar Lista de Grupos Filtrados
async function fetchGroups() {
  try {
    const res = await apiFetch('/api/groups');
    const data = await res.json();
    
    groupsList = data;
    renderGroups();
  } catch (e) {
    console.error('Erro ao carregar grupos:', e);
  }
}

// Renderizar Tabela de Grupos Monitorados
function renderGroups() {
  const tbody = document.getElementById('groups-list-body');
  const countStat = document.getElementById('stat-groups-count');
  
  countStat.textContent = groupsList.length;

  if (groupsList.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4" class="table-empty">
          ${connectionStatus === 'READY' 
            ? 'Nenhum grupo ativo contendo as palavras-chave foi encontrado.' 
            : 'Conecte sua conta do WhatsApp para carregar a lista de grupos.'}
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = groupsList.map(group => `
    <tr>
      <td><strong>${escapeHtml(group.name)}</strong></td>
      <td style="font-family: monospace; color: var(--text-muted);">${group.id}</td>
      <td>
        <span class="tag ${group.unreadCount > 0 ? 'tag-opportunity' : 'tag-urgency'}">
          ${group.unreadCount} mensagens
        </span>
      </td>
      <td><span class="text-green">● Ativo</span></td>
    </tr>
  `).join('');
}

// Buscar Configurações (Keywords e Chave API)
async function fetchSettings() {
  try {
    const res = await apiFetch('/api/settings');
    const data = await res.json();
    
    hasGeminiKey = data.hasApiKey;
    
    // Atualizar UI de configurações
    document.getElementById('keywords-input').value = data.keywords.join(', ');
    document.getElementById('api-key-input').placeholder = data.hasApiKey 
      ? '•••••••••••••••••••••••••••••••••••• (Salva)' 
      : 'Cole sua AI Studio API Key aqui';
      
    // Atualizar card de inteligência
    const aiStatus = document.getElementById('stat-ai-status');
    if (data.hasApiKey) {
      aiStatus.textContent = 'Ativo (Gemini)';
      aiStatus.parentElement.parentElement.className = 'glass-card stat-card glow-green';
    } else {
      aiStatus.textContent = 'Heurística';
      aiStatus.parentElement.parentElement.className = 'glass-card stat-card glow-purple';
    }
  } catch (e) {
    console.error('Erro ao carregar configurações:', e);
  }
}

// Salvar Configurações no Servidor
function setupSettingsForm() {
  const form = document.getElementById('settings-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const keywordsVal = document.getElementById('keywords-input').value;
    const apiKeyVal = document.getElementById('api-key-input').value;

    const keywords = keywordsVal.split(',').map(kw => kw.trim()).filter(kw => kw !== '');
    const body = { keywords };
    
    // Apenas envia a chave API se o usuário digitou uma nova
    if (apiKeyVal.trim() !== '') {
      body.geminiApiKey = apiKeyVal.trim();
    }

    try {
      const res = await apiFetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        alert('Configurações salvas com sucesso!');
        document.getElementById('api-key-input').value = ''; // Limpa campo de senha
        fetchSettings();
        fetchGroups();
      } else {
        alert('Erro ao salvar configurações.');
      }
    } catch (e) {
      alert('Falha ao conectar ao servidor ou login necessário.');
    }
  });
}

// Utilitário para evitar ataques de injeção XSS nas mensagens
function escapeHtml(unsafe) {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
