import type { Knex } from "knex";


export async function up(knex: Knex) {
  return knex.schema.createTable('students', async (table) => {
    table.increments('id').primary();
    table.integer('ra').unique().notNullable();
    table.string('name').notNullable();
    table.string('email').notNullable().unique();
    table.string('cpf').notNullable();
  }).then(async () => {
    await knex.raw(`CREATE SEQUENCE IF NOT EXISTS students_ra_seq START 2025001 OWNED BY students.ra`);
    await knex.raw(`ALTER TABLE students ALTER COLUMN ra SET DEFAULT nextval('students_ra_seq')`);
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable('students');
}