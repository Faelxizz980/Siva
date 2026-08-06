import { NotFoundError } from '../../../shared/errors/app-error.js';
import { assertSameCompany, isSuperAdmin } from '../../../shared/auth/scope.js';
import type { ListOptions } from '../../../interfaces/repository.interface.js';
import type { AuthenticatedUser } from '../../../types/express.js';
import { createCompanyRepository } from '../repositories/company.repository.js';
import type { CreateCompanyDTO, UpdateCompanyDTO } from '../dtos/company.dtos.js';

const repository = createCompanyRepository();

export const companyService = {
  list(user: AuthenticatedUser, options: ListOptions = {}) {
    if (isSuperAdmin(user)) return repository.list(options);
    return repository.list({ ...options, filter: { ...options.filter, id: user.empresaId ?? -1 } });
  },

  async getById(user: AuthenticatedUser, id: number) {
    const company = await repository.findById(id);
    if (!company) throw new NotFoundError('Empresa');
    assertSameCompany(user, company.id);
    return company;
  },

  create(data: CreateCompanyDTO) {
    return repository.create(data);
  },

  async update(id: number, data: UpdateCompanyDTO) {
    const company = await repository.update(id, data);
    if (!company) throw new NotFoundError('Empresa');
    return company;
  },

  async remove(id: number) {
    const removed = await repository.remove(id);
    if (!removed) throw new NotFoundError('Empresa');
  },
};
