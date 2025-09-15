document.addEventListener("DOMContentLoaded", () => {
    // --- CONFIGURAÇÃO DA API ---
    const API_BASE_URL = 'http://localhost:3333';

    // --- VARIÁVEIS GLOBAIS E ESTADO DA APLICAÇÃO ---
    let today = new Date();
    let selectedDate = new Date();
    let month = today.getMonth();
    let year = today.getFullYear();
    const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    // --- SELEÇÃO DOS ELEMENTOS DO DOM ---
    const dateElement = document.querySelector(".date");
    const daysContainer = document.querySelector(".days");
    const prevBtn = document.querySelector(".prev");
    const nextBtn = document.querySelector(".next");
    const plannerTitle = document.getElementById('planner-title');
    const formMeta = document.getElementById('form-meta');
    const filtroPeriodo = document.getElementById('filtro-periodo');
    const filtroCategoria = document.getElementById('filtro-categoria');
    const listaMetasDiv = document.getElementById('lista-metas');
    const formTarefa = document.getElementById('form-tarefa');
    const filtroCategoriaTarefa = document.getElementById('filtro-categoria-tarefa');
    const listaTarefasDiv = document.getElementById('lista-tarefas');
    
    let tarefas = [];
    let metas = [];

    // ===================================================================
    // LÓGICA DO CALENDÁRIO (sem alterações)
    // ===================================================================
    function initCalendar() {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const prevLastDay = new Date(year, month, 0);
        const prevDays = prevLastDay.getDate();
        const lastDate = lastDay.getDate();
        const dayOfWeek = firstDay.getDay();

        dateElement.innerHTML = `${months[month]} ${year}`;
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
            if(datesWithTasks.has(currentDateString)) {
                classes += " has-task";
            }
            days += `<div class="${classes}" data-day="${i}">${i}</div>`;
        }

        const totalCellsRendered = dayOfWeek + lastDate;
        const cellsToFill = (7 - totalCellsRendered % 7) % 7;
        for (let j = 1; j <= cellsToFill; j++) {
            days += `<div class="day next-date">${j}</div>`;
        }

        daysContainer.innerHTML = days;
        addDayClickListeners();
    }

    function prevMonth() {
        month--;
        if (month < 0) { month = 11; year--; }
        initCalendar();
    }

    function nextMonth() {
        month++;
        if (month > 11) { month = 0; year++; }
        initCalendar();
    }

    function addDayClickListeners() {
        document.querySelectorAll(".day").forEach(day => {
            day.addEventListener("click", (e) => {
                const dayNumber = Number(e.currentTarget.dataset.day);
                if (e.currentTarget.classList.contains("prev-date")) { prevMonth(); return; }
                if (e.currentTarget.classList.contains("next-date")) { nextMonth(); return; }
                if (!dayNumber) return;

                selectedDate = new Date(year, month, dayNumber);
                initCalendar();
                renderTarefas();
            });
        });
    }

    // ===================================================================
    // LÓGICA DE TAREFAS (sem alterações)
    // ===================================================================
    
    async function carregarTarefas() {
        try {
            const response = await fetch(`${API_BASE_URL}/tarefas`);
            if (!response.ok) throw new Error('Erro ao buscar tarefas.');
            
            const serverTarefas = await response.json();
            tarefas = serverTarefas.map(task => ({
                ...task,
                dateOnly: task.dataFinal.substring(0, 10),
                horaFinal: new Date(task.dataFinal).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
            }));
        } catch (error) {
            console.error(error);
            listaTarefasDiv.innerHTML = "<p>Não foi possível carregar as tarefas.</p>";
        }
    }
    
    async function criarTarefa(descricao, categoria, horaFinalStr) {
        const finalDateTime = new Date(selectedDate);
        const [hours, minutes] = horaFinalStr.split(':');
        finalDateTime.setHours(hours, minutes, 0, 0);

        const novaTarefaPayload = {
            descricao: descricao,
            categoria: categoria,
            status: "pendente",
            dataCriacao: new Date().toISOString(),
            dataFinal: finalDateTime.toISOString(),
            dataConcluida: null
        };
        
        try {
            const response = await fetch(`${API_BASE_URL}/tarefa/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(novaTarefaPayload)
            });
            if (!response.ok) {
                 const errorBody = await response.text();
                 throw new Error(`Erro ao criar tarefa: ${response.status} ${errorBody}`);
            }
            
            await carregarTarefas();
            renderTarefas();
            initCalendar();
        } catch (error) {
            console.error(error);
            alert('Falha ao criar a tarefa.');
        }
    }

    async function deletarTarefaId(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/tarefa/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Erro ao deletar tarefa.');

            tarefas = tarefas.filter(t => t.id !== id);
            renderTarefas();
            initCalendar();
        } catch (error) {
            console.error(error);
            alert('Falha ao deletar a tarefa.');
        }
    }
    
    async function atualizarStatusTarefa(id, status) {
        try {
            const response = await fetch(`${API_BASE_URL}/tarefa/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status , dataConcluida: status === 'executada' ? new Date().toISOString() : null})
            });
            if (!response.ok) throw new Error('Erro ao atualizar status.');

            const tarefaAtualizada = await response.json();
            const index = tarefas.findIndex(t => t.id === id);
            if (index !== -1) {
                 tarefas[index] = { ...tarefas[index], ...tarefaAtualizada };
            }
            renderTarefas();
            analisarEstatisticas();
        } catch (error) {
            console.error(error);
            alert('Falha ao atualizar o status da tarefa.');
        }
    }

    function renderTarefas() {
        plannerTitle.textContent = `Tarefas para ${selectedDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}`;
        const filtroC = filtroCategoriaTarefa.value;
        const selectedDateString = selectedDate.toISOString().slice(0, 10);
        
        const listaFiltrada = tarefas.filter(t => t.dateOnly === selectedDateString && (filtroC === 'todas' || t.categoria === filtroC));

        listaTarefasDiv.innerHTML = '';
        if (listaFiltrada.length === 0) {
            listaTarefasDiv.innerHTML = '<p>Nenhuma tarefa para este dia.</p>';
            return;
        }

        listaFiltrada.forEach(tarefa => {
            const div = document.createElement('div');
            div.className = `tarefa ${tarefa.status}`;
            div.innerHTML = `
              <strong>${tarefa.descricao}</strong> (${tarefa.categoria})<br>
              Status: ${tarefa.status} | Horário: ${tarefa.horaFinal}<br>
              <button onclick="window.atualizarStatusTarefa(${tarefa.id}, 'executada')">✅</button>
              <button onclick="window.atualizarStatusTarefa(${tarefa.id}, 'parcial')">⚠️</button>
              <button onclick="window.deletarTarefaId(${tarefa.id})">🗑️</button>
            `;
            listaTarefasDiv.appendChild(div);
        });
    }

    // ===================================================================
    // LÓGICA DE METAS (AJUSTADA PARA O NOVO MODELO)
    // ===================================================================

    async function carregarMetas() {
        try {
            const response = await fetch(`${API_BASE_URL}/meta/getAll`);
            if (!response.ok) throw new Error('Erro ao buscar metas.');
            metas = await response.json();
        } catch (error) {
            console.error(error);
            listaMetasDiv.innerHTML = "<p>Não foi possível carregar as metas.</p>";
        }
    }

    async function criarMeta(descricao, categoria, periodo) {
        const hoje = new Date();
        let dataFinalObj = new Date();
        // A lógica do 'periodo' ainda é útil no frontend para calcular a data final
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

        // PAYLOAD CORRIGIDO: Removido o campo 'periodo' para alinhar com o novo modelo.
        const novaMetaPayload = {
            descricao: descricao,
            categoria: categoria,
            status: 'Pendente',
            dataCriacao: new Date().toISOString().slice(0, 10),
            dataFinal: dataFinalObj.toISOString().slice(0, 10),
            dataConcluida: null
        };

        try {
            const response = await fetch(`${API_BASE_URL}/meta/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(novaMetaPayload)
            });
            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`Erro ao criar meta: ${response.status} ${errorBody}`);
            }
            
            await carregarMetas();
            renderMetas();
        } catch (error) {
            console.error(error);
            alert('Falha ao criar a meta.');
        }
    }

    async function deletarMetaId(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/meta/delete/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Erro ao deletar meta.');
            metas = metas.filter(m => m.id !== id);
            renderMetas();
        } catch (error) {
            console.error(error);
            alert('Falha ao deletar a meta.');
        }
    }

    async function atualizarStatusMeta(id, status) {
        try {
            const response = await fetch(`${API_BASE_URL}/meta/update/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: status, dataConcluida: new Date().toISOString().slice(0, 10) }) // O backend aceita string
            });
            if (!response.ok) throw new Error('Erro ao atualizar status da meta.');
            
            await carregarMetas();
            renderMetas();
            analisarEstatisticas();
        } catch (error) {
            console.error(error);
            alert('Falha ao atualizar o status da meta.');
        }
    }
    
    function renderMetas() {
        // FILTRO CORRIGIDO: Removida a lógica de filtro por 'periodo'.
        // Agora o filtro de período no HTML não terá mais efeito.
        const filtroC = filtroCategoria.value;
        const listaFiltrada = metas.filter(meta => {
            return (filtroC === 'todas' || meta.categoria.toLowerCase() === filtroC);
        });

        listaMetasDiv.innerHTML = '';
        listaFiltrada.forEach(meta => {
            const div = document.createElement('div');
            div.className = `meta ${meta.status.toLowerCase()}`;
            div.innerHTML = `
                <strong>${meta.descricao}</strong><br>
                Status: ${meta.status} | Prazo: ${new Date(meta.dataFinal).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}<br>
                <button onclick="window.atualizarStatusMeta(${meta.id}, 'Sucesso')">✅</button>
                <button onclick="window.atualizarStatusMeta(${meta.id}, 'Parcial')">⚠️</button>
                <button onclick="window.deletarMetaId(${meta.id})">🗑️</button>
            `;
            listaMetasDiv.appendChild(div);
        });
    }

    // ===================================================================
