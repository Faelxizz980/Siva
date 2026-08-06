import { NotFoundError } from '../../../shared/errors/app-error.js';
import type { ListOptions } from '../../../interfaces/repository.interface.js';
import type { AuthenticatedUser } from '../../../types/express.js';
import { sensorService } from '../../sensors/services/sensor.service.js';
import { createMaintenanceRepository } from '../repositories/maintenance.repository.js';
import type { CreateMaintenanceDTO, UpdateMaintenanceDTO } from '../dtos/maintenance.dtos.js';

const repository = createMaintenanceRepository();

export const maintenanceService = {
  async list(user: AuthenticatedUser, sensorId: number, options: ListOptions = {}) {
    await sensorService.getAccessible(user, sensorId);
    return repository.list({ ...options, filter: { ...options.filter, sensorId } });
  },

  async getAccessible(user: AuthenticatedUser, id: number) {
    const maintenance = await repository.findById(id);
    if (!maintenance) throw new NotFoundError('Chamado de manutenção');
    await sensorService.getAccessible(user, maintenance.sensorId);
    return maintenance;
  },

  async create(user: AuthenticatedUser, data: CreateMaintenanceDTO) {
    await sensorService.getAccessible(user, data.sensorId);
    return repository.create(data);
  },

  async update(user: AuthenticatedUser, id: number, data: UpdateMaintenanceDTO) {
    await this.getAccessible(user, id);
    const maintenance = await repository.update(id, data);
    if (!maintenance) throw new NotFoundError('Chamado de manutenção');
    return maintenance;
  },

  async remove(user: AuthenticatedUser, id: number) {
    await this.getAccessible(user, id);
    await repository.remove(id);
  },
};
