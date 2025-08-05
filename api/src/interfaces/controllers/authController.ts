import { Request, Response } from 'express';
import knex from '../../infrastructure/database/connection';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

export async function register(req: Request, res: Response) {
  const schema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().toLowerCase().trim().pipe(z.string().regex(/^\S+@\S+\.\S+$/, 'Invalid email')),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  });

  const parseResult = schema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({error: 'Validation failed'});
  }
  const { name, email, password } = parseResult.data;

  try {
    const userExists = await knex('users').where({ email }).first();
    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [user] = await knex('users')
      .insert({
        name,
        email,
        password: hashedPassword,
      })
      .returning(['id', 'name', 'email']);

    return res.status(201).json(user);
  } catch (err) {
    return res.status(500).json({ error: 'Registration failed' });
  }
}