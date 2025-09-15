import tarefaController from './controller/tarefaController.js';
import metaController from './controller/metaController.js';
import lembreteController from './controller/lembreteController.js';

export function appRoutes (server){

    // Rotas de tarefa
    server.post('/tarefa/create', tarefaController.criar);
    server.get('/tarefas', tarefaController.listar);
    server.get('/tarefa/:id', tarefaController.getTarefa);
    server.put('/tarefa/:id', tarefaController.atualizar);
    server.delete('/tarefa/:id', tarefaController.deletar);


    // Rotas meta
    server.post('/meta/create',metaController.createMeta);
    server.get('/meta/get/:id', metaController.getMeta);
    server.get('/meta/getAll',metaController.getMetas);
    server.put('/meta/update/:id',metaController.updateMeta);
    server.delete('/meta/delete/:id',metaController.deleteMeta);

    //
    server.post('/lembrete/create',lembreteController.createLembrete)
    server.delete('/lembrete/delete/:id',lembreteController.deleteLembrete)
    server.get('/lembrete/getAll',lembreteController.getAllLembretes)


    
}

    
    
    

