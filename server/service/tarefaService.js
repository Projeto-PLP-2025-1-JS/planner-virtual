import tarefaRepository from '../repository/tarefa-repository.js';

class TarefaService {

    async criarTarefa (tarefa) {
        return await tarefaRepository.create(tarefa);
    }

    async listar () {
        return await tarefaRepository.list();
    }

    async atualizarTarefa (tarefaId, tarefa) {
        const tarefaExists = await tarefaRepository.findById(tarefaId);
        if(!tarefaExists){
            throw new Error('Tarefa não encontrada.');
        }
        return await metaRepository.update(id, tarefa);
    }

    async deleteTarefa (tarefaId) {
        const tarefaValida = await tarefaRepository.findById(id);
        if(!tarefaValida){
            throw new Error('Tarefa não encontrada.');
        }
        return await tarefaRepository.delete(tarefaId)
    }
}

export default new TarefaService();