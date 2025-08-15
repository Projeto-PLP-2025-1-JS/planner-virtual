let tarefas = [];
let proximoIdTarefa = 1;

// Cria uma nova tarefa
function criarTarefa(descricao, categoria, horaFinalStr) {
    const novaTarefa = new Tarefa(proximoIdTarefa++, descricao, categoria, horaFinalStr);
    tarefas.push(novaTarefa);
    salvarTarefas();
}

// Lista tarefas (pode receber categoria ou apenas retornar todas)
function listarTarefas(categoria = '') {
  if (categoria === '') return tarefas;
  return tarefas.filter(t => t.categoria === categoria);
}

// Salva tarefas no localStorage
function salvarTarefas() {
  localStorage.setItem('tarefas', JSON.stringify(tarefas));
  localStorage.setItem('proximoIdTarefa', proximoIdTarefa);
}

// Carrega tarefas do localStorage
function carregarTarefas() {
  const dados = JSON.parse(localStorage.getItem("tarefas") || "[]");
  tarefas = dados.map(d => {
    const tarefa = new Tarefa(d.id, d.descricao, d.categoria, d.horaFinal);
    tarefa.status = d.status;
    tarefa.horaCriacao = d.horaCriacao;
    tarefa.horaFinal = d.horaFinal ? new Date(d.horaFinal) : null;
    return tarefa;
  });
  proximoIdTarefa = parseInt(localStorage.getItem('proximoIdTarefa')) || tarefas.length + 1;
}

// Deleta tarefa pelo id
function deletarTarefaId(id) {
  const index = tarefas.findIndex(t => t.id === id);
  if (index !== -1) {
    tarefas.splice(index, 1);
    salvarTarefas();
    renderTarefas(); // função que renderiza na tela, similar ao renderMetas
  }
}

// Atualiza status da tarefa
function atualizarStatusTarefa(id, status) {
  const tarefa = tarefas.find(t => t.id === id);
  if (tarefa) {
    tarefa.atualizarStatus(status);
    salvarTarefas();
    renderTarefas();
  }
}

// Atualiza automaticamente tarefas atrasadas
function atualizarStatusTarefasAtrasadas() {
  const agora = new Date();
  tarefas.forEach(t => {
    if (t.status === 'pendente' && t.horaFinal && agora > t.horaFinal) {
      t.status = 'atrasada';
    }
  });
  salvarTarefas();
}

carregarTarefas();
