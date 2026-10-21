/**
 * Contrato do resumo administrativo (`GET /api/dashboard/admin-summary`).
 *
 * Espelha `dashboardService.adminSummary` do backend.
 */

export interface AdminSummary {
  nEmpresas: number;
  nFuncionarios: number;
  nSensores: number;
  nEsp32: number;
  funcionarios: {
    total: number;
    gestores: number;
    tecnicos: number;
    mecanicos: number;
    eletricistas: number;
    ativos: number;
    inativos: number;
  };
}
