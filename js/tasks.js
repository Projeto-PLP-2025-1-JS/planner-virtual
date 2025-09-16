
import * as API from './api.js';
import { getState, setTarefas } from './state.js';
import * as DOM from './dom.js';
import { initCalendar } from './calendar.js';
import { analisarEstatisticas } from './statistics.js';

export async function carregarTarefas() {
    try {
        const serverTarefas = await API.fetchTarefas();
        const tarefasProcessadas = serverTarefas.map(task => ({
            ...task,
            dateOnly: task.dataFinal.substring(0, 10),
            horaFinal: new Date(task.dataFinal).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        }));
        setTarefas(tarefasProcessadas);
    } catch (error) {
        console.error(error);
        DOM.listaTarefasDiv.innerHTML = "<p>Não foi possível carregar as tarefas.</p>";
    }
}

export async function handleCriarTarefa(descricao, categoria, horaFinalStr) {
    const { selectedDate } = getState();
    const finalDateTime = new Date(selectedDate);
    const [hours, minutes] = horaFinalStr.split(':');
    finalDateTime.setHours(hours, minutes, 0, 0);

    const payload = {
        descricao,
        categoria,
        status: "pendente",
        dataCriacao: new Date().toISOString(),
        dataFinal: finalDateTime.toISOString(),
        dataConcluida: null
    };

    try {
        await API.createTarefa(payload);
        await carregarTarefas(); 
        renderTarefas();
        initCalendar();
    } catch (error) {
        console.error(error);
        alert('Falha ao criar a tarefa.');
    }
}

async function deletarTarefa(id) {
    if (!confirm('Tem certeza que deseja deletar esta tarefa?')) return;
    try {
        await API.deleteTarefa(id);
        await carregarTarefas();
        renderTarefas();
        initCalendar();
    } catch (error) {
        console.error(error);
        alert('Falha ao deletar a tarefa.');
    }
}

async function atualizarStatusTarefa(id, status) {
    const payload = {
        status,
        dataConcluida: status === 'executada' ? new Date().toISOString() : null
    };
    try {
        await API.updateTarefa(id, payload);
        await carregarTarefas();
        renderTarefas();
        analisarEstatisticas();
    } catch (error) {
        console.error(error);
        alert('Falha ao atualizar o status da tarefa.');
    }
}


export function renderTarefas() {
    const { tarefas, selectedDate } = getState();
    DOM.plannerTitle.textContent = `Tarefas para ${selectedDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}`;
    const filtroC = DOM.filtroCategoriaTarefa.value;
    const selectedDateString = selectedDate.toISOString().slice(0, 10);
    
    const listaFiltrada = tarefas.filter(t => t.dateOnly === selectedDateString && (filtroC === 'todas' || t.categoria === filtroC));

    DOM.listaTarefasDiv.innerHTML = '';
    if (listaFiltrada.length === 0) {
        DOM.listaTarefasDiv.innerHTML = '<p>Nenhuma tarefa para este dia.</p>';
        return;
    }

    listaFiltrada.forEach(tarefa => {
        const div = document.createElement('div');
        div.className = `tarefa ${tarefa.status}`;
        div.dataset.id = tarefa.id; 
        div.innerHTML = `
            <strong>${tarefa.descricao}</strong> (${tarefa.categoria})<br>
            Status: ${tarefa.status} | Horário: ${tarefa.horaFinal}<br>
            <button data-action="executada">✅</button>
            <button data-action="parcial">⚠️</button>
            <button data-action="deletar">🗑️</button>
        `;
        DOM.listaTarefasDiv.appendChild(div);
    });
}

DOM.listaTarefasDiv.addEventListener('click', (e) => {
    const button = e.target.closest('button');
    if (!button) return;

    const tarefaDiv = button.closest('.tarefa');
    const tarefaId = Number(tarefaDiv.dataset.id);
    const action = button.dataset.action;

    if (action === 'deletar') {
        deletarTarefa(tarefaId);
    } else {
        atualizarStatusTarefa(tarefaId, action);
    }
});