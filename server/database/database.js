import { DatabaseMemory } from "./database-memory.js";


//criei essa classe para poder instancia o banco de dados de uma forma unica, para usar um unico banco que contenha tarefa e metas.
export const database = new DatabaseMemory();