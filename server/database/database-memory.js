import { randomUUID } from "node:crypto"

export class DatabaseMemory {
    #tarefa = new Map()

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

}