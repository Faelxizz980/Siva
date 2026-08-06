export type UserType = 'super_admin' | 'admin_empresa' | 'funcionario';

export interface User {
  id: number;
  nome: string;
  email: string;
  senha: string;
  tipo: UserType;
  empresaId: number | null;
  criadoEm: Date;
}

export type PublicUser = Omit<User, 'senha'>;

export function toPublicUser(user: User): PublicUser {
  const { senha: _senha, ...publicUser } = user;
  return publicUser;
}
