import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('planner_virtual','postgres','postgres', {
    dialect:'postgres',
    host: 'localhost'
})


export default sequelize;

