import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { ForbiddenError, UnauthorizedError } from '../shared/errors/app-error.js';
import type { AuthenticatedUser, AuthenticatedDevice } from '../types/express.js';
import { findDeviceByToken } from '../modules/devices/repositories/device.repository.js';

/** Autentica usuários do dashboard via `Authorization: Bearer <jwt>`. */
export function authenticateUser(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : undefined;

  if (!token) {
    throw new UnauthorizedError('Token de autenticação ausente.');
  }

  try {
    req.user = jwt.verify(token, env.JWT_SECRET) as AuthenticatedUser;
    next();
  } catch {
    throw new UnauthorizedError('Token de autenticação inválido ou expirado.');
  }
}

export function authorize(...allowed: AuthenticatedUser['tipo'][]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) throw new UnauthorizedError();
    if (!allowed.includes(req.user.tipo)) throw new ForbiddenError();
    next();
  };
}

/** Autentica dispositivos ESP32 via `X-Token`, conforme payload descrito no README. */
export async function authenticateDevice(req: Request, _res: Response, next: NextFunction): Promise<void> {
  const token = req.headers['x-token'];
  const value = Array.isArray(token) ? token[0] : token;

  if (!value) {
    throw new UnauthorizedError('Header X-Token ausente.');
  }

  const device = await findDeviceByToken(value);
  if (!device) {
    throw new UnauthorizedError('X-Token inválido.');
  }

  req.device = { id: device.id, espId: device.espId, setorId: device.setorId } satisfies AuthenticatedDevice;
  next();
}
