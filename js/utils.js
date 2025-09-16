
import { getState } from './state.js';
import * as API from './api.js';
import { carregarTarefas, renderTarefas } from './tasks.js';
import { carregarMetas, renderMetas } from './goals.js';
import { analisarEstatisticas } from './statistics.js';

function encontrarItensExpirados() {
    const { tarefas, metas } = getState();
    const agora = new Date();
    
    const tarefasExpiradas = tarefas
        .filter(tarefa => tarefa.status === 'pendente' && new Date(tarefa.dataFinal) < agora)
        .map(tarefa => tarefa.id);

    const metasExpiradas = metas
        .filter(meta => {
            if (meta.status !== 'Pendente') return false;
            const dataFinal = new Date(meta.dataFinal);
            dataFinal.setHours(23, 59, 59, 999); 
            return dataFinal < agora;
        })
        .map(meta => meta.id);

    return { tarefasExpiradas, metasExpiradas };
}

async function atualizarStatusExpirados() {
    console.log("%c--- Verificando itens expirados ---", 'background: #222; color: #bada55');
    const { tarefasExpiradas, metasExpiradas } = encontrarItensExpirados();

    if (tarefasExpiradas.length === 0 && metasExpiradas.length === 0) {
        console.log("Nenhum item expirado encontrado.");
        return;
    }

    const updatePromises = [
        ...tarefasExpiradas.map(id => API.updateTarefa(id, { status: 'atrasada' })),
        ...metasExpiradas.map(id => API.updateMeta(id, { status: 'falhou' }))
    ];
    
    try {
        await Promise.all(updatePromises);
        console.log("Itens expirados atualizados com sucesso. Recarregando dados...");
        
        await carregarTarefas();
        await carregarMetas();
        renderTarefas();
        renderMetas();
        analisarEstatisticas();

    } catch (error) {
        console.error("Erro ao atualizar um ou mais itens expirados:", error);
    }
}

export function iniciarVerificacaoDePrazos() {
    atualizarStatusExpirados(); 
    setInterval(atualizarStatusExpirados, 60 * 1000);
}