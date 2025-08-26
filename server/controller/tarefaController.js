
export class tarefaController {

  constructor(tarefaService) {
    this.tarefaService = tarefaService;
  }

    async criar(request, reply) {
    try {
      await this.tarefaService.criarTarefa(request.body)
      return reply.status(201).send()
    } catch (error) {
      return reply.status(400).send({ message: 'Erro na validação da tarefa.', errors: error.issues })
    }
  }

  async listar(request) {
    const tarefas = await this.tarefaService.listar(request.query.search)
    return tarefas
  }

  async atualizar (request, reply) {
      const tarefaId = request.params.id
      try {
      await this.tarefaService.atualizarTarefa(tarefaId,request.body)
      return reply.status(204).send()
    } catch (error) {
      return reply.status(400).send({ message: 'Erro na validação da tarefa.', errors: error.issues })
    }

  }
async delete (request, reply) {
  const tarefaId = request.params.id;
  try {
    await this.tarefaService.deleteTarefa(tarefaId);
    return reply.status(204).send();
  } catch (error) {
    if (error.message === 'Tarefa não encontrada.') {
      // Retorna 404 para recursos que não existem
      return reply.status(404).send({ message: error.message });
    }
    // Retorna 400 para erros de cliente, como ID malformado
    if (error.name === 'ZodError') {
      return reply.status(400).send({ message: 'ID da tarefa inválido.', errors: error.issues });
    }
    // Para outros erros inesperados, retorna 500
    return reply.status(500).send({ message: 'Erro interno do servidor.' });
  }
}
}