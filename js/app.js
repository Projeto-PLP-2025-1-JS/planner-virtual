// Metas
// Event listeners de filtros e formulário de Metas
const formMeta = document.getElementById('form-meta');
const filtroPeriodo = document.getElementById('filtro-periodo');
const filtroCategoria = document.getElementById('filtro-categoria');
const btnLimparMetas = document.getElementById('btn-limpar-metas');
const listaMetasDiv = document.getElementById('lista-metas'); // <-- faltava isso

carregarMetas(); 
renderMetas(); 

function renderMetas() {
  falhaStatusMeta();

  const filtroP = filtroPeriodo.value;
  const filtroC = filtroCategoria.value;

  const listaFiltrada = metas.filter(meta => {
    const condPeriodo = meta.periodo === filtroP;
    const condCategoria = (filtroC === 'todas' || meta.categoria === filtroC);
    return condPeriodo && condCategoria;
  });

  listaMetasDiv.innerHTML = '';
  listaFiltrada.forEach(meta => {
    const prazoPassou = meta.dataFinal < new Date().toISOString().slice(0, 10);

    const div = document.createElement('div');
    div.className = `meta ${meta.status}`;
    div.innerHTML = `
      <strong>${capitalize(meta.descricao)}</strong> 
      <br>Status: ${capitalize(meta.status)}
      <br>Data final: ${meta.dataFinal}
      <br>
      <button onclick="atualizarStatusMeta(${meta.id}, 'sucesso')" ${prazoPassou ? 'disabled' : ''}>✅</button>
      <button onclick="atualizarStatusMeta(${meta.id}, 'parcial')" ${prazoPassou ? 'disabled' : ''}>⚠</button>
      <button onclick="deletarMetaId(${meta.id})">🗑️</button>
    `;
    listaMetasDiv.appendChild(div);
  });
}

formMeta.addEventListener('submit', e => {
  e.preventDefault();
  const descricao = document.getElementById('descricao').value;
  const categoria = document.getElementById('categoria').value;
  const periodo = document.getElementById('periodo').value;

  criarMeta(descricao, categoria, periodo);
  formMeta.reset();
  renderMetas();
});

filtroPeriodo.addEventListener('change', renderMetas);
filtroCategoria.addEventListener('change', renderMetas);


// Tarefas
// Event listeners de filtros e formulário de Tarefas
const formTarefa = document.getElementById('form-tarefa');
const filtroCategoriaTarefa = document.getElementById('filtro-categoria-tarefa');
const btnLimparTarefas = document.getElementById('btn-limpar-tarefas');
const listaTarefasDiv = document.getElementById('lista-tarefas'); // <-- faltava isso

carregarTarefas();
renderTarefas(); 


function renderTarefas() {
  atualizarStatusTarefasAtrasadas();

  const filtroC = filtroCategoriaTarefa.value;
  const listaFiltrada = tarefas.filter(t => filtroC === 'todas' || t.categoria === filtroC);

  listaTarefasDiv.innerHTML = '';
  listaFiltrada.forEach(tarefa => {
    const passou = tarefa.horaFinal ? new Date() > tarefa.horaFinal : false;

    const div = document.createElement('div');
    div.className = `tarefa ${tarefa.status}`;
    div.innerHTML = `
      <strong>${tarefa.descricao}</strong> (${tarefa.categoria})<br>
      Status: ${tarefa.status}<br>
      Hora final: ${tarefa.horaFinal ? tarefa.horaFinal.toTimeString().slice(0,5) : '-'}<br>
      <button onclick="atualizarStatusTarefa(${tarefa.id}, 'executada')">✅</button>
      <button onclick="atualizarStatusTarefa(${tarefa.id}, 'parcial')">⚠</button>
      <button onclick="deletarTarefaId(${tarefa.id})">🗑️</button>
    `;
    listaTarefasDiv.appendChild(div);
  });
}

if (formTarefa) {
  formTarefa.addEventListener('submit', e => {
    e.preventDefault();
    const descricao = document.getElementById('descricao-tarefa').value;
    const categoria = document.getElementById('categoria-tarefa').value;
    const horaFinal = document.getElementById('hora-final-tarefa').value;

    criarTarefa(descricao, categoria, horaFinal);
    formTarefa.reset();
    renderTarefas();
  });
}

filtroCategoriaTarefa.addEventListener('change', renderTarefas);
btnLimparTarefas.addEventListener('click', () => {
  limparTarefas(filtroCategoriaTarefa.value);
  renderTarefas();
});
