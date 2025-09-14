// Cria uma nova tarefa e recarrega do backend
async function criarTarefa(descricao, categoria, horaFinalStr) {
  const novaTarefa = new Tarefa(null, descricao, categoria, horaFinalStr);
  await salvarTarefaServer(novaTarefa);
  await carregarERenderTarefas();
}

// Salva tarefa no backend
async function salvarTarefaServer(tarefa) {
  try {
    const response = await fetch('http://localhost:3333/tarefa/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tarefa)
    });
    if (!response.ok) throw new Error('Erro ao salvar tarefa');
  } catch (error) {
    console.error(error);
  }
}

// Deleta tarefa no backend e recarrega
async function deletarTarefaId(id) {
  try {
    const response = await fetch(`http://localhost:3333/tarefa/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Erro ao deletar tarefa');
    await carregarERenderTarefas();
  } catch (error) {
    console.error(error);
  }
}

// Atualiza status da tarefa e recarrega
async function atualizarStatusTarefa(id, status) {
  try {
    // Busca tarefa atual direto do backend
    const responseGet = await fetch(`http://localhost:3333/tarefa/${id}`);
    const tarefa = await responseGet.json();
    tarefa.status = status;

    const responsePut = await fetch(`http://localhost:3333/tarefa/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tarefa)
    });
    if (!responsePut.ok) throw new Error('Erro ao atualizar tarefa');

    await carregarERenderTarefas();
  } catch (error) {
    console.error(error);
  }
}

// Função única que carrega tarefas do backend e renderiza
async function carregarERenderTarefas() {
  try {
    const response = await fetch('http://localhost:3333/tarefas');
    if (!response.ok) throw new Error('Erro ao carregar tarefas');
    const data = await response.json();

    // Converte datas para objetos Date
    const tarefasFormatadas = data.map(d => {
      const tarefa = new Tarefa(d.id, d.descricao, d.categoria, d.horaFinal);
      tarefa.status = d.status;
      tarefa.horaCriacao = d.horaCriacao ? new Date(d.horaCriacao) : null;
      tarefa.horaFinal = d.horaFinal ? new Date(d.horaFinal) : null;
      tarefa.horaConclusao = d.horaConclusao ? new Date(d.horaConclusao) : null;
      return tarefa;
    });

    renderTarefas(tarefasFormatadas);
  } catch (error) {
    console.error(error);
  }
}

// Função de renderização recebe os dados como parâmetro
function renderTarefas(tarefas) {
  const listaTarefasDiv = document.getElementById('lista-tarefas');
  listaTarefasDiv.innerHTML = '';

  const agora = new Date();
  tarefas.forEach(tarefa => {
    if (tarefa.status === 'pendente' && tarefa.horaFinal && agora > tarefa.horaFinal) {
      tarefa.status = 'atrasada';
    }

    const div = document.createElement('div');
    div.className = `tarefa ${tarefa.status}`;
    div.innerHTML = `
      <strong>${tarefa.descricao}</strong> (${tarefa.categoria})<br>
      Status: ${tarefa.status}<br>
      Hora final: ${tarefa.horaFinal ? tarefa.horaFinal.toTimeString().slice(0,5) : '-'}<br>
    `;

    const btnExecutada = document.createElement('button');
    btnExecutada.textContent = '✅';
    btnExecutada.addEventListener('click', async () => {
      await atualizarStatusTarefa(tarefa.id, 'executada');
    });

    const btnParcial = document.createElement('button');
    btnParcial.textContent = '⚠';
    btnParcial.addEventListener('click', async () => {
      await atualizarStatusTarefa(tarefa.id, 'parcial');
    });

    const btnDeletar = document.createElement('button');
    btnDeletar.textContent = '🗑️';
    btnDeletar.addEventListener('click', async () => {
      await deletarTarefaId(tarefa.id);
    });

    div.appendChild(btnExecutada);
    div.appendChild(btnParcial);
    div.appendChild(btnDeletar);

    listaTarefasDiv.appendChild(div);
  });
}

// Evento do formulário
const formTarefa = document.getElementById('form-tarefa');
formTarefa.addEventListener('submit', async e => {
  e.preventDefault();
  const descricao = document.getElementById('descricao-tarefa').value;
  const categoria = document.getElementById('categoria-tarefa').value;
  const horaFinal = document.getElementById('hora-final-tarefa').value;

  await criarTarefa(descricao, categoria, horaFinal);
  formTarefa.reset();
});

// Carrega e renderiza ao iniciar
carregarERenderTarefas();
