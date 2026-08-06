import { z } from 'zod';

export const createSensorSchema = z.object({
  ativoId: z.coerce.number().int().positive(),
  esp32Id: z.coerce.number().int().positive(),
  sensorId: z.string().min(1).max(50),
  tag: z.string().max(50).optional().nullable(),
  descricao: z.string().max(100).optional().nullable(),
  ativoStatus: z.boolean().default(true),
});

export const updateSensorSchema = createSensorSchema
  .partial()
  .omit({ ativoId: true, esp32Id: true, sensorId: true });

export const sensorIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const listSensorsQuerySchema = z.object({
  esp32Id: z.coerce.number().int().positive().optional(),
  ativoId: z.coerce.number().int().positive().optional(),
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().optional(),
});
