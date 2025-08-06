import { Request, Response } from 'express';
import { UserRepository } from '../../infrastructure/repositories/userRepository';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import jwt from 'jsonwebtoken';

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
    const userExists = await UserRepository.findByEmail(email);
    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await UserRepository.create({ name, email, password: hashedPassword });
    return res.status(201).json(user);
  } catch (err) {
    return res.status(500).json({ error: 'Registration failed' });
  }
}

export async function login(req: Request, res: Response) {
  const schema = z.object({
    email: z.string().toLowerCase().trim().pipe(z.string().regex(/^\S+@\S+\.\S+$/, 'Invalid email')),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  });

  const parseResult = schema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: 'Validation failed' });
  }
  const { email, password } = parseResult.data;

  try {
    const user = await UserRepository.findByEmail(email);

    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, name: user.name }, process.env.JWT_SECRET!, { expiresIn: '1d' });

    return res.json({ token });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Login failed' });
  }
}