

import * as API from './api.js';
import { getState, setMetas } from './state.js';
import * as DOM from './dom.js';
import { analisarEstatisticas } from './statistics.js';

export async function carregarMetas() {
    try {
        const serverMetas = await API.fetchMetas();
        setMetas(serverMetas);
    } catch (error) {
        console.error(error);
        DOM.listaMetasDiv.innerHTML = "<p>Não foi possível carregar as metas.</p>";
    }
}

export async function handleCriarMeta(descricao, categoria, periodo) {
    const hoje = new Date();
    let dataFinalObj = new Date();
    switch (periodo) {
        case 'semana':
            dataFinalObj.setDate(hoje.getDate() - hoje.getDay() + 7);
            break;
        case 'mes':
            dataFinalObj = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
            break;
        case 'ano':
            dataFinalObj = new Date(hoje.getFullYear(), 11, 31);
            break;
    }

    const payload = {
        descricao,
        categoria,
        status: 'Pendente',
        dataCriacao: new Date().toISOString().slice(0, 10),
        dataFinal: dataFinalObj.toISOString().slice(0, 10),
        dataConcluida: null
    };

    try {
        await API.createMeta(payload);
        await carregarMetas();
        renderMetas();
    } catch (error) {
        console.error(error);
        alert('Falha ao criar a meta.');
    }
}

async function deletarMeta(id) {
    if (!confirm('Tem certeza que deseja deletar esta meta?')) return;
    try {
        await API.deleteMeta(id);
        await carregarMetas();
        renderMetas();
    } catch (error) {
        console.error(error);
        alert('Falha ao deletar a meta.');
    }
}

async function atualizarStatusMeta(id, status) {
    const payload = {
        status,
        dataConcluida: new Date().toISOString().slice(0, 10)
    };
    try {
        await API.updateMeta(id, payload);
        await carregarMetas();
        renderMetas();
        analisarEstatisticas();
    } catch (error) {
        console.error(error);
        alert('Falha ao atualizar o status da meta.');
    }
}

export function renderMetas() {
    const { metas } = getState();
    const filtroC = DOM.filtroCategoria.value;
    const listaFiltrada = metas.filter(meta => (filtroC === 'todas' || meta.categoria.toLowerCase() === filtroC));

    DOM.listaMetasDiv.innerHTML = '';
    listaFiltrada.forEach(meta => {
        const div = document.createElement('div');
        div.className = `meta ${meta.status.toLowerCase()}`;
        div.dataset.id = meta.id;
        div.innerHTML = `
            <strong>${meta.descricao}</strong><br>
            Status: ${meta.status} | Prazo: ${new Date(meta.dataFinal).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}<br>
            <button data-action="Sucesso">✅</button>
            <button data-action="Parcial">⚠️</button>
            <button data-action="deletar">🗑️</button>
        `;
        DOM.listaMetasDiv.appendChild(div);
    });
}


DOM.listaMetasDiv.addEventListener('click', (e) => {
    const button = e.target.closest('button');
    if (!button) return;

    const metaDiv = button.closest('.meta');
    const metaId = Number(metaDiv.dataset.id);
    const action = button.dataset.action;

    if (action === 'deletar') {
        deletarMeta(metaId);
    } else {
        atualizarStatusMeta(metaId, action);
    }
});