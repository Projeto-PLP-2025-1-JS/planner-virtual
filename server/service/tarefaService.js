import tarefaRepository from '../repository/tarefa-repository.js';

class TarefaService {

    async criarTarefa (tarefa) {
        return await tarefaRepository.create(tarefa);
    }

    async listar () {
        return await tarefaRepository.list();
    }

    async getTarefa (tarefaId) {
        return await tarefaRepository.findById(tarefaId)
    }

    async atualizarTarefa (tarefaId, tarefa) {
        const tarefaExists = await tarefaRepository.findById(tarefaId);
        if(!tarefaExists){
            throw new Error('Tarefa não encontrada.');
        }
        return await tarefaRepository.update(tarefaId, tarefa);
    }

    async deleteTarefa (tarefaId) {
        const tarefaValida = await tarefaRepository.findById(tarefaId);
        if(!tarefaValida){
            throw new Error('Tarefa não encontrada.');
        }
        return await tarefaRepository.delete(tarefaId)
    }
}

export default new TarefaService();