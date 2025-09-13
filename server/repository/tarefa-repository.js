import Tarefa from '../model/tarefaModel.js';

class TarefaRepository {
  async list() {
    return await Tarefa.findAll();
  }

  async create(tarefa) {
    return await Tarefa.create(tarefa);
  }

  async update(id, tarefa) {
    await Tarefa.update(tarefa, { where: { id } });
  }

  async delete(id) {
    await Tarefa.destroy({ where: { id } });
  }

  async findById(id) {
    return await Tarefa.findByPk(id);
  }
}

export default new TarefaRepository();