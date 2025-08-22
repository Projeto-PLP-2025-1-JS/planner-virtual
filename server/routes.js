import { metaController } from "./controller/metaController.js";
import { tarefaController } from "./controller/tarefaController.js";

export function appRoutes (server){

    // Rotas de tarefa
    server.post('/tarefa/create', tarefaController.criar)
    server.get('/tarefas', tarefaController.listar)
    server.put('/tarefa/:id', tarefaController.atualizar)
    server.delete('/tarefa/:id', tarefaController.delete)

    //server.get('/meta/get',metaController.listar)
    server.post('/meta/create',metaController.create)
    server.get('/meta/get',metaController.getMetas)
}