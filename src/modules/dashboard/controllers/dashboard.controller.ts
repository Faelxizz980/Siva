import type { Request, Response } from 'express';
import { asyncHandler } from '../../../utils/async-handler.js';
import { ok } from '../../../shared/http/api-response.js';
import { dashboardService } from '../services/dashboard.service.js';

export const dashboardController = {
  adminSummary: asyncHandler(async (req: Request, res: Response) => {
    ok(res, await dashboardService.adminSummary(req.user!));
  }),
};
