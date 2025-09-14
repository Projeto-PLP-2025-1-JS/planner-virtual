// Metas
// Event listeners de filtros e formulário de Metas
const formMeta = document.getElementById('form-meta');
const filtroPeriodo = document.getElementById('filtro-periodo');
const filtroCategoria = document.getElementById('filtro-categoria');
const btnLimparMetas = document.getElementById('btn-limpar-metas');
const listaMetasDiv = document.getElementById('lista-metas'); 

formMeta.addEventListener('submit', async e => {
  e.preventDefault();
  const descricao = document.getElementById('descricao').value;
  const categoria = document.getElementById('categoria').value;
  const periodo = document.getElementById('periodo').value;

  await criarMeta(descricao, categoria, periodo);
  formMeta.reset();
});

filtroPeriodo.addEventListener('change', () => {
  carregarERenderMetas(filtroCategoria.value, filtroPeriodo.value);
});
filtroCategoria.addEventListener('change', () => {
  carregarERenderMetas(filtroCategoria.value, filtroPeriodo.value);
});

const formTarefa = document.getElementById('form-tarefa');
const filtroCategoriaTarefa = document.getElementById('filtro-categoria-tarefa');
const btnLimparTarefas = document.getElementById('btn-limpar-tarefas');
const listaTarefasDiv = document.getElementById('lista-tarefas'); // <-- faltava isso

if (formTarefa) {
  formTarefa.addEventListener('submit', async e => {
    e.preventDefault();
    const descricao = document.getElementById('descricao-tarefa').value;
    const categoria = document.getElementById('categoria-tarefa').value;
    const horaFinal = document.getElementById('hora-final-tarefa').value;

    await criarTarefa(descricao, categoria, horaFinal);
    formTarefa.reset();
  });
}


