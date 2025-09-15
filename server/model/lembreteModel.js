import { DataTypes } from 'sequelize';
import database from '../database/sequelize.js';

const Lembrete = database.define('Lembrete',{
    id:{
        type: DataTypes.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    descricao:{
        type: DataTypes.TEXT,
        allowNull:false
    }
    }, {
  tableName: 'lembretes',
  timestamps: false,
});

export default Lembrete;