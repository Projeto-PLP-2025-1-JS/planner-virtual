import { database } from "../database/database.js";
import { tarefaModel } from "../model/tarefaModel.js";

export const tarefaService = {
    criarTarefa: (tarefaData) => {
        const tarefaValida = tarefaModel.parse(tarefaData);
        database.create(tarefaValida)
    },

    listar: (search) => {
        return database.listar(search)
    },

    atualizarTarefa: (tarefaId, tarefaData) =>{
        const tarefaValida = database.findById(tarefaId)
        if(!tarefaValida){
            throw new Error('Tarefa não encontrada.');
        }
        database.update(tarefaId,tarefaData)
    },
    deleteTarefa: (tarefaId) => {
        const tarefaValida = database.findById(tarefaId)
        if(!tarefaValida){
            throw new Error('Tarefa não encontrada.');
        }
        database.delete(tarefaId)
    }
}