import type { Knex } from "knex";


export async function up(knex: Knex) {
  return knex.schema.createTable('students', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('email').notNullable().unique();
    table.string('cpf').notNullable();
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable('students');
}