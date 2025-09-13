// Aguarda o HTML ser completamente carregado antes de executar o script.
document.addEventListener("DOMContentLoaded", () => {

    // --- 1. SELEÇÃO DOS ELEMENTOS HTML (DOM) ---
    // Guardamos em constantes as referências aos elementos HTML que vamos manipular.
    // Fazer isso no início organiza o código e melhora a performance.
    const dateElement = document.querySelector(".date");       // Onde o título "Mês Ano" será exibido.
    const daysContainer = document.querySelector(".days");     // O container <div> onde os dias (números) serão inseridos.
    const prevBtn = document.querySelector(".prev");           // A seta para voltar para o mês anterior.
    const nextBtn = document.querySelector(".next");           // A seta para avançar para o próximo mês.

    // --- 2. ESTADO DO CALENDÁRIO ---
    // Estas variáveis controlam o estado atual do calendário.
    const today = new Date();                                     // Pega a data completa de hoje.
    let month = today.getMonth();                                 // Mês atual (0 = Janeiro, 11 = Dezembro).
    let year = today.getFullYear();                               // Ano atual (ex: 2025).
    let activeDay;                                                // Guardará o número do dia que está selecionado (clicado).

    // Um array com os nomes dos meses para facilitar a exibição.
    const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    // --- 3. FUNÇÃO PRINCIPAL DE RENDERIZAÇÃO: initCalendar ---
    // Esta é a função mais importante. Ela desenha o calendário na tela.
// Cole esta função completa no lugar da sua função initCalendar/renderCalendar existente.
// Substitua a sua função initCalendar inteira por esta:
function initCalendar() {
    // --- Cálculos de Datas ---
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const prevLastDay = new Date(year, month, 0);

    const prevDays = prevLastDay.getDate();
    const lastDate = lastDay.getDate();
    const dayOfWeek = firstDay.getDay();

    // Atualiza o título do calendário
    dateElement.innerHTML = `${months[month]} ${year}`;

    // --- Geração do HTML dos Dias ---
    let days = "";

    // Loop para dias do mês anterior
    for (let x = dayOfWeek; x > 0; x--) {
        days += `<div class="day prev-date">${prevDays - x + 1}</div>`;
    }

    // Loop para dias do mês atual
    for (let i = 1; i <= lastDate; i++) {
        // --- LINHAS REMOVIDAS DAQUI ---
        // As linhas que verificavam "hasTask" foram removidas para corrigir o erro.
        let classes = "day";
        if (i === new Date().getDate() && year === new Date().getFullYear() && month === new Date().getMonth()) {
            classes += " today";
        }
        if (i === activeDay) {
            classes += " active";
        }
        days += `<div class="${classes}">${i}</div>`;
    }

    // Lógica corrigida para os dias do próximo mês
    const totalCellsRendered = dayOfWeek + lastDate;
    const cellsToFill = (7 - totalCellsRendered % 7) % 7;

    for (let j = 1; j <= cellsToFill; j++) {
        days += `<div class="day next-date">${j}</div>`;
    }

    // Insere os dias no container
    daysContainer.innerHTML = days;
    addDayClickListeners();
}

    // --- 4. FUNÇÕES DE NAVEGAÇÃO ---

    // Função para ir para o mês anterior.
    function prevMonth() {
        month--; // Diminui o mês.
        if (month < 0) { // Se passar de Janeiro (0) para trás...
            month = 11;    // ...volta para Dezembro (11).
            year--;      // E diminui um ano.
        }
        initCalendar(); // Redesenha o calendário com a nova data.
    }

    // Função para ir para o próximo mês.
    function nextMonth() {
        month++; // Aumenta o mês.
        if (month > 11) { // Se passar de Dezembro (11) para frente...
            month = 0;     // ...vai para Janeiro (0).
            year++;      // E aumenta um ano.
        }
        initCalendar(); // Redesenha o calendário.
    }

    // --- 5. GERENCIADOR DE CLIQUES NOS DIAS ---

    function addDayClickListeners() {
        // Pega todos os elementos com a classe '.day'.
        const allDays = document.querySelectorAll(".day");
        // Adiciona um evento de clique para cada um.
        allDays.forEach(day => {
            day.addEventListener("click", (e) => {
                // Se o dia clicado for do mês anterior, navega para o mês anterior.
                if (e.target.classList.contains("prev-date")) {
                    prevMonth();
                    return; // Para a execução para não marcar o dia como ativo.
                }
                // Se o dia clicado for do próximo mês, navega para o próximo mês.
                if (e.target.classList.contains("next-date")) {
                    nextMonth();
                    return;
                }

                // Atualiza o estado 'activeDay' com o número do dia que foi clicado.
                activeDay = Number(e.target.innerHTML);

                // Remove a classe 'active' de todos os outros dias.
                allDays.forEach(d => d.classList.remove("active"));
                // Adiciona a classe 'active' apenas no dia que foi clicado.
                e.target.classList.add("active");

                // Aqui você pode adicionar qualquer outra lógica que precise acontecer
                // quando um dia é clicado, como exibir tarefas ou informações.
                console.log(`Dia selecionado: ${activeDay}/${month + 1}/${year}`);
            });
        });
    }

    // --- 6. ADIÇÃO DOS EVENTOS INICIAIS ---
    // Conecta as funções de navegação aos botões de seta.
    prevBtn.addEventListener("click", prevMonth);
    nextBtn.addEventListener("click", nextMonth);

    // --- 7. INICIALIZAÇÃO DA APLICAÇÃO ---
    // Função que dá o pontapé inicial.
    function initApp() {
        // Define o dia ativo como o dia de hoje ao carregar a página.
        activeDay = today.getDate();
        // Chama a função principal para desenhar o calendário pela primeira vez.
        initCalendar();
    }

    // Roda a aplicação.
    initApp();
});