import lembreteRepository from '../repository/lembrete-repository.js'

class lembreteService{

    async createLembrete(lembrete){
            return await lembreteRepository.createLembrete(lembrete)
        }

    async deleteLembrete(id){
        return await lembreteRepository.deleteLembrete(id)
    }

    async getAllLembretes(){
        return await lembreteRepository.getAllLembretes()
    }
}


export default new lembreteService;