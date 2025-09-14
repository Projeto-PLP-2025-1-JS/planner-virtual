import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('planner_virtual','postgres','99754339', {
    dialect:'postgres',
    host: 'localhost'
})


export default sequelize;

