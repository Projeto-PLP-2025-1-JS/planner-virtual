import tarefaService from '../service/tarefaService.js';

class TarefaController {

     async criar(request, reply) {
    try {
      // O service e o repository vão tentar salvar diretamente no banco
      const novaTarefa = await tarefaService.criarTarefa(request.body);
      
      // Retorna 201 Created com a nova tarefa criada
      return reply.status(201).send(novaTarefa);

    } catch (error) {
      console.error(error); 
      return reply.status(500).send({ message: 'Erro ao criar a tarefa.' });
    }
  }

  async listar() {
    const tarefas = await tarefaService.listar()
    return tarefas
  }
  async getTarefa(request) {
    const tarefaId = request.params.id
    const tarefa = await tarefaService.getTarefa(tarefaId)
    return tarefa;
  }

  async atualizar (request, reply) {
      const tarefaId = request.params.id
      try {
      await tarefaService.atualizarTarefa(tarefaId,request.body)
      return reply.status(204).send()
    } catch (error) {
      if (error.message === 'Tarefa não encontrada.') {
        return reply.status(404).send({ message: error.message });
      }
      return reply.status(400).send({ message: 'Erro na validação da tarefa.'})
    }

  }
async deletar (request, reply) {
  const tarefaId = request.params.id;
  try {
    await tarefaService.deleteTarefa(tarefaId);
    return reply.status(204).send();
  } catch (error) {
    if (error.message === 'Tarefa não encontrada.') {
      return reply.status(404).send({ message: error.message });
    }
    return reply.status(500).send({ message: 'Erro interno do servidor.' });
  }
  }
}

export default new TarefaController();