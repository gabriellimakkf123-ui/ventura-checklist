/* ==========================================================================
   VENTURA ADVENTURE SISTEMAS - APP.JS
   Lógica do Check-List, Integração com Banco de Dados, Histórico e PDF
   ========================================================================== */

// Modelos Padrão para cada linha de veículo Ventura, Linhai e Kayo
const DEFAULT_TEMPLATES = {
  atv: {
    title: "CHECK LIST – TRANSPORTE DE VEÍCULO NOVO",
    subtitle: "LINHA ATV's – LINHAI",
    agreement: "Estamos cientes dos itens observados na pintura, acessórios e demais componentes, ficando desta forma a VENTURA isenta de qualquer observação de avaria ou falta de componentes destacados neste conhecimento de entrega, não cabendo reclamações posteriores.",
    left: [
      "Paralama dianteiro direito",
      "Paralama dianteiro esquerdo",
      "Paralama traseiro direito",
      "Paralama traseiro esquerdo",
      "Lateral direita",
      "Lateral esquerda",
      "Grade dianteira",
      "Protetor de impacto dianteiro",
      "Banco",
      "Soleira direita",
      "Soleira esquerda",
      "Retrovisor lado direito",
      "Retrovisor lado esquerdo",
      "Ferramentas",
      "Controle remoto do guincho",
      "Guincho (caso equipado)",
      "Pino do Engate traseiro"
    ],
    right: [
      "Chaves",
      "Painel de LCD",
      "Pintura em Geral",
      "Tampa do tanque",
      "Rodas / Pneus",
      "Manuais",
      "Bateria",
      "Farol dianteiro lado direito",
      "Farol dianteiro lado esquerdo",
      "Lanterna de led traseira",
      "Pisca traseiro lado direito",
      "Pisca traseiro lado esquerdo",
      "Comandos do guidão lado direito",
      "Comandos do guidão lado esquerdo",
      "Manopla do cambio",
      "Tampa compartimento dianteiro",
      "Tampa compartimento traseiro"
    ]
  },
  utv: {
    title: "CHECK LIST – TRANSPORTE DE VEÍCULO NOVO",
    subtitle: "LINHA UTV's – LINHAI",
    agreement: "Estamos cientes dos itens observados na gaiola de proteção, cintos, acessórios e estrutura do UTV Linhai, ficando a empresa isenta de observações ou avarias não registradas neste documento no momento do recebimento.",
    left: [
      "Gaiola de proteção (Roll cage)",
      "Porta / Rede lateral direita",
      "Porta / Rede lateral esquerda",
      "Parabrisa dianteiro",
      "Parabrisa traseiro / Teto",
      "Banco motorista",
      "Banco passageiro",
      "Cinto de segurança 4 pontos motorista",
      "Cinto de segurança 4 pontos passageiro",
      "Caçamba traseira",
      "Capô dianteiro",
      "Soleiras / Protetores inferiores",
      "Retrovisor externo direito",
      "Retrovisor externo esquerdo",
      "Retrovisor interno",
      "Guincho dianteiro elétrico",
      "Engate reboque"
    ],
    right: [
      "Chaves de ignição / Codificada",
      "Painel digital TFT / LCD",
      "Pintura e Grafismo",
      "Tampa do combustível",
      "Rodas off-road / Pneus",
      "Manuais de operação",
      "Bateria reforçada",
      "Faróis de LED dianteiros",
      "Barra de LED auxiliar (teto)",
      "Lanterna de LED traseira",
      "Piscas / Luz de freio",
      "Volante e regulagem de altura",
      "Alavanca de câmbio (P/R/N/H/L)",
      "Porta-luvas e compartimentos impermeáveis",
      "Tração 4x4 / Bloqueio do diferencial"
    ]
  },
  infantil_quad: {
    title: "CHECK LIST – TRANSPORTE DE VEÍCULO NOVO",
    subtitle: "LINHA ATV's – KAYO",
    agreement: "Estamos cientes dos itens observados no quadriciclo Kayo, incluindo dispositivos de segurança obrigatórios (limitador de velocidade e trava de segurança/tether), acessórios e carenagem, ficando a VENTURA isenta de qualquer reclamação posterior à entrega.",
    left: [
      "Paralama dianteiro direito",
      "Paralama dianteiro esquerdo",
      "Paralama traseiro direito",
      "Paralama traseiro esquerdo",
      "Carenagem lateral direita",
      "Carenagem lateral esquerda",
      "Parachoque dianteiro",
      "Banco Kayo",
      "Protetores de pé fechados (Footwells)",
      "Ferramentas de ajuste",
      "Limitador de velocidade no acelerador",
      "Chave / Trava de segurança (Tether switch)"
    ],
    right: [
      "Chave de partida",
      "Painel / Indicadores LED",
      "Pintura em Geral",
      "Tampa do tanque com trava",
      "Rodas / Pneus infantis",
      "Manual do Proprietário Kayo",
      "Bateria 12V",
      "Farol dianteiro",
      "Lanterna traseira",
      "Comandos do guidão / Freios",
      "Manopla do freio / trava de estacionamento",
      "Kit de adesivos decorativos Kayo"
    ]
  },
  infantil_moto: {
    title: "CHECK LIST – TRANSPORTE DE VEÍCULO NOVO",
    subtitle: "LINHA MOTO – KAYO",
    agreement: "Estamos cientes dos itens observados na moto cross Kayo, incluindo itens de segurança (corta-corrente, limitador de aceleração e protetores térmicos), suspensões e carenagens, ficando a VENTURA isenta de reclamações posteriores à entrega.",
    left: [
      "Paralama dianteiro",
      "Paralama traseiro",
      "Plate frontal (Número)",
      "Carenagem lateral esquerda",
      "Carenagem lateral direita",
      "Banco Cross Kayo",
      "Guidão e protetor de guidão (Bar pad)",
      "Suspensão dianteira (Bengalas / Garfo)",
      "Suspensão traseira (Amortecedor Monoshock)",
      "Limitador de aceleração",
      "Chave de segurança (Corta-corrente)",
      "Ferramentas e kit de ajuste"
    ],
    right: [
      "Chave de ignição / Botão de partida",
      "Pedaleira esquerda",
      "Pedaleira direita",
      "Protetor de corrente e guia de corrente",
      "Escapamento e protetor térmico",
      "Freio a disco dianteiro (Manete)",
      "Freio a disco traseiro (Pedal/Manete)",
      "Descanso lateral (Pezinho)",
      "Rodas / Pneus Off-Road (Biscoito)",
      "Pressão e calibragem dos pneus",
      "Manual do Proprietário Kayo",
      "Kit de grafismos / adesivos Kayo"
    ]
  }
};

