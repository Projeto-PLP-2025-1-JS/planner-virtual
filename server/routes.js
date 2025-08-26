import { metaController } from "./controller/metaController.js";
import { tarefaController } from "./controller/tarefaController.js";
import { tarefaService } from "./service/tarefa-service.js";
import { DatabaseMemory } from "./database/database-memory.js";

export function appRoutes (server){

    const database = new DatabaseMemory();
    const tarefaServices = new tarefaService(database);
    const tarefaControllers = new tarefaController(tarefaServices);

    // Rotas de tarefa
    server.post('/tarefa/create', tarefaControllers.criar.bind(tarefaControllers));
    server.get('/tarefas', tarefaControllers.listar.bind(tarefaControllers));
    server.put('/tarefa/:id', tarefaControllers.atualizar.bind(tarefaControllers));
    server.delete('/tarefa/:id', tarefaControllers.delete.bind(tarefaControllers));

    //server.get('/meta/get',metaController.listar)
    server.post('/meta/create',metaController.create)
    server.get('/meta/get',metaController.getMetas)
    server.put('/meta/update/:id',metaController.updateMeta)
    server.delete('/meta/delete/:id',metaController.deleteMeta)
}