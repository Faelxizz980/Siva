import type { Request, Response } from 'express';
import { asyncHandler } from '../../../utils/async-handler.js';
import { created, noContent, ok, paginated } from '../../../shared/http/api-response.js';
import { parsePagination } from '../../../shared/http/pagination.js';
import { toPublicUser } from '../entities/user.entity.js';
import { userService } from '../services/user.service.js';

export const userController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const { page, pageSize } = parsePagination(req);
    const empresaId = req.query.empresaId ? Number(req.query.empresaId) : undefined;
    const { items, total } = await userService.list(req.user!, { page, pageSize, filter: { empresaId } });
    paginated(res, items, { total, page, pageSize });
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.getAccessible(req.user!, Number(req.params.id));
    ok(res, toPublicUser(user));
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.create(req.user!, req.body);
    created(res, user);
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.update(req.user!, Number(req.params.id), req.body);
    ok(res, user);
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    await userService.remove(req.user!, Number(req.params.id));
    noContent(res);
  }),
};