// Estado Atual do Sistema
let currentLine = 'atv';
let currentEditingLine = 'atv';
let activeChecklistId = null; // ID se estiver editando um registro existente
let templatesData = JSON.parse(localStorage.getItem('ventura_templates')) || JSON.parse(JSON.stringify(DEFAULT_TEMPLATES));
let componentStatusMap = {};

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  initLineSelector();
  initThemeSelector();
  initComponentTables();
  renderDiagram();
  initCanvasSignatures();
  initModalEvents();
  initHistoryModalEvents();
  initActionButtons();
});

// Alternar Temas
function initThemeSelector() {
  const themeBtns = document.querySelectorAll('.theme-btn');
  themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = btn.getAttribute('data-theme');
      document.body.setAttribute('data-theme', theme);
      
      themeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}

// Alternar Linhas de Veículos
function initLineSelector() {
  const buttons = document.querySelectorAll('.line-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const line = btn.getAttribute('data-line');
      if (line === currentLine) return;
      
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      currentLine = line;
      loadLineTemplate(currentLine);
    });
  });
}

function loadLineTemplate(lineKey) {
  const tpl = templatesData[lineKey] || DEFAULT_TEMPLATES[lineKey];
  document.getElementById('docSubtitle').innerText = tpl.subtitle;
  document.getElementById('docTitle').innerText = tpl.title;
  document.getElementById('agreementTextContent').innerText = tpl.agreement;
  
  componentStatusMap = {};
  initComponentTables();
  renderDiagram();
}

