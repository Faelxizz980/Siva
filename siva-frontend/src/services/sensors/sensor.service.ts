import { httpClient } from '../api/http-client';
import type { PaginatedResult, QueryParams } from '../../types/api';
import type { CreateSensorPayload, Sensor, UpdateSensorPayload } from '../../types/sensor';

export interface ListSensorsParams {
  page?: number;
  pageSize?: number;
  esp32Id?: number | null;
  ativoId?: number | null;
}

/**
 * Operações de sensor.
 *
 * Contrato confirmado no back-end (`src/modules/sensors`):
 *  - `GET    /api/sensors`      → paginado, aceita `esp32Id` e `ativoId`
 *  - `GET    /api/sensors/:id`  → sensor
 *  - `POST   /api/sensors`      → cria (ADMIN, GESTOR)
 *  - `PATCH  /api/sensors/:id`  → edita (ADMIN, GESTOR) — sem `ativoId`/`esp32Id`/`sensorId`
 *  - `DELETE /api/sensors/:id`  → remove (ADMIN, GESTOR)
 */
export const sensorService = {
  list(token: string, params: ListSensorsParams = {}): Promise<PaginatedResult<Sensor>> {
    const query: QueryParams = {
      page: params.page,
      pageSize: params.pageSize,
      esp32Id: params.esp32Id ?? undefined,
      ativoId: params.ativoId ?? undefined,
    };
    return httpClient.getPaginated<Sensor>('/sensors', { token, query });
  },

  getById(token: string, id: number): Promise<Sensor> {
    return httpClient.get<Sensor>(`/sensors/${id}`, { token });
  },

  create(token: string, payload: CreateSensorPayload): Promise<Sensor> {
    return httpClient.post<Sensor>('/sensors', payload, { token });
  },

  update(token: string, id: number, payload: UpdateSensorPayload): Promise<Sensor> {
    return httpClient.patch<Sensor>(`/sensors/${id}`, payload, { token });
  },

  remove(token: string, id: number): Promise<void> {
    return httpClient.delete(`/sensors/${id}`, { token });
  },
};
