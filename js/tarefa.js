class Tarefa {
  constructor(id, descricao, categoria, horaFinalStr) {
    this.id = id;
    this.descricao = descricao;
    this.categoria = categoria;
    this.status = 'pendente';
    this.dataCriacao = this.getHoraAtual();
    this.dataFinal = this.stringParaDate(horaFinalStr);
    this.dataConclusao = null; // 'HH:MM' se concluída
  }

  getHoraAtual() {
    const agora = new Date();
    return agora.toTimeString().slice(0, 5); // "HH:MM"
  }

  stringParaDate(horaStr) {
    const [hora, minuto] = horaStr.split(':').map(Number);
    const agora = new Date();
    const horaFinal = new Date();

    horaFinal.setHours(hora, minuto, 0, 0);

    return horaFinal;
  }
  
  getHoraFinalFormatada() {
    if (!this.horaFinal) return '-';
    const horas = String(this.horaFinal.getHours()).padStart(2, '0');
    const minutos = String(this.horaFinal.getMinutes()).padStart(2, '0');
    return `${horas}:${minutos}`;
  }

  atualizarStatus(novoStatus) {
    const statusValidos = ['Pendente', 'Executada', 'Parcial', 'Atrasada'];
    if (statusValidos.includes(novoStatus)) {
      this.status = novoStatus;
    }
  }

  taAtrasada() {
    if (!this.horaFinal) return false; // sem hora final definida
    return new Date() > this.horaFinal;
  }
}