// Renderizar Tabelas de Componentes
function initComponentTables() {
  const tpl = templatesData[currentLine] || DEFAULT_TEMPLATES[currentLine];
  const colLeft = document.getElementById('columnLeft');
  const colRight = document.getElementById('columnRight');

  colLeft.innerHTML = createColumnHTML(tpl.left);
  colRight.innerHTML = createColumnHTML(tpl.right);

  document.querySelectorAll('.opt-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const row = btn.closest('.comp-row');
      const itemLabel = row.getAttribute('data-item');
      const status = btn.getAttribute('data-status');

      row.querySelectorAll('.opt-btn').forEach(b => b.classList.remove('active'));
      
      if (componentStatusMap[itemLabel] === status) {
        delete componentStatusMap[itemLabel];
      } else {
        btn.classList.add('active');
        componentStatusMap[itemLabel] = status;
      }
    });
  });
}

function createColumnHTML(items) {
  let html = `
    <div class="comp-header">
      <span class="col-name">Componente</span>
      <div class="col-opts">
        <span>OK</span><span>RD</span><span>AD</span><span>DD</span><span>QD</span><span>FT</span>
      </div>
    </div>
  `;

  items.forEach(item => {
    const currentSt = componentStatusMap[item] || '';
    html += `
      <div class="comp-row" data-item="${escapeHtml(item)}">
        <span class="comp-label">${escapeHtml(item)}</span>
        <div class="comp-options">
          <button class="opt-btn st-ok ${currentSt === 'OK' ? 'active' : ''}" data-status="OK">OK</button>
          <button class="opt-btn st-rd ${currentSt === 'RD' ? 'active' : ''}" data-status="RD">RD</button>
          <button class="opt-btn st-ad ${currentSt === 'AD' ? 'active' : ''}" data-status="AD">AD</button>
          <button class="opt-btn st-dd ${currentSt === 'DD' ? 'active' : ''}" data-status="DD">DD</button>
          <button class="opt-btn st-qd ${currentSt === 'QD' ? 'active' : ''}" data-status="QD">QD</button>
          <button class="opt-btn st-ft ${currentSt === 'FT' ? 'active' : ''}" data-status="FT">FT</button>
        </div>
      </div>
    `;
  });

  return html;
}

// Renderizar Espaço do Diagrama em Branco
function renderDiagram() {
  const container = document.getElementById('diagramsContainer');
  container.innerHTML = `
    <div class="blank-diagram-box">
      <div class="blank-icon">📋</div>
      <div class="blank-text">ESPAÇO RESERVADO PARA ILUSTRAÇÕES ESQUEMÁTICAS DO VEÍCULO</div>
      <div class="blank-sub">(Aguardando ilustrações oficiais do setor de design Ventura)</div>
    </div>
  `;
}

// Inicializar Assinaturas Canvas
function initCanvasSignatures() {
  setupCanvas('canvasTransportador');
  setupCanvas('canvasRevendedor');

  document.querySelectorAll('.clear-canvas-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const canvasId = btn.getAttribute('data-target');
      const canvas = document.getElementById(canvasId);
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
  });
}

function setupCanvas(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let isDrawing = false;

  ctx.strokeStyle = '#003366';
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';

  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height)
    };
  }

  function startDrawing(e) {
    isDrawing = true;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  }

  function draw(e) {
    if (!isDrawing) return;
    e.preventDefault();
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  }

  function stopDrawing() {
    isDrawing = false;
  }

  canvas.addEventListener('mousedown', startDrawing);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', stopDrawing);
  canvas.addEventListener('mouseleave', stopDrawing);

  canvas.addEventListener('touchstart', startDrawing, { passive: false });
  canvas.addEventListener('touchmove', draw, { passive: false });
  canvas.addEventListener('touchend', stopDrawing);
}

// Botões Principais & Ações de Banco de Dados
function initActionButtons() {
  // Novo Check-List Vazio
  document.getElementById('btnNewChecklist').addEventListener('click', () => {
    if (confirm("Deseja limpar todos os campos do check-list atual?")) {
      clearFormFields();
      activeChecklistId = null;
    }
  });

  // Salvar no Banco de Dados
  document.getElementById('btnSaveToDB').addEventListener('click', async () => {
    await saveFormToDatabase();
  });

  // Baixar PDF Colorido
  document.getElementById('btnDownloadPDF').addEventListener('click', () => {
    generateColoredPDF();
  });

  // Imprimir via Impressora
  document.getElementById('btnPrint').addEventListener('click', () => {
    window.print();
  });
}

