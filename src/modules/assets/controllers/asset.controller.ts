import type { Request, Response } from 'express';
import { asyncHandler } from '../../../utils/async-handler.js';
import { created, noContent, ok, paginated } from '../../../shared/http/api-response.js';
import { parsePagination } from '../../../shared/http/pagination.js';
import { assetService } from '../services/asset.service.js';

export const assetController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const { page, pageSize } = parsePagination(req);
    const { items, total } = await assetService.list(req.user!, Number(req.query.setorId), {
      page,
      pageSize,
    });
    paginated(res, items, { total, page, pageSize });
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const asset = await assetService.getAccessible(req.user!, Number(req.params.id));
    ok(res, asset);
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const asset = await assetService.create(req.user!, req.body);
    created(res, asset);
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const asset = await assetService.update(req.user!, Number(req.params.id), req.body);
    ok(res, asset);
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    await assetService.remove(req.user!, Number(req.params.id));
    noContent(res);
  }),
};
