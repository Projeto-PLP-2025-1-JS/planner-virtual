import { metaModel } from "../model/metaModel.js";


export class metaService{
    constructor(database){
        this.database = database
    }
    async create(metaData) {
        const meta = metaModel.parse(metaData);
        try{
        await this.database.createMeta(meta);}
        catch (error) {
            throw new Error('Erro ao criar meta: ' + error.message);
        }
    }

    async getMetas (search) {
        try{
            const metas = await this.database.getMetas(search)
            return metas;
        }catch (e){
            throw new Error('Erro ao buscar metas: ' + e.message);
        }
    }

    async updateMeta (id,metaData) {
        try{
            const meta = metaModel.parse(metaData);
            await this.database.updateMeta(id,meta)
        }catch (e){
            throw new Error('Erro ao atualizar meta: ' + e.message);
        }
    }

    async deleteMeta (id) {
        try{
            await this.database.deleteMeta(id)
        }
        catch (e){
            throw new Error("Erro ao deletar meta: " + e.message)
        }
    }
}