function clearFormFields() {
  document.getElementById('fieldEmpresa').value = '';
  document.getElementById('fieldCnpj').value = '';
  document.getElementById('fieldTecnico').value = '';
  document.getElementById('fieldName').value = '';
  document.getElementById('fieldPhone').value = '';
  document.getElementById('fieldAddress').value = '';
  document.getElementById('fieldModel').value = '';
  document.getElementById('fieldColor').value = '';
  document.getElementById('fieldChassis').value = '';
  document.getElementById('fieldKm').value = '';
  document.getElementById('fieldObs').value = '';
  document.getElementById('sigTranspName').value = '';
  document.getElementById('sigTranspRg').value = '';
  document.getElementById('sigRevendName').value = '';
  document.getElementById('sigRevendRg').value = '';

  document.querySelectorAll('input[name="fuelLevel"]').forEach(r => r.checked = false);

  ['canvasTransportador', 'canvasRevendedor'].forEach(id => {
    const c = document.getElementById(id);
    c.getContext('2d').clearRect(0, 0, c.width, c.height);
  });

  componentStatusMap = {};
  initComponentTables();
}

async function saveFormToDatabase() {
  const selectedFuel = document.querySelector('input[name="fuelLevel"]:checked');
  const fuelValue = selectedFuel ? selectedFuel.value : '';

  const cTransp = document.getElementById('canvasTransportador');
  const cRevend = document.getElementById('canvasRevendedor');

  const recordData = {
    id: activeChecklistId,
    empresa: document.getElementById('fieldEmpresa').value.trim(),
    cnpj: document.getElementById('fieldCnpj').value.trim(),
    tecnico: document.getElementById('fieldTecnico').value.trim(),
    cliente: document.getElementById('fieldName').value.trim(),
    telefone: document.getElementById('fieldPhone').value.trim(),
    endereco: document.getElementById('fieldAddress').value.trim(),
    modelo: document.getElementById('fieldModel').value.trim(),
    cor: document.getElementById('fieldColor').value.trim(),
    chassis: document.getElementById('fieldChassis').value.trim(),
    km: document.getElementById('fieldKm').value.trim(),
    fuel: fuelValue,
    line: currentLine,
    statusMap: componentStatusMap,
    obs: document.getElementById('fieldObs').value.trim(),
    sigTransp: cTransp.toDataURL(),
    sigRevend: cRevend.toDataURL()
  };

  const savedRecord = await window.venturaDB.saveChecklist(recordData);
  activeChecklistId = savedRecord.id;

  alert(`✅ Check-List salvo com sucesso no Banco de Dados!\nID: ${savedRecord.id}`);
}

// Lógica do Modal de Histórico do Banco de Dados
function initHistoryModalEvents() {
  const modal = document.getElementById('historyModal');
  const btnOpen = document.getElementById('btnOpenHistory');
  const btnCloseHeader = document.getElementById('btnCloseHistoryModal');
  const btnCloseFooter = document.getElementById('btnCloseHistoryFooter');

  btnOpen.addEventListener('click', () => {
    renderHistoryTable();
    modal.classList.add('active');
  });

  [btnCloseHeader, btnCloseFooter].forEach(btn => {
    btn.addEventListener('click', () => modal.classList.remove('active'));
  });

  // Busca e Filtros
  document.getElementById('dbSearchInput').addEventListener('input', () => renderHistoryTable());
  document.getElementById('dbCategoryFilter').addEventListener('change', () => renderHistoryTable());

  // Exportar Backup
  document.getElementById('btnExportDB').addEventListener('click', () => {
    window.venturaDB.exportBackupJSON();
  });

  // Importar Backup
  document.getElementById('btnImportDB').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(evt) {
      const ok = window.venturaDB.importBackupJSON(evt.target.result);
      if (ok) {
        alert('Backup importado com sucesso!');
        renderHistoryTable();
      } else {
        alert('Erro ao importar backup JSON.');
      }
    };
    reader.readAsText(file);
  });
}

