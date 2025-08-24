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
  salvarTarefasServer(tarefas[0]);
}

async function salvarTarefasServer(tarefas) {
  try {
    const response = await fetch('http://localhost:3333/tarefa/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(tarefas)
    });
    if (!response.ok) throw new Error('Erro ao salvar tarefas');
  } catch (error) {
    console.error(error);
  }
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

function deletarTarefaId(id) {
  const index = tarefas.findIndex(t => t.id === id);
  if (index !== -1) {
    tarefas.splice(index, 1);
    salvarTarefas();
    renderTarefas(); 
  }
}

function atualizarStatusTarefa(id, status) {
  const tarefa = tarefas.find(t => t.id === id);
  if (tarefa) {
    tarefa.atualizarStatus(status);
    salvarTarefas();
    renderTarefas();
  }
}

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
