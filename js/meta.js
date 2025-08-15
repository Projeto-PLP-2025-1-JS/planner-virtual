class Meta {
  constructor(id, descricao, categoria, periodo) {
    this.id = id;
    this.descricao = descricao;
    this.categoria = categoria;
    this.periodo = periodo;    //'semana', 'mes', 'ano'
    this.status = 'pendente';
    this.dataCriacao = new Date().toISOString().slice(0, 10); // 'yyyy-mm-dd'
    this.dataFinal = this.calcularDataFinal(); // 'yyyy-mm-dd'
    this.dataConcluida = null; // 'yyyy-mm-dd' se concluída
  }

  atualizarStatus(novoStatus) {
    const statusValidos = ['pendente', 'sucesso', 'parcial', 'falha'];
    if (statusValidos.includes(novoStatus)) this.status = novoStatus;
  }

  calcularDataFinal() {
    const hoje = new Date();
    switch(this.periodo) {
      case 'semana':
        // calcula o próximo domingo
        const diaSemana = hoje.getDay(); // 0 (domingo) a 6 (sábado)
        console.log(diaSemana);
        const diasAteDomingo = 7 - diaSemana;
        const proximoDomingo = new Date(hoje);
        proximoDomingo.setDate(hoje.getDate() + diasAteDomingo);
        return proximoDomingo.toISOString().slice(0, 10);
      case 'mes':
        // último dia do mês
        const ultimoDiaMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
        return ultimoDiaMes.toISOString().slice(0, 10);
      case 'ano':
        // último dia do ano
        const ultimoDiaAno = new Date(hoje.getFullYear(), 11, 31);
        return ultimoDiaAno.toISOString().slice(0, 10);
      default:
        return hoje.toISOString().slice(0, 10);
    }
  }
}
