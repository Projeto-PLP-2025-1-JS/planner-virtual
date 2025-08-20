import { DatabaseMemory } from "../database/database-memory.js";
import { metaModel } from "../model/tarefaModel.js";

const database = new DatabaseMemory()

export const metaService = {
    criar: (metaData) => {
        const meta = metalModel.parse(metaData);
        database.create(meta);
    },
}