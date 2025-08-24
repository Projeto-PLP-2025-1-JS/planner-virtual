
import {metaService} from '../service/metaService.js'

export const metaController = {

    create: (request,reply) => {
        try{
            metaService.create(request.body)
            return reply.status(201).send()
        }
        catch(e){
            return reply.status(400).send(e.message)
            
        }
        
        //fim do metodo de criar
    },

    getMetas:(request,reply) => {
        try{
            const {search} = request.query
            const metas = metaService.getMetas(search)
            return reply.status(200).send(metas)
        }catch(e){
            return reply.status(400).send(e.message)
        }
    
},

    updateMeta: (request,reply) => {
        try{
            const idUsuario = request.params.id
            const metaAtualizada = request.body
            metaService.updateMeta(idUsuario,metaAtualizada)
            return reply.status(204).send()
        }catch(e){
            return reply.status(400).send('Erro ao atualizar tarefa: '+ e.message)
        }
    },

    deleteMeta:(request,reply) => {
        try{
            const idDeletar = request.params.id
            metaService.deleteMeta(idDeletar)
            return reply.status(204).send()
        }catch(e){
            return reply.status(400).send('Erro ao deletar meta:'+ e.message)
        }
    }

}