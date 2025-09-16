

import { carregarTarefas, handleCriarTarefa, renderTarefas } from './tasks.js';
import { carregarMetas, handleCriarMeta, renderMetas } from './goals.js';
import { initCalendar, prevMonth, nextMonth } from './calendar.js';
import { analisarEstatisticas } from './statistics.js';
import { iniciarVerificacaoDePrazos } from './utils.js';
import * as DOM from './dom.js';



function setupEventListeners() {
    DOM.prevBtn.addEventListener("click", prevMonth);
    DOM.nextBtn.addEventListener("click", nextMonth);

 
    DOM.formTarefa.addEventListener('submit', (e) => {
        e.preventDefault();
        const descricao = DOM.formTarefa.querySelector('#descricao-tarefa').value;
        const categoria = DOM.formTarefa.querySelector('#categoria-tarefa').value;
        const horaFinal = DOM.formTarefa.querySelector('#hora-final-tarefa').value;
        handleCriarTarefa(descricao, categoria, horaFinal);
        DOM.formTarefa.reset();
    });
    DOM.filtroCategoriaTarefa.addEventListener('change', renderTarefas);

    
    DOM.formMeta.addEventListener('submit', (e) => {
        e.preventDefault();
        const descricao = DOM.formMeta.querySelector('#descricao').value;
        const categoria = DOM.formMeta.querySelector('#categoria').value;
        const periodo = DOM.formMeta.querySelector('#periodo').value;
        handleCriarMeta(descricao, categoria, periodo);
        DOM.formMeta.reset();
    });
    DOM.filtroCategoria.addEventListener('change', renderMetas);
    DOM.filtroPeriodo.addEventListener('change', renderMetas); 
}

async function initApp() {
    DOM.listaTarefasDiv.innerHTML = "<p>Carregando tarefas...</p>";
    DOM.listaMetasDiv.innerHTML = "<p>Carregando metas...</p>";
    
    
    await Promise.all([
        carregarTarefas(),
        carregarMetas()
    ]);
    
    
    initCalendar();
    renderTarefas();
    renderMetas();
    analisarEstatisticas();
    
 
    iniciarVerificacaoDePrazos();

   
    setupEventListeners();
}

document.addEventListener("DOMContentLoaded", initApp);