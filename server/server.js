import { fastify } from "fastify";
import cors from '@fastify/cors';
import { appRoutes } from './routes.js'

const server = fastify();
server.register(cors, {
  origin: "http://localhost:5500" ,
    methods: ["GET", "POST", "PUT", "DELETE"], 
  allowedHeaders: ["Content-Type", "Authorization"]
});

appRoutes(server);


server.listen({
    port:3333
});