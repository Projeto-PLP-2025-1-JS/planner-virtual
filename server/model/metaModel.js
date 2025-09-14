import { DataTypes } from 'sequelize';
import database from '../database/sequelize.js';

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
    type: DataTypes.ENUM('financeiro', 'manutencao', 'saude', 'estudos'),
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
dataConcluida:{
    type: DataTypes.DATE,
    allowNull:true
}
}, {
  tableName: 'metas',
  timestamps: false,
});

export default Meta;