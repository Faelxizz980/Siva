import { Router } from 'express';
import { authenticateUser, authorize } from '../../../middlewares/auth.middleware.js';
import { dashboardController } from '../controllers/dashboard.controller.js';

export const dashboardRoutes = Router();

dashboardRoutes.use(authenticateUser);

dashboardRoutes.get('/admin-summary', authorize('ADMIN'), dashboardController.adminSummary);
