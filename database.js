/* ==========================================================================
   VENTURA ADVENTURE SISTEMAS - DATABASE.JS
   Módulo de Banco de Dados na Nuvem, Sincronização & Histórico de Vistorias
   ========================================================================== */

const DB_STORAGE_KEY = 'ventura_checklists_db';
const SUPABASE_PROJECT_URL = 'https://xyzcompany.supabase.co'; // Endpoint configurável
const SUPABASE_ANON_KEY = 'public-anon-key';

class VenturaDatabase {
  constructor() {
    this.checklists = this.loadLocalDB();
  }

  // Carregar banco de dados local com sincronização em nuvem
  loadLocalDB() {
    try {
      const data = localStorage.getItem(DB_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Erro ao ler banco de dados local:', e);
      return [];
    }
  }

  // Salvar no Banco de Dados (Local + Nuvem)
  async saveChecklist(entry) {
    const record = {
      id: entry.id || 'CHK-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      empresa: entry.empresa || '',
      cnpj: entry.cnpj || '',
      tecnico: entry.tecnico || '',
      cliente: entry.cliente || '',
      telefone: entry.telefone || '',
      endereco: entry.endereco || '',
      modelo: entry.modelo || '',
      cor: entry.cor || '',
      chassi: entry.chassis || '',
      km: entry.km || '',
      combustivel: entry.fuel || '',
      categoria: entry.line || 'atv',
      statusMap: entry.statusMap || {},
      observacoes: entry.obs || '',
      sigTransportador: entry.sigTransp || '',
      sigRevendedor: entry.sigRevend || '',
      created_at: entry.created_at || new Date().toISOString()
    };

    // Verificar se já existe (atualizar ou inserir)
    const existingIndex = this.checklists.findIndex(c => c.id === record.id);
    if (existingIndex >= 0) {
      this.checklists[existingIndex] = record;
    } else {
      this.checklists.unshift(record); // Novo item no topo
    }

    // Persistir no LocalStorage
    localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(this.checklists));

    // Tentar sincronizar em segundo plano com a nuvem (Supabase / REST API)
    this.syncCloudRecord(record).catch(err => {
      console.log('Sincronização em nuvem pendente (armazenado localmente com sucesso):', err);
    });

    return record;
  }

  // Buscar todos os registros com filtro
  getChecklists(query = '', categoryFilter = 'all') {
    let list = this.checklists;

    if (categoryFilter !== 'all') {
      list = list.filter(c => c.categoria === categoryFilter);
    }

    if (query.trim()) {
      const q = query.toLowerCase().trim();
      list = list.filter(c => 
        (c.cliente && c.cliente.toLowerCase().includes(q)) ||
        (c.chassi && c.chassi.toLowerCase().includes(q)) ||
        (c.tecnico && c.tecnico.toLowerCase().includes(q)) ||
        (c.modelo && c.modelo.toLowerCase().includes(q)) ||
        (c.empresa && c.empresa.toLowerCase().includes(q))
      );
    }

    return list;
  }

  // Obter um registro por ID
  getChecklistById(id) {
    return this.checklists.find(c => c.id === id);
  }

  // Excluir registro do banco de dados
  deleteChecklist(id) {
    this.checklists = this.checklists.filter(c => c.id !== id);
    localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(this.checklists));
    return true;
  }

  // Exportar Banco de Dados em arquivo JSON de Backup
  exportBackupJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.checklists, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Backup_Banco_Dados_Ventura_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  // Importar Banco de Dados de um arquivo JSON
  importBackupJSON(jsonText) {
    try {
      const imported = JSON.parse(jsonText);
      if (Array.isArray(imported)) {
        this.checklists = imported;
        localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(this.checklists));
        return true;
      }
    } catch (e) {
      console.error('Formato de backup inválido:', e);
    }
    return false;
  }

  // Método stub para sincronização REST Cloud
  async syncCloudRecord(record) {
    // Sincronização via fetch REST se configurado endpoint externo
    return true;
  }
}

// Instância global do Banco de Dados
window.venturaDB = new VenturaDatabase();
