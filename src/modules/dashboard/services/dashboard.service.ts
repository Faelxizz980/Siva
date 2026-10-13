import { ForbiddenError } from '../../../shared/errors/app-error.js';
import { isAdmin } from '../../../shared/auth/scope.js';
import type { AuthenticatedUser } from '../../../types/express.js';
import { createCompanyRepository } from '../../companies/repositories/company.repository.js';
import { createUserRepository } from '../../users/repositories/user.repository.js';
import { createDeviceRepository } from '../../devices/repositories/device.repository.js';
import { createSensorRepository } from '../../sensors/repositories/sensor.repository.js';

export const dashboardService = {
  async adminSummary(actor: AuthenticatedUser) {
    if (!isAdmin(actor)) {
      throw new ForbiddenError('Somente ADMIN pode acessar o dashboard administrativo.');
    }

    const [companies, users, devices, sensors] = await Promise.all([
      createCompanyRepository().list({ page: 1, pageSize: 1 }),
      createUserRepository().list({ page: 1, pageSize: 1 }),
      createDeviceRepository().list({ page: 1, pageSize: 1 }),
      createSensorRepository().list({ page: 1, pageSize: 1 }),
    ]);

    const [{ total: gestores }, { total: tecnicos }, { total: ativos }, { total: inativos }] =
      await Promise.all([
        createUserRepository().list({ page: 1, pageSize: 1, filter: { tipo: 'GESTOR' } }),
        createUserRepository().list({ page: 1, pageSize: 1, filter: { tipo: 'TECNICO' } }),
        createUserRepository().list({ page: 1, pageSize: 1, filter: { status: 'ATIVO' } }),
        createUserRepository().list({ page: 1, pageSize: 1, filter: { status: 'INATIVO' } }),
      ]);

    const [{ total: mecanicos }, { total: eletricistas }] = await Promise.all([
      createUserRepository().list({ page: 1, pageSize: 1, filter: { especialidade: 'MECANICO' } }),
      createUserRepository().list({
        page: 1,
        pageSize: 1,
        filter: { especialidade: 'ELETRICISTA' },
      }),
    ]);

    return {
      nEmpresas: companies.total,
      nFuncionarios: users.total,
      nSensores: sensors.total,
      nEsp32: devices.total,
      funcionarios: {
        total: users.total,
        gestores,
        tecnicos,
        mecanicos,
        eletricistas,
        ativos,
        inativos,
      },
    };
  },
};
