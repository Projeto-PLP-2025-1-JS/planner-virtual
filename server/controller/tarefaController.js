import { tarefaService } from "../service/tarefa-service.js";

export const tarefaController = {
      criar: (request, reply) => {
    try {
      tarefaService.criarTarefa(request.body)
      return reply.status(201).send()
    } catch (error) {
      return reply.status(400).send({ message: 'Erro na validação da tarefa.', errors: error.issues })
    }
  },

  listar: (request) => {
    const tarefas = tarefaService.listar(request.query.search)
    return tarefas
  },

  atualizar: (request, reply) => {
      const tarefaId = request.params.id
      try {
      tarefaService.atualizarTarefa(tarefaId,request.body)
      return reply.status(204).send()
    } catch (error) {
      return reply.status(400).send({ message: 'Erro na validação da tarefa.', errors: error.issues })
    }

  },
  delete: (request,reply) => {
    const tarefaId = request.params.id
    try {
      tarefaService.deleteTarefa(tarefaId)
      return reply.status(204).send()
    } catch (error) {
      return reply.status(400).send({ message: 'Tarefa não encontrada.', errors: error.issues })

    }
  }
}