function renderHistoryTable() {
  const query = document.getElementById('dbSearchInput').value;
  const categoryFilter = document.getElementById('dbCategoryFilter').value;
  const tbody = document.getElementById('dbTableBody');

  const records = window.venturaDB.getChecklists(query, categoryFilter);

  if (records.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; padding: 2rem; color: #94a3b8;">
          Nenhum check-list encontrado no banco de dados.
        </td>
      </tr>
    `;
    return;
  }

  const categoryNames = {
    atv: "ATV's - Linhai",
    utv: "UTV's - Linhai",
    infantil_quad: "ATV's - Kayo",
    infantil_moto: "MOTO - Kayo"
  };

  tbody.innerHTML = records.map(r => {
    const formattedDate = new Date(r.created_at).toLocaleString('pt-BR');
    const catLabel = categoryNames[r.categoria] || r.categoria;

    return `
      <tr>
        <td>${formattedDate}</td>
        <td><strong>${escapeHtml(r.cliente || 'Sem Nome')}</strong></td>
        <td><span class="badge-cat">${escapeHtml(catLabel)}</span> <br><small>${escapeHtml(r.modelo || '')}</small></td>
        <td><code>${escapeHtml(r.chassi || '-')}</code></td>
        <td>${escapeHtml(r.tecnico || '-')}</td>
        <td>
          <div class="db-action-btns">
            <button class="db-act-btn load" onclick="loadChecklistFromDB('${r.id}')" title="Carregar no formulário">👁️ Ver</button>
            <button class="db-act-btn pdf" onclick="downloadPDFFromDB('${r.id}')" title="Baixar PDF">📥 PDF</button>
            <button class="db-act-btn del" onclick="deleteChecklistFromDB('${r.id}')" title="Excluir">🗑️</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// Funções globais para botões inline da tabela de histórico
window.loadChecklistFromDB = function(id) {
  const r = window.venturaDB.getChecklistById(id);
  if (!r) return;

  activeChecklistId = r.id;

  // Selecionar linha de veículo
  if (r.categoria && r.categoria !== currentLine) {
    currentLine = r.categoria;
    document.querySelectorAll('.line-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-line') === currentLine);
    });
    loadLineTemplate(currentLine);
  }

  // Preencher campos
  document.getElementById('fieldEmpresa').value = r.empresa || '';
  document.getElementById('fieldCnpj').value = r.cnpj || '';
  document.getElementById('fieldTecnico').value = r.tecnico || '';
  document.getElementById('fieldName').value = r.cliente || '';
  document.getElementById('fieldPhone').value = r.telefone || '';
  document.getElementById('fieldAddress').value = r.endereco || '';
  document.getElementById('fieldModel').value = r.modelo || '';
  document.getElementById('fieldColor').value = r.cor || '';
  document.getElementById('fieldChassis').value = r.chassi || '';
  document.getElementById('fieldKm').value = r.km || '';
  document.getElementById('fieldObs').value = r.observacoes || '';

  // Combustível
  document.querySelectorAll('input[name="fuelLevel"]').forEach(rad => {
    rad.checked = (rad.value === r.combustivel);
  });

  // Restaurar status dos componentes
  componentStatusMap = r.statusMap || {};
  initComponentTables();

  // Fechar modal de histórico
  document.getElementById('historyModal').classList.remove('active');
};

window.downloadPDFFromDB = function(id) {
  window.loadChecklistFromDB(id);
  setTimeout(() => {
    generateColoredPDF();
  }, 300);
};

window.deleteChecklistFromDB = function(id) {
  if (confirm("Tem certeza que deseja excluir este check-list do banco de dados?")) {
    window.venturaDB.deleteChecklist(id);
    renderHistoryTable();
  }
};

// Função para Baixar PDF Colorido
function generateColoredPDF() {
  const element = document.getElementById('printablePaper');
  const clientName = document.getElementById('fieldName').value.trim() || 'Cliente';
  const modelName = document.getElementById('fieldModel').value.trim() || 'Veiculo';
  
  const cleanClient = clientName.replace(/[^a-zA-Z0-9]/g, '_');
  const cleanModel = modelName.replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `CheckList_Ventura_${cleanModel}_${cleanClient}.pdf`;

  const btn = document.getElementById('btnDownloadPDF');
  const originalText = btn.innerHTML;
  btn.innerHTML = '<span>⏳ Gerando PDF...</span>';
  btn.disabled = true;

  const opt = {
    margin:       [4, 4, 4, 4],
    filename:     filename,
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2, useCORS: true, logging: false },
    jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  if (typeof html2pdf !== 'undefined') {
    html2pdf().set(opt).from(element).save().then(() => {
      btn.innerHTML = originalText;
      btn.disabled = false;
    }).catch(err => {
      console.error('Erro ao gerar PDF:', err);
      btn.innerHTML = originalText;
      btn.disabled = false;
      window.print();
    });
  } else {
    window.print();
    btn.innerHTML = originalText;
    btn.disabled = false;
  }
}

