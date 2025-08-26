import { metaController } from "./controller/metaController.js";
import { tarefaController } from "./controller/tarefaController.js";
import { tarefaService } from "./service/tarefa-service.js";
import { DatabaseMemory } from "./database/database-memory.js";
import { metaService } from "./service/metaService.js";

export function appRoutes (server){

    const database = new DatabaseMemory();
    const tarefaServices = new tarefaService(database);
    const metaServices = new metaService(database);
    const tarefaControllers = new tarefaController(tarefaServices);
    const metaControllers = new metaController(metaServices);

    // Rotas de tarefa
    server.post('/tarefa/create', tarefaControllers.criar.bind(tarefaControllers));
    server.get('/tarefas', tarefaControllers.listar.bind(tarefaControllers));
    server.put('/tarefa/:id', tarefaControllers.atualizar.bind(tarefaControllers));
    server.delete('/tarefa/:id', tarefaControllers.delete.bind(tarefaControllers));

    //server.get('/meta/get',metaController.listar)
    server.post('/meta/create',metaControllers.create.bind(metaControllers));
    server.get('/meta/get',metaControllers.getMetas.bind(metaControllers));
    server.put('/meta/update/:id',metaControllers.updateMeta.bind(metaControllers));
    server.delete('/meta/delete/:id',metaControllers.deleteMeta.bind(metaControllers));
}