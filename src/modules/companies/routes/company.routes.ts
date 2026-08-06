import { Router } from 'express';
import { authenticateUser, authorize } from '../../../middlewares/auth.middleware.js';
import { validate } from '../../../middlewares/validate.middleware.js';
import { companyController } from '../controllers/company.controller.js';
import {
  companyIdParamSchema,
  createCompanySchema,
  updateCompanySchema,
} from '../validators/company.validators.js';

export const companyRoutes = Router();

companyRoutes.use(authenticateUser);

companyRoutes.get('/', companyController.list);
companyRoutes.get('/:id', validate({ params: companyIdParamSchema }), companyController.getById);
companyRoutes.post(
  '/',
  authorize('super_admin'),
  validate({ body: createCompanySchema }),
  companyController.create,
);
companyRoutes.patch(
  '/:id',
  authorize('super_admin'),
  validate({ params: companyIdParamSchema, body: updateCompanySchema }),
  companyController.update,
);
companyRoutes.delete(
  '/:id',
  authorize('super_admin'),
  validate({ params: companyIdParamSchema }),
  companyController.remove,
);
