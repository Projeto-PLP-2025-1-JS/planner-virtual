import { Sequelize } from 'sequelize'; // <-- ADICIONE ESTA LINHA
import { fastify } from "fastify";
import cors from '@fastify/cors';
import { appRoutes } from './routes.js';
import sequelize from './database/sequelize.js';

// Importe seus modelos para registrá-los
import './model/tarefaModel.js';
// import './model/metaModel.js';

const server = fastify({ logger: true });

server.register(cors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"], 
  allowedHeaders: ["Content-Type", "Authorization"]
});

appRoutes(server);

const start = async () => {
  try {
    await sequelize.authenticate();
    server.log.info('Conexão com o banco de dados estabelecida.');

  } catch (error) {
    if (error.original && error.original.code === '3D000') {
      server.log.warn(`Banco de dados "${sequelize.config.database}" não encontrado. Criando...`);
      
      // Agora a classe Sequelize está definida e esta linha vai funcionar
      const tempSequelize = new Sequelize('', sequelize.config.username, sequelize.config.password, {
        host: sequelize.config.host,
        dialect: 'postgres',
        logging: false,
      });

      try {
        await tempSequelize.query(`CREATE DATABASE "${sequelize.config.database}";`);
        server.log.info(`Banco de dados "${sequelize.config.database}" criado com sucesso.`);
      } catch (createError) {
        server.log.error('Erro ao criar o banco de dados:', createError);
        process.exit(1);
      } finally {
        await tempSequelize.close();
      }

      await sequelize.authenticate();
      server.log.info('Conexão com o novo banco de dados estabelecida.');

    } else {
      server.log.error('Não foi possível conectar ao banco de dados:', error);
      process.exit(1);
    }
  }

  try {
    await sequelize.sync();
    server.log.info('Modelos sincronizados.');
    await server.listen({ port: 3333 });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();