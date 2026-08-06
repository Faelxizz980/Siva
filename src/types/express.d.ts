import 'express';
import type { Logger } from 'pino';

export interface AuthenticatedUser {
  id: number;
  email: string;
  tipo: 'super_admin' | 'admin_empresa' | 'funcionario';
  empresaId: number | null;
}

export interface AuthenticatedDevice {
  id: number;
  espId: string;
  setorId: number;
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: AuthenticatedUser;
    device?: AuthenticatedDevice;
    log: Logger;
  }
}