// LÓGICA DE ANÁLISE E ESTATÍSTICAS
// ===================================================================

// Seleciona os elementos do DOM que acabamos de criar no HTML
const tarefasHojeSpan = document.getElementById('tarefas-hoje');
const tarefasSemanaSpan = document.getElementById('tarefas-semana');
const tarefasMesSpan = document.getElementById('tarefas-mes');
const metasSemanaSpan = document.getElementById('metas-semana');
const metasMesSpan = document.getElementById('metas-mes');

function analisarEstatisticas() {
    // Define os status que consideramos como "concluído"
    const TAREFA_STATUS_CONCLUIDA = 'executada';
    const META_STATUS_SUCESSO = 'Sucesso';

    // --- Lógica de Datas ---
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0); // Zera a hora para comparar apenas a data

    // Calcula o início e o fim da semana atual (Domingo a Sábado)
    const inicioSemana = new Date(hoje);
    inicioSemana.setDate(hoje.getDate() - hoje.getDay()); // Vai para o último domingo
    
    const fimSemana = new Date(inicioSemana);
    fimSemana.setDate(inicioSemana.getDate() + 6);
    fimSemana.setHours(23, 59, 59, 999); // Define o final do dia de sábado

    // Calcula o início e o fim do mês atual
    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
    fimMes.setHours(23, 59, 59, 999); // Define o final do último dia do mês

    // --- Contagem de Tarefas ---
    const tarefasConcluidas = tarefas.filter(t => t.status === TAREFA_STATUS_CONCLUIDA && t.dataConcluida);

    const tarefasHoje = tarefasConcluidas.filter(t => {
        const dataConcluida = new Date(t.dataConcluida);
        return dataConcluida.toDateString() === hoje.toDateString();
    }).length;

    const tarefasSemana = tarefasConcluidas.filter(t => {
        const dataConcluida = new Date(t.dataConcluida);
        return dataConcluida >= inicioSemana && dataConcluida <= fimSemana;
    }).length;

    const tarefasMes = tarefasConcluidas.filter(t => {
        const dataConcluida = new Date(t.dataConcluida);
        return dataConcluida >= inicioMes && dataConcluida <= fimMes;
    }).length;

    // --- Contagem de Metas ---
    const metasSucesso = metas.filter(m => m.status === META_STATUS_SUCESSO && m.dataConcluida);

    const metasSemana = metasSucesso.filter(m => {
        const dataConcluida = new Date(m.dataConcluida);
        return dataConcluida >= inicioSemana && dataConcluida <= fimSemana;
    }).length;

    const metasMes = metasSucesso.filter(m => {
        const dataConcluida = new Date(m.dataConcluida);
        return dataConcluida >= inicioMes && dataConcluida <= fimMes;
    }).length;

    // --- Atualiza o HTML com os valores ---
    tarefasHojeSpan.textContent = tarefasHoje;
    tarefasSemanaSpan.textContent = tarefasSemana;
    tarefasMesSpan.textContent = tarefasMes;
    metasSemanaSpan.textContent = metasSemana;
    metasMesSpan.textContent = metasMes;

    
}

