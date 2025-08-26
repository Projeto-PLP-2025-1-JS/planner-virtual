import { tarefaModel } from "../model/tarefaModel.js";

export class tarefaService {
    constructor(database) {
        this.database = database;
    }


    async criarTarefa (tarefaData) {
        const tarefaValida = tarefaModel.parse(tarefaData);
        await this.database.create(tarefaValida)
    }

    async listar (search) {
        return await this.database.listar(search)
    }

    async atualizarTarefa (tarefaId, tarefaData) {
        const tarefaValida = await this.database.findById(tarefaId)
        if(!tarefaValida){
            throw new Error('Tarefa não encontrada.');
        }
        database.update(tarefaId,tarefaData)
    }
    async deleteTarefa (tarefaId) {
        const tarefaValida = await this.database.findById(tarefaId)
        if(!tarefaValida){
            throw new Error('Tarefa não encontrada.');
        }
        database.delete(tarefaId)
    }
}