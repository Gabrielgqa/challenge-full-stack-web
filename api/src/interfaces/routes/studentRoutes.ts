import { Router } from 'express';
import { create, getAll, remove, update } from '../controllers/studentController';

const router = Router();

router.post('/', create);
router.get('/', getAll);
router.delete('/:id', remove);
router.patch('/:id', update);

export default router;