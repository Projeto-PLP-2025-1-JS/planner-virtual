// js/calendar.js

import { getState, setDate, setSelectedDate, months } from './state.js';
import * as DOM from './dom.js';
import { renderTarefas } from './tasks.js'; // Importa para atualizar a lista ao clicar

function addDayClickListeners() {
    DOM.daysContainer.querySelectorAll(".day").forEach(day => {
        day.addEventListener("click", (e) => {
            const dayNumber = Number(e.currentTarget.dataset.day);
            if (e.currentTarget.classList.contains("prev-date")) {
                prevMonth();
                return;
            }
            if (e.currentTarget.classList.contains("next-date")) {
                nextMonth();
                return;
            }
            if (!dayNumber) return;

            const { year, month } = getState();
            setSelectedDate(new Date(year, month, dayNumber));
            initCalendar();
            renderTarefas(); // Atualiza a lista de tarefas para o dia selecionado
        });
    });
}

export function initCalendar() {
    let { year, month, selectedDate, tarefas } = getState();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const prevLastDay = new Date(year, month, 0);
    const prevDays = prevLastDay.getDate();
    const lastDate = lastDay.getDate();
    const dayOfWeek = firstDay.getDay();

    DOM.dateElement.innerHTML = `${months[month]} ${year}`;
    let days = "";

    for (let x = dayOfWeek; x > 0; x--) {
        days += `<div class="day prev-date">${prevDays - x + 1}</div>`;
    }

    const datesWithTasks = new Set(tarefas.map(t => t.dateOnly));

    for (let i = 1; i <= lastDate; i++) {
        let classes = "day";
        const currentDate = new Date(year, month, i);
        if (i === new Date().getDate() && year === new Date().getFullYear() && month === new Date().getMonth()) {
            classes += " today";
        }
        if (currentDate.toDateString() === selectedDate.toDateString()) {
            classes += " active";
        }
        const currentDateString = currentDate.toISOString().slice(0, 10);
        if (datesWithTasks.has(currentDateString)) {
            classes += " has-task";
        }
        days += `<div class="${classes}" data-day="${i}">${i}</div>`;
    }

    const totalCellsRendered = dayOfWeek + lastDate;
    const cellsToFill = (7 - totalCellsRendered % 7) % 7;
    for (let j = 1; j <= cellsToFill; j++) {
        days += `<div class="day next-date">${j}</div>`;
    }

    DOM.daysContainer.innerHTML = days;
    addDayClickListeners();
}

export function prevMonth() {
    let { year, month } = getState();
    month--;
    if (month < 0) {
        month = 11;
        year--;
    }
    setDate(month, year);
    initCalendar();
}

export function nextMonth() {
    let { year, month } = getState();
    month++;
    if (month > 11) {
        month = 0;
        year++;
    }
    setDate(month, year);
    initCalendar();
}