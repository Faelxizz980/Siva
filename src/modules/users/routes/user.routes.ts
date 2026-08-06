import { Router } from 'express';
import { authenticateUser, authorize } from '../../../middlewares/auth.middleware.js';
import { validate } from '../../../middlewares/validate.middleware.js';
import { userController } from '../controllers/user.controller.js';
import {
  createUserSchema,
  listUsersQuerySchema,
  updateUserSchema,
  userIdParamSchema,
} from '../validators/user.validators.js';

export const userRoutes = Router();

userRoutes.use(authenticateUser);

userRoutes.get(
  '/',
  authorize('super_admin', 'admin_empresa'),
  validate({ query: listUsersQuerySchema }),
  userController.list,
);
userRoutes.get(
  '/:id',
  authorize('super_admin', 'admin_empresa'),
  validate({ params: userIdParamSchema }),
  userController.getById,
);
userRoutes.post(
  '/',
  authorize('super_admin', 'admin_empresa'),
  validate({ body: createUserSchema }),
  userController.create,
);
userRoutes.patch(
  '/:id',
  authorize('super_admin', 'admin_empresa'),
  validate({ params: userIdParamSchema, body: updateUserSchema }),
  userController.update,
);
userRoutes.delete(
  '/:id',
  authorize('super_admin'),
  validate({ params: userIdParamSchema }),
  userController.remove,
);
