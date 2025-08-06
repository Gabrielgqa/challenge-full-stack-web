import { Router } from 'express';
import authRoutes from './authRoutes';
import studentRoutes from './studentRoutes';

const routes = Router();

routes.use('/auth', authRoutes);
routes.use('/students', studentRoutes);

export default routes;