// Lógica do Modal de Edição
function initModalEvents() {
  const modal = document.getElementById('editModal');
  const btnEdit = document.getElementById('btnEditTemplate');
  const btnClose = document.getElementById('btnCloseModal');

  btnEdit.addEventListener('click', () => {
    currentEditingLine = currentLine;
    updateSubLineToggleButtons();
    loadEditModalData();
    modal.classList.add('active');
  });

  btnClose.addEventListener('click', () => {
    modal.classList.remove('active');
  });

  const tabBtns = modal.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      modal.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const target = btn.getAttribute('data-tab');
      document.getElementById(target).classList.add('active');
    });
  });

  const subBtns = modal.querySelectorAll('.sub-line-btn');
  subBtns.forEach(sb => {
    sb.addEventListener('click', () => {
      currentEditingLine = sb.getAttribute('data-modline');
      updateSubLineToggleButtons();
      loadEditModalData();
    });
  });

  document.getElementById('btnAddItem').addEventListener('click', () => {
    const input = document.getElementById('newItemInput');
    const colSelect = document.getElementById('newItemColumn').value;
    const text = input.value.trim();

    if (!text) return;

    const tpl = templatesData[currentEditingLine];
    if (colSelect === 'left') {
      tpl.left.push(text);
    } else {
      tpl.right.push(text);
    }

    input.value = '';
    loadEditModalData();
  });

  document.getElementById('btnResetDefault').addEventListener('click', () => {
    if (confirm("Deseja restaurar os itens e termos originais de fábrica da Ventura?")) {
      templatesData = JSON.parse(JSON.stringify(DEFAULT_TEMPLATES));
      localStorage.removeItem('ventura_templates');
      loadEditModalData();
      loadLineTemplate(currentLine);
      alert("Modelos restaurados com sucesso!");
    }
  });

  document.getElementById('btnSaveTemplate').addEventListener('click', () => {
    const titleVal = document.getElementById('editDocTitleInput').value.trim();
    const agreementVal = document.getElementById('editAgreementInput').value.trim();

    if (templatesData[currentEditingLine]) {
      templatesData[currentEditingLine].title = titleVal;
      templatesData[currentEditingLine].agreement = agreementVal;
    }

    localStorage.setItem('ventura_templates', JSON.stringify(templatesData));
    loadLineTemplate(currentLine);
    modal.classList.remove('active');
    alert("Modelo atualizado com sucesso!");
  });
}

function updateSubLineToggleButtons() {
  document.querySelectorAll('.sub-line-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-modline') === currentEditingLine);
  });
}

function loadEditModalData() {
  const tpl = templatesData[currentEditingLine] || DEFAULT_TEMPLATES[currentEditingLine];
  
  document.getElementById('editDocTitleInput').value = tpl.title;
  document.getElementById('editAgreementInput').value = tpl.agreement;

  const editLeft = document.getElementById('editListLeft');
  editLeft.innerHTML = tpl.left.map((item, idx) => `
    <li class="edit-item-row">
      <span>${escapeHtml(item)}</span>
      <button class="delete-item-btn" onclick="removeEditItem('left', ${idx})">&times;</button>
    </li>
  `).join('');

  const editRight = document.getElementById('editListRight');
  editRight.innerHTML = tpl.right.map((item, idx) => `
    <li class="edit-item-row">
      <span>${escapeHtml(item)}</span>
      <button class="delete-item-btn" onclick="removeEditItem('right', ${idx})">&times;</button>
    </li>
  `).join('');
}

window.removeEditItem = function(col, index) {
  const tpl = templatesData[currentEditingLine];
  if (col === 'left') {
    tpl.left.splice(index, 1);
  } else {
    tpl.right.splice(index, 1);
  }
  loadEditModalData();
};

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
