import { Transaction } from 'sequelize'
import metaService from '../service/metaService.js'

export class metaController {

    async createMeta(request,reply) {
        try {   
            const meta = request.body
            const result = await metaService.createMeta(meta)
            reply.status(201).send(result)
        }
        catch (e){
            reply.status(400).send({error: 'Erro ao criar meta: ' + e.message})
        }
    }

    async getMetas(request,reply){
        try {   
            const metas = await metaService.getAllMetas()
            reply.status(200).send(metas)
        }
        catch (e){
            reply.status(400).send({error: 'Erro ao conseguir as meta: ' + e.message})
        }
    }

    async getMeta(request,reply){
        try {   
            const id = request.params.id
            const meta = await metaService.getMeta(id)
            if (meta === null) 
                {
            return reply.status(404).send({
                error: 'Meta com ID ' + id +  ' não encontrada.'
            });
            }
        reply.status(200).send(meta)
        }
        catch (e){
            reply.status(400).send({error: 'Erro ao conseguir a meta de id '+ id + ': ' + e.message})
        }
    }

    async updateMeta (request,reply){
        try{
            const id = request.params.id
            const metaNova = request.body
            const metaAtualizada = await metaService.updateMeta(id,metaNova)
            if(!metaAtualizada){
                return reply.status(404).send({error: 'Erro ao encontrar meta.'})
            }
            reply.status(200).send(metaAtualizada)

        }
        catch(e){
            reply.status(400).send({error: 'Erro ao atualizar meta:' + e.message})
        }
    }

    async deleteMeta(request,reply){
       try{
            const id = request.params.id
            const metaDeletada = await metaService.deleteMeta(id)
            if(!metaDeletada){
                return reply.status(404).send({error: 'Erro ao encontrar meta.'})
            }
            reply.status(200).send('Meta deletada')
       }
       catch(e){
            reply.status(400).send({error: 'Erro ao deletar meta: '+e.message})
       }
    }

}

export default new metaController();