import { NotFoundError, ValidationError } from '../../../shared/errors/app-error.js';
import type { ListOptions } from '../../../interfaces/repository.interface.js';
import type { AuthenticatedUser } from '../../../types/express.js';
import { assetService } from '../../assets/services/asset.service.js';
import { deviceService } from '../../devices/services/device.service.js';
import { createSensorRepository } from '../repositories/sensor.repository.js';
import type { CreateSensorDTO, UpdateSensorDTO } from '../dtos/sensor.dtos.js';

const repository = createSensorRepository();

export const sensorService = {
  async list(user: AuthenticatedUser, filter: { esp32Id?: number; ativoId?: number }, options: ListOptions = {}) {
    if (filter.esp32Id) await deviceService.getAccessible(user, filter.esp32Id);
    if (filter.ativoId) await assetService.getAccessible(user, filter.ativoId);
    return repository.list({ ...options, filter: { ...options.filter, ...filter } });
  },

  async getAccessible(user: AuthenticatedUser, id: number) {
    const sensor = await repository.findById(id);
    if (!sensor) throw new NotFoundError('Sensor');
    await deviceService.getAccessible(user, sensor.esp32Id);
    return sensor;
  },

  async create(user: AuthenticatedUser, data: CreateSensorDTO) {
    const [asset, device] = await Promise.all([
      assetService.getAccessible(user, data.ativoId),
      deviceService.getAccessible(user, data.esp32Id),
    ]);
    if (asset.setorId !== device.setorId) {
      throw new ValidationError('O ativo e o ESP32 informados precisam pertencer ao mesmo setor.');
    }
    return repository.create(data);
  },

  async update(user: AuthenticatedUser, id: number, data: UpdateSensorDTO) {
    await this.getAccessible(user, id);
    const sensor = await repository.update(id, data);
    if (!sensor) throw new NotFoundError('Sensor');
    return sensor;
  },

  async remove(user: AuthenticatedUser, id: number) {
    await this.getAccessible(user, id);
    await repository.remove(id);
  },
};
