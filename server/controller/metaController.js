

export class metaController {
    constructor(metaService){
        this.metaService = metaService
    }

    async create(request,reply) {
        try{
            await this.metaService.create(request.body)
            return reply.status(201).send()
        }
        catch(e){
            return reply.status(400).send(e.message)
            
        }
    }

    async getMetas(request,reply){
        try{
            const {search} = request.query
            const metas = await this.metaService.getMetas(search)
            return reply.status(200).send(metas)
        }catch(e){
            return reply.status(400).send(e.message)
        }
    
}

    async updateMeta (request,reply){
        try{
            const idUsuario = request.params.id
            const metaAtualizada = request.body
            await this.metaService.updateMeta(idUsuario,metaAtualizada)
            return reply.status(204).send()
        }catch(e){
            return reply.status(400).send('Erro ao atualizar tarefa: '+ e.message)
        }
    }

    async deleteMeta(request,reply){
        try{
            const idDeletar = request.params.id
            await this.metaService.deleteMeta(idDeletar)
            return reply.status(204).send()
        }catch(e){
            return reply.status(400).send('Erro ao deletar meta:'+ e.message)
        }
    }

}