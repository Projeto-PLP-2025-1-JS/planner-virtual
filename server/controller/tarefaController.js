
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
  async delete (request,reply) {
    const tarefaId = request.params.id
    try {
      await this.tarefaService.deleteTarefa(tarefaId)
      return reply.status(204).send()
    } catch (error) {
      return reply.status(400).send({ message: 'Tarefa não encontrada.', errors: error.issues })

    }
  }
}