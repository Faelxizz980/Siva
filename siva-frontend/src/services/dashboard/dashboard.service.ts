import { httpClient } from '../api/http-client';
import type { AdminSummary } from '../../types/dashboard';

/**
 * Resumo administrativo (`GET /api/dashboard/admin-summary`).
 *
 * Somente ADMIN tem acesso — o back-end responde 403 para outros perfis.
 */
export const dashboardService = {
  adminSummary(token: string): Promise<AdminSummary> {
    return httpClient.get<AdminSummary>('/dashboard/admin-summary', { token });
  },
};
