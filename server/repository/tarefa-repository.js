import Tarefa from '../model/tarefaModel.js';

class TarefaRepository {
  async list() {
    return await Tarefa.findAll();
  }

  async create(tarefa) {
    return await Tarefa.create(tarefa);
  }

  async update(id, tarefa) {
    const [affectedRows] = await Tarefa.update(tarefa, { where: { id } });
    return affectedRows > 0;
  }

  async delete(id) {
    const deletedRows = await Tarefa.destroy({ where: { id } });
    return deletedRows > 0;
  }

  async findById(id) {
    return await Tarefa.findByPk(id);
  }
}

export default new TarefaRepository();