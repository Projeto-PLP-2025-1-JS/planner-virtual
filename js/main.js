// js/main.js (VERSÃO ATUALIZADA)

import { carregarTarefas, handleCriarTarefa, renderTarefas } from './tasks.js';
import { carregarMetas, handleCriarMeta, renderMetas } from './goals.js';
import { initCalendar, prevMonth, nextMonth } from './calendar.js';
import { analisarEstatisticas } from './statistics.js';
import { iniciarVerificacaoDePrazos } from './utils.js';
import * as DOM from './dom.js';

// --- EVENT LISTENERS ---

function setupEventListeners() {
    DOM.prevBtn.addEventListener("click", prevMonth);
    DOM.nextBtn.addEventListener("click", nextMonth);

    // Listeners de Tarefas
    DOM.formTarefa.addEventListener('submit', (e) => {
        e.preventDefault();
        const descricao = DOM.formTarefa.querySelector('#descricao-tarefa').value;
        const categoria = DOM.formTarefa.querySelector('#categoria-tarefa').value;
        const horaFinal = DOM.formTarefa.querySelector('#hora-final-tarefa').value;
        handleCriarTarefa(descricao, categoria, horaFinal);
        DOM.formTarefa.reset();
    });
    DOM.filtroCategoriaTarefa.addEventListener('change', renderTarefas);

    // Listeners de Metas
    DOM.formMeta.addEventListener('submit', (e) => {
        e.preventDefault();
        const descricao = DOM.formMeta.querySelector('#descricao').value;
        const categoria = DOM.formMeta.querySelector('#categoria').value;
        const periodo = DOM.formMeta.querySelector('#periodo').value;
        handleCriarMeta(descricao, categoria, periodo);
        DOM.formMeta.reset();
    });
    DOM.filtroCategoria.addEventListener('change', renderMetas);
    DOM.filtroPeriodo.addEventListener('change', renderMetas); // Mantido por consistência
}

// --- INICIALIZAÇÃO DA APLICAÇÃO ---

async function initApp() {
    DOM.listaTarefasDiv.innerHTML = "<p>Carregando tarefas...</p>";
    DOM.listaMetasDiv.innerHTML = "<p>Carregando metas...</p>";
    
    // Carrega os dados iniciais em paralelo
    await Promise.all([
        carregarTarefas(),
        carregarMetas()
    ]);
    
    // Renderiza a interface com os dados carregados
    initCalendar();
    renderTarefas();
    renderMetas();
    analisarEstatisticas();
    
    // Inicia processos em segundo plano
    iniciarVerificacaoDePrazos();

    // Configura os eventos da interface
    setupEventListeners();
}

// Garante que o DOM está pronto antes de executar o script
document.addEventListener("DOMContentLoaded", initApp);