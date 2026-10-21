import { httpClient } from '../api/http-client';
import type { PaginatedResult } from '../../types/api';
import type { Asset, Device, Sector } from '../../types/catalog';

/**
 * Entidades de apoio usadas para montar os seletores em cascata
 * (empresa → setor → ativo / ESP32).
 *
 * Atenção: no back-end, `GET /api/assets` e `GET /api/devices` **exigem**
 * `setorId` na query (`listAssetsQuerySchema` / `listDevicesQuerySchema`).
 */
export const catalogService = {
  sectors(token: string, empresaId: number): Promise<PaginatedResult<Sector>> {
    return httpClient.getPaginated<Sector>('/sectors', {
      token,
      query: { empresaId, pageSize: 100 },
    });
  },

  assets(token: string, setorId: number): Promise<PaginatedResult<Asset>> {
    return httpClient.getPaginated<Asset>('/assets', {
      token,
      query: { setorId, pageSize: 100 },
    });
  },

  devices(token: string, setorId: number): Promise<PaginatedResult<Device>> {
    return httpClient.getPaginated<Device>('/devices', {
      token,
      query: { setorId, pageSize: 100 },
    });
  },
};
