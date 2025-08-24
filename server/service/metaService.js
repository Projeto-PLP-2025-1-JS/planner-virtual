import { database } from "../database/database.js";
import { metaModel } from "../model/metaModel.js";


export const metaService = {
    create: (metaData) => {
        const meta = metaModel.parse(metaData);
        try{
        database.createMeta(meta);}
        catch (error) {
            throw new Error('Erro ao criar meta: ' + error.message);
            console.log(error);
        }
    },

    getMetas: (search) => {
        try{
            const metas = database.getMetas(search)
            return metas;
        }catch (e){
            throw new Error('Erro ao buscar metas: ' + e.message);
        }
    },

    updateMeta: (id,metaData) => {
        try{
            const meta = metaModel.parse(metaData);
            database.updateMeta(id,meta)
        }catch (e){
            throw new Error('Erro ao atualizar meta: ' + e.message);
        }
    },

    deleteMeta: (id) => {
        try{
            database.deleteMeta(id)
        }
        catch (e){
            throw new Error("Erro ao deletar meta: " + e.message)
        }
    }
}