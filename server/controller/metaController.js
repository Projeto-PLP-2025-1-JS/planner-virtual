
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

}