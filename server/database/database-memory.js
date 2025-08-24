import { randomUUID } from "node:crypto"

export class DatabaseMemory {
    #tarefa = new Map()
    #meta = new Map()
    
    create(tarefa){
        const tarefaId = randomUUID()
        this.#tarefa.set(tarefaId, tarefa)
    }

    findById(id) {
        const tarefa = this.#tarefa.get(id);
        return tarefa || null;
    }

    listar(search){
        return Array.from(this.#tarefa.entries())
            .map((tarefaArray) => {
                const id = tarefaArray[0]
                const data = tarefaArray[1]
                
                return {
                    id,
                    ...data,
                }
        })
        .filter(tarefa => {
            if (search){
              return tarefa.title.includes(search)
            }
            return true 
        })
    }

    update(tarefaId, formulario){
        this.#tarefa.set(tarefaId, formulario)
    }

    delete(id){
        this.#tarefa.delete(id)
    }


//metodos de meta

    createMeta(meta){
        const metaId = randomUUID()
        this.#meta.set(metaId,meta)
    }

    getMetas(search){
        return Array.from(this.#meta.entries()).map((metaArray)=> {
                const id = metaArray[0]
                const data = metaArray[1]
                
                return {
                    id,
                    ...data,
                }
        })
        .filter(meta => {
            if (search){
              return meta.descricao.includes(search)
            }
            return true 
        })
    }

    updateMeta(id,metaData){
        if(this.#meta.has(id))
            {
        this.#meta.set(id,metaData)
    }
    else{
        throw new Error('Meta não encontrada.')}
    }

    deleteMeta(id){
        this.#meta.delete(id)
    }

    }