// ===================================================================
// LÓGICA DE VERIFICAÇÃO DE PRAZOS (VERSÃO DE DEPURAÇÃO)
// ===================================================================

function encontrarItensExpirados() {
    console.log("Dentro de encontrarItensExpirados...");
    const agora = new Date();
    console.log(`%cHORA ATUAL (do seu navegador): ${agora.toLocaleString('pt-BR')}`, 'color: blue');
    
    const itensParaAtualizar = {
        tarefas: [],
        metas: []
    };

    tarefas.forEach(tarefa => {
        // Ignora tarefas que não estão pendentes
        if (tarefa.status !== 'pendente') return;

        const dataFinal = new Date(tarefa.dataFinal);
        
        // LOG DETALHADO POR TAREFA
        console.group(`Verificando Tarefa ID: ${tarefa.id} - "${tarefa.descricao}"`);
        console.log(`Status Atual: ${tarefa.status}`);
        console.log(`Prazo (dataFinal): ${tarefa.dataFinal}`);
        console.log(`Prazo convertido para Data: ${dataFinal.toLocaleString('pt-BR')}`);
        console.log(`A condição (prazo < agora) é: ${dataFinal < agora}`);
        console.groupEnd();

        if (dataFinal < agora) {
            itensParaAtualizar.tarefas.push(tarefa.id);
        }
    });

    metas.forEach(meta => {
        if (meta.status !== 'Pendente') return;

        const dataFinal = new Date(meta.dataFinal);
        dataFinal.setHours(23, 59, 59, 999); // Ajusta para o fim do dia

        console.group(`Verificando Meta ID: ${meta.id} - "${meta.descricao}"`);
        console.log(`Status Atual: ${meta.status}`);
        console.log(`Prazo (dataFinal): ${meta.dataFinal}`);
        console.log(`Prazo convertido e ajustado para FIM DO DIA: ${dataFinal.toLocaleString('pt-BR')}`);
        console.log(`A condição (prazo < agora) é: ${dataFinal < agora}`);
        console.groupEnd();
        
        if (dataFinal < agora) {
            itensParaAtualizar.metas.push(meta.id);
        }
    });
    
    console.log("Itens expirados encontrados:", itensParaAtualizar);
    return itensParaAtualizar;
}

