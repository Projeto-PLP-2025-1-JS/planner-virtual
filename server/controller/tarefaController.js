import tarefaService from '../service/tarefaService.js';

class TarefaController {

     async criar(request, reply) {
    try {
      // O service e o repository vão tentar salvar diretamente no banco
      const novaTarefa = await tarefaService.criarTarefa(request.body);
      
      // Retorna 201 Created com a nova tarefa criada
      return reply.status(201).send(novaTarefa);

    } catch (error) {
      // Agora, qualquer erro será um erro genérico do servidor ou do banco
      console.error(error); // Adicione um log para ver o erro no terminal
      return reply.status(500).send({ message: 'Erro ao criar a tarefa.' });
    }
  }

  async listar() {
    const tarefas = await this.tarefaService.listar()
    return tarefas
  }

  async atualizar (request, reply) {
      const tarefaId = request.params.id
      try {
      await tarefaService.atualizarTarefa(tarefaId,request.body)
      return reply.status(204).send()
    } catch (error) {
      return reply.status(400).send({ message: 'Erro na validação da tarefa.', errors: error.issues })
    }

  }
async deletar (request, reply) {
  const tarefaId = request.params.id;
  try {
    await tarefaService.deleteTarefa(tarefaId);
    return reply.status(204).send();
  } catch (error) {
    if (error.message === 'Tarefa não encontrada.') {
      // Retorna 404 para recursos que não existem
      return reply.status(404).send({ message: error.message });
    }
    // Para outros erros inesperados, retorna 500
    return reply.status(500).send({ message: 'Erro interno do servidor.' });
  }
  }
}

export default new TarefaController();