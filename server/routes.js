import tarefaController from './controller/tarefaController.js';


export function appRoutes (server){

    // Rotas de tarefa
    server.post('/tarefa/create', tarefaController.criar);
    server.get('/tarefas', tarefaController.listar);
    server.put('/tarefas/:id', tarefaController.atualizar);
    server.delete('/tarefas/:id', tarefaController.deletar);
}

    // server.post('/meta/create',metaControllers.create.bind(metaControllers));
    // server.get('/meta/get',metaControllers.getMetas.bind(metaControllers));
    // server.put('/meta/update/:id',metaControllers.updateMeta.bind(metaControllers));
    // server.delete('/meta/delete/:id',metaControllers.deleteMeta.bind(metaControllers));
