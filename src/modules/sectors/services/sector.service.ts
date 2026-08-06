import { NotFoundError } from '../../../shared/errors/app-error.js';
import { assertSameCompany, isSuperAdmin } from '../../../shared/auth/scope.js';
import type { ListOptions } from '../../../interfaces/repository.interface.js';
import type { AuthenticatedUser } from '../../../types/express.js';
import { createSectorRepository } from '../repositories/sector.repository.js';
import type { CreateSectorDTO, UpdateSectorDTO } from '../dtos/sector.dtos.js';

const repository = createSectorRepository();

export const sectorService = {
  list(user: AuthenticatedUser, options: ListOptions = {}) {
    const empresaId = isSuperAdmin(user) ? options.filter?.empresaId : (user.empresaId ?? -1);
    return repository.list({ ...options, filter: { ...options.filter, empresaId } });
  },

  /** Busca o setor garantindo que ele pertence à empresa do usuário autenticado. */
  async getAccessible(user: AuthenticatedUser, id: number) {
    const sector = await repository.findById(id);
    if (!sector) throw new NotFoundError('Setor');
    assertSameCompany(user, sector.empresaId);
    return sector;
  },

  async create(user: AuthenticatedUser, data: CreateSectorDTO) {
    assertSameCompany(user, data.empresaId);
    return repository.create(data);
  },

  async update(user: AuthenticatedUser, id: number, data: UpdateSectorDTO) {
    await this.getAccessible(user, id);
    const sector = await repository.update(id, data);
    if (!sector) throw new NotFoundError('Setor');
    return sector;
  },

  async remove(user: AuthenticatedUser, id: number) {
    await this.getAccessible(user, id);
    await repository.remove(id);
  },
};
