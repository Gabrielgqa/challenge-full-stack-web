import { Router } from 'express';
import { create, getAll, getById, remove, update } from '../controllers/studentController';

const router = Router();

/**
 * @swagger
 * /students:
 *   post:
 *     summary: Cria um novo estudante
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - cpf
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               cpf:
 *                 type: string
 *     responses:
 *       201:
 *         description: Estudante criado com sucesso
 *       400:
 *         description: Dados inválidos ou estudante já existe
 */
router.post('/', create);

/**
 * @swagger
 * /students:
 *   get:
 *     summary: Lista todos os estudantes
 *     tags: [Students]
 *     responses:
 *       200:
 *         description: Lista de estudantes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   ra:
 *                     type: string
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   cpf:
 *                     type: string
 */
router.get('/', getAll);

/**
 * @swagger
 * /students/{id}:
 *   get:
 *     summary: Busca um estudante pelo id
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do estudante
 *     responses:
 *       200:
 *         description: Estudante encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ra:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 cpf:
 *                   type: string
 *       404:
 *         description: Estudante não encontrado
 */
router.get('/:id', getById);

/**
 * @swagger
 * /students/{id}:
 *   delete:
 *     summary: Remove um estudante pelo id
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do estudante
 *     responses:
 *       200:
 *         description: Estudante removido
 *       404:
 *         description: Estudante não encontrado
 */
router.delete('/:id', remove);

/**
 * @swagger
 * /students/{id}:
 *   patch:
 *     summary: Atualiza dados do estudante (name e/ou email)
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do estudante
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Estudante atualizado
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Estudante não encontrado
 */
router.patch('/:id', update);

export default router;