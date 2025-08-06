import { Request, Response } from 'express';
import { StudentRepository } from '../../infrastructure/repositories/studentRepository';
import { z } from 'zod';

export async function create(req: Request, res: Response) {
  const schema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().toLowerCase().trim().pipe(z.string().regex(/^\S+@\S+\.\S+$/, 'Invalid email')),
    cpf: z.string().regex(/^\d{11}$/, 'CPF must have exactly 11 digits'),
  });

  const parseResult = schema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: 'Validation failed' });
  }
  const { name, email, cpf } = parseResult.data;

  try {
    const studentExists = await StudentRepository.findByCpf(cpf);
    if (studentExists) {
      return res.status(400).json({ error: 'Student already exists' });
    }

    const student = await StudentRepository.create({ name, email, cpf });
    return res.status(201).json(student);
  } catch (err) {
    return res.status(500).json({ error: 'Registration failed' });
  }
}

export async function getAll(req: Request, res: Response) {
  try {
    const students = await StudentRepository.getAll();
    return res.json(students);
  } catch {
    return res.status(500).json({ error: 'Failed to fetch students' });
  }
}

export async function remove(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const student = await StudentRepository.findById(id);
    if (!student) return res.status(404).json({ error: 'Student not found' });

    await StudentRepository.remove(id);

    return res.json({ message: 'Student deleted' });
  } catch {
    return res.status(500).json({ error: 'Failed to delete student' });
  }
}
export async function update(req: Request, res: Response) {
  const bodySchema = z.object({
    name: z.string().min(1, 'Name is required').optional(),
    email: z.string().toLowerCase().trim().regex(/^\S+@\S+\.\S+$/, 'Invalid email').optional(),
  }).refine(data => data.name || data.email, {
    message: 'At least one field (name or email) must be provided',
  });

  const bodyResult = bodySchema.safeParse(req.body);
  if (!bodyResult.success) {
    return res.status(400).json({ error: 'Validation failed' });
  }
  const updateData = bodyResult.data;

  const { id } = req.params;

  try {
    const student = await StudentRepository.findById(id);
    if (!student) return res.status(404).json({ error: 'Student not found' });

    const updatedStudent = await StudentRepository.update(id, updateData);
    return res.json(updatedStudent);
  } catch {
    return res.status(500).json({ error: 'Failed to update student' });
  }
}