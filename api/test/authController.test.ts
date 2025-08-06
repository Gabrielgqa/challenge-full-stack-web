import request from 'supertest';
import app from '../src/app';
import knex from '../src/infrastructure/database/connection';

describe('authController', () => {
    beforeAll(async () => {
    await knex.migrate.latest();
  });

  afterAll(async () => {
    await knex('users').del();
    await knex.destroy();
  });

  describe('POST /auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({
          name: 'Gabriel',
          email: 'gabriel@example.com',
          password: '123456',
        });
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('name', 'Gabriel');
      expect(res.body).toHaveProperty('email', 'gabriel@example.com');
    });

    it('should not register with invalid email', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({
          name: 'Gabriel',
          email: 'invalid-email',
          password: '123456',
        });
      expect(res.status).toBe(400);
    });
  });

  describe('POST /auth/login', () => {
    it('should login with correct credentials', async () => {
      await request(app)
        .post('/auth/register')
        .send({
          name: 'Gabriel',
          email: 'gabriel@example.com',
          password: '123456',
        });
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: 'gabriel@example.com',
          password: '123456',
        });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should not login with wrong password', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: 'gabriel@example.com',
          password: '3212145',
        });
      expect(res.status).toBe(400);
    });
  });
})
