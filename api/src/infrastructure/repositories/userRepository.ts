import knex from '../database/connection';

export const UserRepository = {
  async findByEmail(email: string) {
    return knex('users').where({ email }).first();
  },
  
  async create({ name, email, password }: { name: string; email: string; password: string }) {
    const [user] = await knex('users')
      .insert({ name, email, password })
      .returning(['id', 'name', 'email']);
    return user;
  },
};
