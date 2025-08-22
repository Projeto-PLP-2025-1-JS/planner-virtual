import {metaService} from './service/metaService.js'

export const metaController = {

    criar: (request,reply) => {
        try{
            metaService.criarMeta(request.body)
            return reply.status(201).send()
        }
        catch(e){
            return reply.status(400).send({ message: 'Erro na validação de meta.', errors: error.issues })
        }
        //fim do metodo de criar
    },
    
}