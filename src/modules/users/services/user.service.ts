import bcrypt from 'bcryptjs';
import { ForbiddenError, NotFoundError, ValidationError } from '../../../shared/errors/app-error.js';
import { assertSameCompany, isSuperAdmin } from '../../../shared/auth/scope.js';
import type { ListOptions } from '../../../interfaces/repository.interface.js';
import type { AuthenticatedUser } from '../../../types/express.js';
import { createUserRepository } from '../repositories/user.repository.js';
import { toPublicUser } from '../entities/user.entity.js';
import type { CreateUserDTO, UpdateUserDTO } from '../dtos/user.dtos.js';

const repository = createUserRepository();
const SALT_ROUNDS = 10;

export const userService = {
  async list(actor: AuthenticatedUser, options: ListOptions = {}) {
    const empresaId = isSuperAdmin(actor) ? options.filter?.empresaId : (actor.empresaId ?? -1);
    const { items, total } = await repository.list({ ...options, filter: { ...options.filter, empresaId } });
    return { items: items.map(toPublicUser), total };
  },

  async getAccessible(actor: AuthenticatedUser, id: number) {
    const user = await repository.findById(id);
    if (!user) throw new NotFoundError('Usuário');
    assertSameCompany(actor, user.empresaId);
    return user;
  },

  async create(actor: AuthenticatedUser, data: CreateUserDTO) {
    if (data.tipo === 'super_admin' && !isSuperAdmin(actor)) {
      throw new ForbiddenError('Somente super_admin pode criar outro super_admin.');
    }
    if (data.tipo !== 'super_admin' && !data.empresaId) {
      throw new ValidationError('empresaId é obrigatório para admin_empresa e funcionario.');
    }
    if (data.empresaId) assertSameCompany(actor, data.empresaId);

    const senhaHash = await bcrypt.hash(data.senha, SALT_ROUNDS);
    const user = await repository.create({ ...data, senha: senhaHash });
    return toPublicUser(user);
  },

  async update(actor: AuthenticatedUser, id: number, data: UpdateUserDTO) {
    await this.getAccessible(actor, id);
    const senha = data.senha ? await bcrypt.hash(data.senha, SALT_ROUNDS) : undefined;
    const user = await repository.update(id, { ...data, senha });
    if (!user) throw new NotFoundError('Usuário');
    return toPublicUser(user);
  },

  async remove(actor: AuthenticatedUser, id: number) {
    await this.getAccessible(actor, id);
    await repository.remove(id);
  },
};
