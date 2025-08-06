import request from 'supertest';
import app from '../src/app';
import knex from '../src/infrastructure/database/connection';

describe('studentController', () => {

  let token: string;

  beforeAll(async () => {
    await knex.migrate.latest();
    await knex('students').del();
    await knex('users').del();

    await request(app)
      .post('/auth/register')
      .send({
        name: 'Gabriel',
        email: 'gabriel@example.com',
        password: '123456',
      });
    const loginRes = await request(app)
      .post('/auth/login')
      .send({
        email: 'gabriel@example.com',
        password: '123456',
      });
    token = loginRes.body.token;
  });

  afterAll(async () => {
    await knex('students').del();
    await knex('users').del();
    await knex.destroy();
  });

  describe('POST /students', () => {
    it('should create a new student', async () => {
      const res = await request(app)
        .post('/students')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Gabriel',
          email: 'gabriel@example.com',
          cpf: '12345678901',
        });
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('name', 'Gabriel');
      expect(res.body).toHaveProperty('cpf', '12345678901');
    });

    it('should not create student with invalid email', async () => {
      const res = await request(app)
        .post('/students')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Gabriel',
          email: 'invalid-email',
          cpf: '12345678902',
        });
      expect(res.status).toBe(400);
    });

    it('should not create student with duplicate cpf', async () => {
      await request(app)
        .post('/students')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Carlos',
          email: 'carlos@example.com',
          cpf: '12345678903',
        });
      const res = await request(app)
        .post('/students')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Carlos 2',
          email: 'carlos2@example.com',
          cpf: '12345678903',
        });
      expect(res.status).toBe(400);
    });
  });

  describe('GET /students', () => {
    it('should list all students', async () => {
      await request(app)
        .post('/students')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Gabriel G',
          email: 'gabrielg@example.com',
          cpf: '12345678904',
        });
      const res = await request(app)
        .get('/students')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });
  });

  describe('PATCH /students/:id', () => {
    it('should update student name', async () => {
      const createRes = await request(app)
        .post('/students')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Gabriel Q',
          email: 'gabrielq@example.com',
          cpf: '12345678905',
        });
      const id = createRes.body.id;
      const res = await request(app)
        .patch(`/students/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Pedro Atualizado' });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name', 'Pedro Atualizado');
    });

    it('should not update with invalid email', async () => {
      const createRes = await request(app)
        .post('/students')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Lucas',
          email: 'lucas@example.com',
          cpf: '12345678906',
        });
      const id = createRes.body.id;
      const res = await request(app)
        .patch(`/students/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ email: 'invalid-email' });
      expect(res.status).toBe(400);
    });
  });

  describe('DELETE /students/:id', () => {
    it('should delete a student', async () => {
      const createRes = await request(app)
        .post('/students')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Paula',
          email: 'paula@example.com',
          cpf: '12345678907',
        });
      const id = createRes.body.id;
      const res = await request(app)
        .delete(`/students/${id}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message', 'Student deleted');
    });

    it('should return 404 for non-existent student', async () => {
      const res = await request(app)
        .delete('/students/999999')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(404);
    });
  });
});
