import metaRepository from '../repository/meta-repository.js'

class MetaService {
    
    async createMeta(meta){
        return await metaRepository.createMeta(meta)
    }

    async getAllMetas(){
        return await metaRepository.getAllMetas()
    }

    async getMeta(id){
        return await metaRepository.getMeta(id)
    }

    async updateMeta(id,metaNova){
        return await metaRepository.updateMeta(id,metaNova)
    }

    async deleteMeta(id){
        return await metaRepository.deleteMeta(id)
    }
}

export default new MetaService();