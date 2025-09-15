//imports
//ORM -> Sequeliza
//Fastify -> framework web de node
import { Sequelize } from 'sequelize'; 
import { fastify } from "fastify";
//responsavel pelas requisicoes
import cors from '@fastify/cors';
import { appRoutes } from './routes.js';
//configuração do sequelize para o bd
import sequelize from './database/sequelize.js';

// Importe seus modelos para registrá-los
import './model/tarefaModel.js';
import './model/metaModel.js';
import './model/lembreteModel.js';

// ajuda nos erros e requisicoes, pelos logs
const server = fastify({ logger: true });

// libera o 
server.register(cors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"], 
  allowedHeaders: ["Content-Type", "Authorization"]
});

appRoutes(server);

//criando um metodo para iniciar o sistema
const start = async () => {
  try {
    // tenta se conectar ao banco
    await sequelize.authenticate();
    server.log.info('Conexão com o banco de dados estabelecida.');

  } catch (error) {
    if (error.original && error.original.code === '3D000') {
      // se der erro 3D000 tenta criar o banco de dados
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
        //se der erro ao criar o banco .exit
        server.log.error('Erro ao criar o banco de dados:', createError);
        process.exit(1);
      } finally {
        await tempSequelize.close();
      }

      // se conseguir criar, estabelece conexão
      await sequelize.authenticate();
      server.log.info('Conexão com o novo banco de dados estabelecida.');

    } else {//se n for o erro 3D000 então:
      server.log.error('Não foi possível conectar ao banco de dados:', error);
      process.exit(1);
    }
  }

  //se der tudo certo, garante que as tabelas do banco de dados vai ter os model
  try {
    await sequelize.sync();
    server.log.info('Modelos sincronizados.');

//sobe o servidor para a porta:
    await server.listen({ port: 3333 });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};


//iniciar o sistema
start();