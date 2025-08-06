import { Request, Response } from 'express';
import knex from '../../infrastructure/database/connection';
import { z } from 'zod';

export async function create(req: Request, res: Response) {
    const schema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().toLowerCase().trim().pipe(z.string().regex(/^\S+@\S+\.\S+$/, 'Invalid email')),
    cpf: z.string().regex(/^\d{11}$/, 'CPF must have exactly 11 digits'),
  });

  const parseResult = schema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({error: 'Validation failed'});
  }
  const { name, email, cpf } = parseResult.data;

  try {
    const userExists = await knex('students').where({ cpf }).first();
    if (userExists) {
      return res.status(400).json({ error: 'Student already exists' });
    }

    const [user] = await knex('students')
      .insert({
        name,
        email,
        cpf,
      })
      .returning(['id', 'ra', 'name', 'cpf']);

    return res.status(201).json(user);
  } catch (err) {
    return res.status(500).json({ error: 'Registration failed' });
  }
}