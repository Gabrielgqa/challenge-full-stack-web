import { Router } from 'express';
import { create, getAll, remove } from '../controllers/studentController';

const router = Router();

router.post('/', create);
router.get('/', getAll);
router.delete('/:id', remove);

export default router;