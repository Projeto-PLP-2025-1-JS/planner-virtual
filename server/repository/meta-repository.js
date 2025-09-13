import Meta from '../model/metaModel.js';

class MetaRepository{
    async createMeta(meta){
        return await Meta.create(meta)
    }

    async getAllMetas(){
        return await Meta.findAll();
    }

    async getMeta(id){
        return await Meta.findByPk(id);
        
    }

    async updateMeta(id,metaNova){
        let metaAntiga = await Meta.findByPk(id)
        if(metaAntiga == null){
            return;
        }
       for (const atributo in metaNova) {
        if (metaNova.hasOwnProperty(atributo)) {
            metaAntiga[atributo] = metaNova[atributo];
        }
    }
        await metaAntiga.save();
        return metaAntiga;
    }

    async deleteMeta(id){
        const metaDeletada = await Meta.findByPk(id)
        if(metaDeletada == null){
            return;
        }
        await metaDeletada.destroy();
        return metaDeletada;    
    }
}

export default new MetaRepository();