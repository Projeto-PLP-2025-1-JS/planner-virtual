import lembreteService from '../service/lembreteService.js'

class lembreteController{
    async createLembrete(request,reply) {
            try {   
                const lembrete = request.body
                const result = await lembreteService.createLembrete(lembrete)
                reply.status(201).send(result)
            }
            catch (e){
                reply.status(400).send({error: 'Erro ao criar lembrete: ' + e.message})
            }
        }

    async getAllLembretes(request,reply){
            try {   
                const lembretes = await lembreteService.getAllLembretes()
                reply.status(200).send(lembretes)
            }
            catch (e){
                reply.status(400).send({error: 'Erro ao conseguir os lembretes: ' + e.message})
            }
        }
    
    async deleteLembrete(request, reply){
            try{
                const id = request.params.id
                const lembreteDeletado = await lembreteService.deleteLembrete(id)
                return reply.status(200).send(lembreteDeletado)
            }catch(e){
                reply.status(400).send({error: 'Erro ao deletar lembrete ' + e.message})
            }
    }
}



export default new lembreteController();