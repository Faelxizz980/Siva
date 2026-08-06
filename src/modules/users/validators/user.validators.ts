import { z } from 'zod';

export const createUserSchema = z.object({
  nome: z.string().min(2).max(100),
  email: z.string().email().max(100),
  senha: z.string().min(8).max(72),
  tipo: z.enum(['super_admin', 'admin_empresa', 'funcionario']),
  empresaId: z.coerce.number().int().positive().optional().nullable(),
});

export const updateUserSchema = z.object({
  nome: z.string().min(2).max(100).optional(),
  senha: z.string().min(8).max(72).optional(),
});

export const userIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const listUsersQuerySchema = z.object({
  empresaId: z.coerce.number().int().positive().optional(),
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().optional(),
});
