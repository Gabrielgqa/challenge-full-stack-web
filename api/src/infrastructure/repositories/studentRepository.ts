import knex from '../../infrastructure/database/connection';

export const StudentRepository = {
  async findByCpf(cpf: string) {
    return knex('students').where({ cpf }).first();
  },

  async create({ name, email, cpf }: { name: string; email: string; cpf: string }) {
    const [student] = await knex('students')
      .insert({ name, email, cpf })
      .returning(['id', 'ra', 'name', 'cpf']);
    return student;
  },

  async getAll() {
    return knex('students').select('id', 'ra', 'name', 'email', 'cpf');
  },

  async findById(id: string) {
    return knex('students').where({ id }).first();
  },
  
  async update(id: string, updateData: Partial<{ name: string; email: string }>) {
    await knex('students').where({ id }).update(updateData);
    return knex('students').where({ id }).first();
  },
  
  async remove(id: string) {
    return knex('students').where({ id }).del();
  },
};
