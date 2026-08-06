import { Router } from 'express';
import { authenticateUser, authorize } from '../../../middlewares/auth.middleware.js';
import { validate } from '../../../middlewares/validate.middleware.js';
import { assetController } from '../controllers/asset.controller.js';
import {
  assetIdParamSchema,
  createAssetSchema,
  listAssetsQuerySchema,
  updateAssetSchema,
} from '../validators/asset.validators.js';

export const assetRoutes = Router();

assetRoutes.use(authenticateUser);

assetRoutes.get('/', validate({ query: listAssetsQuerySchema }), assetController.list);
assetRoutes.get('/:id', validate({ params: assetIdParamSchema }), assetController.getById);
assetRoutes.post(
  '/',
  authorize('super_admin', 'admin_empresa'),
  validate({ body: createAssetSchema }),
  assetController.create,
);
assetRoutes.patch(
  '/:id',
  authorize('super_admin', 'admin_empresa'),
  validate({ params: assetIdParamSchema, body: updateAssetSchema }),
  assetController.update,
);
assetRoutes.delete(
  '/:id',
  authorize('super_admin', 'admin_empresa'),
  validate({ params: assetIdParamSchema }),
  assetController.remove,
);
