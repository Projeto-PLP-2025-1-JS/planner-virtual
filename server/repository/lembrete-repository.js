import Lembrete from '../model/lembreteModel.js'

class lembreteRepository{
    async createLembrete(lembrete){
        return await Lembrete.create(lembrete)
    }

    async getAllLembretes(){
        return await Lembrete.findAll()
        
    }

    async deleteLembrete(id){
        const lembreteDeletado = await Lembrete.findByPk(id)
        if(lembreteDeletado == null){
            return;
        }
        await lembreteDeletado.destroy();
        return lembreteDeletado;
    }

    
}

export default new lembreteRepository