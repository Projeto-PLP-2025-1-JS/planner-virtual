import { z } from "zod" ;

export const metaModel = z.object({
    descricao: z.string(),
    
    categoria: z.string(),

    periodo: z.string(),

    status: z.string(),
  
    dataCriacao: z.string(),
  
    dataFinal: z.string().nullable().optional(), 

    dataConcluida: z.string().nullable().optional(),

})