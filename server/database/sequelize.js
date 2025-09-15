import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
    'planner_virtual', //nome do banco
    'postgres', // usuario
    'postgres', //senha
    {
    dialect:'postgres', //qual banco, postgres,mysql etc
    host: 'localhost' //o host do banco
    }
)


export default sequelize;

