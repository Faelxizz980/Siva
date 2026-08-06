import { NotFoundError } from '../../../shared/errors/app-error.js';
import type { ListOptions } from '../../../interfaces/repository.interface.js';
import type { AuthenticatedUser } from '../../../types/express.js';
import { sectorService } from '../../sectors/services/sector.service.js';
import { createAssetRepository } from '../repositories/asset.repository.js';
import type { CreateAssetDTO, UpdateAssetDTO } from '../dtos/asset.dtos.js';

const repository = createAssetRepository();

export const assetService = {
  async list(user: AuthenticatedUser, setorId: number, options: ListOptions = {}) {
    await sectorService.getAccessible(user, setorId);
    return repository.list({ ...options, filter: { ...options.filter, setorId } });
  },

  async getAccessible(user: AuthenticatedUser, id: number) {
    const asset = await repository.findById(id);
    if (!asset) throw new NotFoundError('Ativo');
    await sectorService.getAccessible(user, asset.setorId);
    return asset;
  },

  async create(user: AuthenticatedUser, data: CreateAssetDTO) {
    await sectorService.getAccessible(user, data.setorId);
    return repository.create(data);
  },

  async update(user: AuthenticatedUser, id: number, data: UpdateAssetDTO) {
    await this.getAccessible(user, id);
    const asset = await repository.update(id, data);
    if (!asset) throw new NotFoundError('Ativo');
    return asset;
  },

  async remove(user: AuthenticatedUser, id: number) {
    await this.getAccessible(user, id);
    await repository.remove(id);
  },
};
