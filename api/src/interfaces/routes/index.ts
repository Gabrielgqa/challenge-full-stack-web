import { Router } from 'express';
import authRoutes from './authRoutes';
import studentRoutes from './studentRoutes';
import authMiddleware from '../middlewares/auth';

const routes = Router();

routes.use('/auth', authRoutes);
routes.use(authMiddleware);
routes.use('/students', studentRoutes);

export default routes;
