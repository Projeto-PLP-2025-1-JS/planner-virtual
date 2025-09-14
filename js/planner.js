// Cria uma nova meta e recarrega do backend
async function criarMeta(descricao, categoria, periodo) {
  const novaMeta = new Meta(null, descricao, categoria, periodo);
  await salvarMetasServer(novaMeta);
  await carregarERenderMetas();
}

// Salva meta no backend
async function salvarMetasServer(meta) {
  try {
    const response = await fetch('http://localhost:3333/meta/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(meta)
    });
    if (!response.ok) throw new Error('Erro ao salvar meta');
  } catch (error) {
    console.error(error);
  }
}

// Deleta meta no backend e recarrega
async function deletarMetaId(id) {
  try {
    const response = await fetch(`http://localhost:3333/meta/delete/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Erro ao deletar meta');
    await carregarERenderMetas();
  } catch (error) {
    console.error(error);
  }
}

// Atualiza status da meta e recarrega
async function atualizarStatusMeta(id, status) {
  try {
    // Busca meta atual direto do backend
    const responseGet = await fetch(`http://localhost:3333/meta/get/${id}`);
    const meta = await responseGet.json();
    meta.status = status;

    const responsePut = await fetch(`http://localhost:3333/meta/update/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(meta)
    });
    if (!responsePut.ok) throw new Error('Erro ao atualizar meta');

    await carregarERenderMetas();
  } catch (error) {
    console.error(error);
  }
}

// Função única que carrega metas do backend e renderiza
async function carregarERenderMetas() {
  try {
    const response = await fetch('http://localhost:3333/meta/getAll');
    if (!response.ok) throw new Error('Erro ao carregar metas');
    const data = await response.json();

    // Converte datas para objetos Date
    const metasFormatadas = data.map(d => {
      const meta = new Meta(d.id, d.descricao, d.categoria, d.periodo);
      meta.status = d.status;
      meta.dataCriacao = d.dataCriacao ? new Date(d.dataCriacao) : null;
      meta.dataFinal = d.dataFinal ? new Date(d.dataFinal) : null;
      meta.dataConcluida = d.dataConcluida ? new Date(d.dataConcluida) : null;
      return meta;
    });

    renderMetas(metasFormatadas);
  } catch (error) {
    console.error(error);
  }
}

function filtrarMetas(metas, categoria, periodo) {
  return metas.filter(meta => {
    const categoriaOk = !categoria || meta.categoria === categoria;
    const periodoOk = !periodo || meta.periodo === periodo;
    return categoriaOk && periodoOk;
  });
}

// Função de renderização recebe os dados como parâmetro
function renderMetas(metas) {
  const listaMetasDiv = document.getElementById('lista-metas');
  listaMetasDiv.innerHTML = '';

  const hoje = new Date();
  metas.forEach(meta => {
    if (meta.status === 'pendente' && meta.dataFinal && meta.dataFinal < hoje) {
      meta.status = 'falha';
    }

    const div = document.createElement('div');
    div.className = `meta ${meta.status}`;
    div.innerHTML = `
      <strong>${capitalize(meta.descricao)}</strong>
      <br>Status: ${capitalize(meta.status)}
      <br>Data final: ${meta.dataFinal ? meta.dataFinal.toISOString().slice(0,10) : '-'}
      <br>
    `;

    const btnSucesso = document.createElement('button');
    btnSucesso.textContent = '✅';
    btnSucesso.disabled = meta.dataFinal && meta.dataFinal < hoje;
    btnSucesso.addEventListener('click', async () => {
      await atualizarStatusMeta(meta.id, 'sucesso');
    });

    const btnParcial = document.createElement('button');
    btnParcial.textContent = '⚠';
    btnParcial.disabled = meta.dataFinal && meta.dataFinal < hoje;
    btnParcial.addEventListener('click', async () => {
      await atualizarStatusMeta(meta.id, 'parcial');
    });

    const btnDeletar = document.createElement('button');
    btnDeletar.textContent = '🗑️';
    btnDeletar.addEventListener('click', async () => {
      await deletarMetaId(meta.id);
    });

    div.appendChild(btnSucesso);
    div.appendChild(btnParcial);
    div.appendChild(btnDeletar);

    listaMetasDiv.appendChild(div);
  });
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Evento do formulário
const formMeta = document.getElementById('form-meta');
formMeta.addEventListener('submit', async e => {
  e.preventDefault();
  const descricao = document.getElementById('descricao').value;
  const categoria = document.getElementById('categoria').value;
  const periodo = document.getElementById('periodo').value;

  await criarMeta(descricao, categoria, periodo);
  formMeta.reset();
});

// Carrega e renderiza ao iniciar
carregarERenderMetas();
