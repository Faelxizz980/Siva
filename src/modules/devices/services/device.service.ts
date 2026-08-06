import { NotFoundError } from '../../../shared/errors/app-error.js';
import type { ListOptions } from '../../../interfaces/repository.interface.js';
import type { AuthenticatedUser } from '../../../types/express.js';
import { sectorService } from '../../sectors/services/sector.service.js';
import { createDeviceRepository } from '../repositories/device.repository.js';
import type { CreateDeviceDTO, UpdateDeviceDTO } from '../dtos/device.dtos.js';

const repository = createDeviceRepository();

export const deviceService = {
  async list(user: AuthenticatedUser, setorId: number, options: ListOptions = {}) {
    await sectorService.getAccessible(user, setorId);
    return repository.list({ ...options, filter: { ...options.filter, setorId } });
  },

  async getAccessible(user: AuthenticatedUser, id: number) {
    const device = await repository.findById(id);
    if (!device) throw new NotFoundError('Dispositivo ESP32');
    await sectorService.getAccessible(user, device.setorId);
    return device;
  },

  async create(user: AuthenticatedUser, data: CreateDeviceDTO) {
    await sectorService.getAccessible(user, data.setorId);
    return repository.create(data);
  },

  async update(user: AuthenticatedUser, id: number, data: UpdateDeviceDTO) {
    await this.getAccessible(user, id);
    const device = await repository.update(id, data);
    if (!device) throw new NotFoundError('Dispositivo ESP32');
    return device;
  },

  async remove(user: AuthenticatedUser, id: number) {
    await this.getAccessible(user, id);
    await repository.remove(id);
  },
};
