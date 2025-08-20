import { z } from "zod" ;

export const metaModel = z.object({
    descricao: z.string(),
    
    categoria: z.string(),

    periodo: z.string(),

    status: z.string(),
  
    dataCriacao: z.date(),
  
    dataFinal: z.date()
    .optional(), 

    dataConcluida: z.date()

})

[{"id":1,"descricao":"CVXCVXCV","categoria":"financeiro",
    "periodo":"semana","status":"pendente","dataCriacao":"2025-08-20","dataFinal":"2025-08-24","dataConcluida":null}]