import { DataTypes } from 'sequelize';
import database from '../database/sequelize.js';

const Tarefa = database.define('Tarefa', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  descricao: {
    type: DataTypes.STRING,
    allowNull: false
  },
  categoria: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false
  },
  dataCriacao: { // Este campo é obrigatório
    type: DataTypes.STRING,
    allowNull: false
  },
  dataFinal: { // Este campo é obrigatório
    type: DataTypes.STRING,
    allowNull: false
  },
  dataConcluida: { // Corrigido de "datoConcluida"
    type: DataTypes.STRING,
    allowNull: true
  },
}, {
  tableName: 'tarefas',
  timestamps: false, // Desabilitamos os timestamps automáticos para ter controle total
});

export default Tarefa;