async function atualizarStatusExpirados() {
    console.log("%c--- EXECUTANDO VERIFICAÇÃO PERIÓDICA DE ITENS EXPIRADOS ---", 'background: #222; color: #bada55');
    const { tarefas, metas } = encontrarItensExpirados();

    if (tarefas.length === 0 && metas.length === 0) {
        console.log("Nenhum item expirado encontrado nesta verificação.");
        return; // Sai da função se não houver nada para fazer
    }

    let algumaCoisaMudou = false;

    for (const id of tarefas) {
        console.log(`%cEnviando requisição PUT para TAREFA ${id} como 'Falhou'.`, 'color: orange');
        await enviarAtualizacaoDeStatus('tarefa', id, 'Falhou');
        algumaCoisaMudou = true;
    }

    for (const id of metas) {
        console.log(`%cEnviando requisição PUT para META ${id} como 'Falhou'.`, 'color: orange');
        await enviarAtualizacaoDeStatus('meta', id, 'Falhou');
        algumaCoisaMudou = true;
    }
    
    if (algumaCoisaMudou) {
        console.log("Recarregando dados após atualizar itens expirados.");
        await carregarTarefas();
        await carregarMetas();
        renderTarefas();
        renderMetas();
        analisarEstatisticas();
    }
}

async function enviarAtualizacaoDeStatus(tipo, id, status) {
    try {
        const url = `${API_BASE_URL}/${tipo}/${tipo === 'meta' ? 'update/' : ''}${id}`;
        console.log(`Montando requisição PUT para a URL: ${url}`);
        
        const response = await fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: status })
        });

        if (!response.ok) {
            console.error(`ERRO na resposta do backend para ${tipo} ${id}. Status: ${response.status}`);
            throw new Error(`Erro ao atualizar ${tipo} ${id}`);
        } else {
            console.log(`%cSUCESSO ao atualizar ${tipo} ${id}.`, 'color: green');
        }
    } catch (error) {
        console.error(error);
    }
}

    // ===================================================================
    // INICIALIZAÇÃO E EVENT LISTENERS
    // ===================================================================
    
    window.deletarTarefaId = deletarTarefaId;
    window.atualizarStatusTarefa = atualizarStatusTarefa;
    window.deletarMetaId = deletarMetaId;
    window.atualizarStatusMeta = atualizarStatusMeta;

    prevBtn.addEventListener("click", prevMonth);
    nextBtn.addEventListener("click", nextMonth);

    formTarefa.addEventListener('submit', async (e) => {
        e.preventDefault();
        const descricao = document.getElementById('descricao-tarefa').value;
        const categoria = document.getElementById('categoria-tarefa').value;
        const horaFinal = document.getElementById('hora-final-tarefa').value;
        await criarTarefa(descricao, categoria, horaFinal);
        formTarefa.reset();
    });
    filtroCategoriaTarefa.addEventListener('change', renderTarefas);

    formMeta.addEventListener('submit', async (e) => {
        e.preventDefault();
        await criarMeta(
            document.getElementById('descricao').value,
            document.getElementById('categoria').value,
            document.getElementById('periodo').value // O período ainda é pego para o cálculo da data
        );
        formMeta.reset();
    });
    // O filtro de período não vai mais funcionar, mas o listener pode ser mantido caso o campo retorne no futuro.
    filtroPeriodo.addEventListener('change', renderMetas);
    filtroCategoria.addEventListener('change', renderMetas);

    async function initApp() {
        listaTarefasDiv.innerHTML = "<p>Carregando tarefas...</p>";
        listaMetasDiv.innerHTML = "<p>Carregando metas...</p>";
        
        await carregarTarefas();
        await carregarMetas();
        
        initCalendar();
        renderTarefas();
        renderMetas();
        analisarEstatisticas();
        atualizarStatusExpirados(); // Verificação inicial imediata
        setInterval(atualizarStatusExpirados, 60 * 1000); // A cada 1 minuto
    }

    initApp();
});