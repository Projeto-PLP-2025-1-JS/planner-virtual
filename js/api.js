// js/api.js

import { API_BASE_URL } from './dom.js';

export async function fetchTarefas() {
    const response = await fetch(`${API_BASE_URL}/tarefas`);
    if (!response.ok) throw new Error('Erro ao buscar tarefas.');
    return response.json();
}

export async function createTarefa(payload) {
    const response = await fetch(`${API_BASE_URL}/tarefa/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error('Erro ao criar tarefa.');
    return response.json();
}

export async function deleteTarefa(id) {
    const response = await fetch(`${API_BASE_URL}/tarefa/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Erro ao deletar tarefa.');
}

export async function updateTarefa(id, payload) {
    const response = await fetch(`${API_BASE_URL}/tarefa/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error('Erro ao atualizar tarefa.');
    return response.json();
}

export async function fetchMetas() {
    const response = await fetch(`${API_BASE_URL}/meta/getAll`);
    if (!response.ok) throw new Error('Erro ao buscar metas.');
    return response.json();
}

export async function createMeta(payload) {
    const response = await fetch(`${API_BASE_URL}/meta/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error('Erro ao criar meta.');
    return response.json();
}

export async function deleteMeta(id) {
    const response = await fetch(`${API_BASE_URL}/meta/delete/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Erro ao deletar meta.');
}

export async function updateMeta(id, payload) {
    const response = await fetch(`${API_BASE_URL}/meta/update/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error('Erro ao atualizar meta.');
    return response.json();
}