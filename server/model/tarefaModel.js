import { z } from "zod" ;

export const tarefaModel = z.object({
    
  descricao: z.string(),
    
  categoria: z.string(),

  status: z.string(),
  
  horaCriacao: z.string(),
  
  horaFinal: z.string()
  .optional(),

  horaConclusao: z.string().optional() 
})