import { z } from 'zod';

export const createDeviceSchema = z.object({
  setorId: z.coerce.number().int().positive(),
  espId: z.string().min(2).max(50),
  descricao: z.string().max(100).optional().nullable(),
});

export const updateDeviceSchema = z.object({
  descricao: z.string().max(100).optional().nullable(),
});

export const deviceIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const listDevicesQuerySchema = z.object({
  setorId: z.coerce.number().int().positive(),
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().optional(),
});
