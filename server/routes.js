import { tarefaController } from "./controller/tarefaController.js";

export function appRoutes (server){

    // Rotas de tarefa
    server.post('/create/tarefa', tarefaController.criar)
    server.get('/tarefas', tarefaController.listar)
    server.put('/tarefa/:id', tarefaController.atualizar)
    server.delete('/tarefa/:id', tarefaController.delete)

}