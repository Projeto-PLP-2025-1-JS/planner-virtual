const Sequelize = require('sequelize')
const database = require('../database/database-sql.js')

const Meta = database.define('Meta',
    {
    id:{
        type: DataTypes.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    descricao:{
        type: DataTypes.TEXT,
        allowNull:false
    },
    categoria: {
        type: DataTypes.ENUM('Financeiro', 'Manutencao', 'Saude', 'Estudos'),
        allowNull: false
    },
    status:{
        type: DataTypes.ENUM('pendente', 'sucesso', 'parcial', 'falha'),
        allowNull: false
    },
    dataCriacao:{
        type: DataTypes.DATE,
        allowNull:false
    },
    dataFinal:{
        type: DataTypes.DATE,
        allowNull:false
    },
    datoConcluida:{
        type: DataTypes.DATE,
        allowNull:true
    }
    })