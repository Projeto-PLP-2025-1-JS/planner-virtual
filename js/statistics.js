// js/statistics.js

import { getState } from './state.js';
import * as DOM from './dom.js';

export function analisarEstatisticas() {
    const { tarefas, metas } = getState();
    const TAREFA_STATUS_CONCLUIDA = 'executada';
    const META_STATUS_SUCESSO = 'Sucesso';

    // --- Lógica de Datas ---
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const inicioSemana = new Date(hoje);
    inicioSemana.setDate(hoje.getDate() - hoje.getDay());
    
    const fimSemana = new Date(inicioSemana);
    fimSemana.setDate(inicioSemana.getDate() + 6);
    fimSemana.setHours(23, 59, 59, 999);

    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
    fimMes.setHours(23, 59, 59, 999);

    // --- Contagem de Tarefas ---
    const tarefasConcluidasHoje = tarefas.filter(t => t.status === TAREFA_STATUS_CONCLUIDA && new Date(t.dataConcluida).toDateString() === hoje.toDateString()).length;
    const tarefasConcluidasSemana = tarefas.filter(t => t.dataConcluida && t.status === TAREFA_STATUS_CONCLUIDA && new Date(t.dataConcluida) >= inicioSemana && new Date(t.dataConcluida) <= fimSemana).length;
    const tarefasConcluidasMes = tarefas.filter(t => t.dataConcluida && t.status === TAREFA_STATUS_CONCLUIDA && new Date(t.dataConcluida) >= inicioMes && new Date(t.dataConcluida) <= fimMes).length;

    const tarefasTotaisHoje = tarefas.filter(t => new Date(t.dataFinal).toDateString() === hoje.toDateString()).length;
    const tarefasTotaisSemana = tarefas.filter(t => new Date(t.dataFinal) >= inicioSemana && new Date(t.dataFinal) <= fimSemana).length;
    const tarefasTotaisMes = tarefas.filter(t => new Date(t.dataFinal) >= inicioMes && new Date(t.dataFinal) <= fimMes).length;

    const percHoje = tarefasTotaisHoje > 0 ? (tarefasConcluidasHoje / tarefasTotaisHoje) * 100 : 0;
    const percSemana = tarefasTotaisSemana > 0 ? (tarefasConcluidasSemana / tarefasTotaisSemana) * 100 : 0;
    const percMes = tarefasTotaisMes > 0 ? (tarefasConcluidasMes / tarefasTotaisMes) * 100 : 0;

    DOM.tarefasHojeRatioSpan.textContent = `${tarefasConcluidasHoje}/${tarefasTotaisHoje}`;
    DOM.tarefasHojeProgress.style.width = `${percHoje}%`;
    DOM.tarefasSemanaRatioSpan.textContent = `${tarefasConcluidasSemana}/${tarefasTotaisSemana}`;
    DOM.tarefasSemanaProgress.style.width = `${percSemana}%`;
    DOM.tarefasMesRatioSpan.textContent = `${tarefasConcluidasMes}/${tarefasTotaisMes}`;
    DOM.tarefasMesProgress.style.width = `${percMes}%`;

    // --- Contagem de Metas ---
    const metasSucesso = metas.filter(m => m.status === META_STATUS_SUCESSO && m.dataConcluida);
    const metasSemana = metasSucesso.filter(m => new Date(m.dataConcluida) >= inicioSemana && new Date(m.dataConcluida) <= fimSemana).length;
    const metasMes = metasSucesso.filter(m => new Date(m.dataConcluida) >= inicioMes && new Date(m.dataConcluida) <= fimMes).length;
    
    DOM.metasSemanaSpan.textContent = metasSemana;
    DOM.metasMesSpan.textContent = metasMes;
}