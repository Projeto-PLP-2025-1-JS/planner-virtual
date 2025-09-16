
let state = {
    today: new Date(),
    selectedDate: new Date(),
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
    tarefas: [],
    metas: []
};

export const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

export const getState = () => state;

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