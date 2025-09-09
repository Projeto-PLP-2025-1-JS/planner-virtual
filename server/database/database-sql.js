const Sequelize = require('sequelize')
const sequelize = new Sequelize('planner virtual','postgres','postgres', {
    dialect:'postgres',
    host: 'localhost'
})


module.exports = sequelize

