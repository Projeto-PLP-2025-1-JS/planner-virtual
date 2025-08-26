let metas = []; 
let proximoId = 1;

function criarMeta(descricao, categoria, periodo) {
  const novaMeta = new Meta(proximoId++, descricao, categoria, periodo);
  salvarMetasServer(novaMeta);
  carregarMetasServer();
}

function listarMetas(periodo) {
  return metas.filter(meta => meta.periodo === periodo);
}

async function salvarMetasServer(meta) {
  try {
    const response = await fetch('http://localhost:3333/meta/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(meta)
    });
    if (!response.ok) throw new Error('Erro ao salvar metas');
  } catch (error) {
    console.error(error);
  }
}

function deletarMetaId(id) {
  const index = metas.findIndex(m => m.id === id);
  if (index !== -1) {
    metas.splice(index, 1);
    salvarMetasLocal();
    renderMetas(); 
  }
}

async function carregarMetas() {
  try {
    const response = await fetch('http://localhost:3333/meta/get', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error('Erro ao carregar metas');
    const data = await response.json();
    metas = data.map(d => {
      const meta = new Meta(d.id, d.descricao, d.categoria, d.periodo);
      meta.status = d.status;
      meta.dataCriacao = d.dataCriacao;
      meta.dataFinal = d.dataFinal;
      return meta;
    });
    renderMetas();
  } catch (error) {
    console.error(error);
  }
}

function atualizarStatusMeta(id, status) {
  const meta = metas.find(m => m.id === id);
  if (meta) {
    meta.atualizarStatus(status);
    salvarMetas();
    renderMetas();
  }
}

function falhaStatusMeta() {
  const hoje = new Date().toISOString().slice(0, 10); // só data
  console.log(hoje);
  metas.forEach(meta => {
    if (meta.status === 'pendente' && meta.dataFinal < hoje) {
      meta.status = 'falha';
    }
  });
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

carregarMetas();
