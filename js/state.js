// js/state.js

/**
 * Estado global da aplicação.
 * Usamos 'let' para as variáveis que podem ser alteradas e exportamos
 * funções 'get' e 'set' para controlar o acesso e a modificação.
 */
let state = {
    today: new Date(),
    selectedDate: new Date(),
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
    tarefas: [],
    metas: []
};

export const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

// Funções para obter o estado (Getters)
export const getState = () => state;

// Funções para modificar o estado (Setters)
export const setDate = (newMonth, newYear) => {
    state.month = newMonth;
    state.year = newYear;
};
export const setSelectedDate = (newDate) => {
    state.selectedDate = newDate;
};
export const setTarefas = (newTarefas) => {
    state.tarefas = newTarefas;
};
export const setMetas = (newMetas) => {
    state.metas = newMetas;
};