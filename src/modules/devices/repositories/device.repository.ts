import type {
  CrudRepository,
  ListOptions,
  ListResult,
} from '../../../interfaces/repository.interface.js';
import { env } from '../../../config/env.js';
import { prisma } from '../../../database/prisma.js';
import { createMockRepository } from '../../../shared/mock/create-mock-repository.js';
import { devices as devicesMock } from '../../../shared/mock/mock-store.js';
import type { Device } from '../entities/device.entity.js';
import type { CreateDeviceDTO, UpdateDeviceDTO } from '../dtos/device.dtos.js';

export type DeviceRepository = CrudRepository<Device, CreateDeviceDTO, UpdateDeviceDTO> & {
  findByToken(token: string): Promise<Device | null>;
  touchContact(id: number): Promise<void>;
};

function buildWhere(filter: Record<string, unknown>) {
  const where: Record<string, unknown> = {};
  if (filter.id !== undefined) where.id = Number(filter.id);
  if (filter.setorId !== undefined) where.setorId = Number(filter.setorId);
  return where;
}

const prismaRepository: DeviceRepository = {
  async list(options: ListOptions = {}): Promise<ListResult<Device>> {
    const { page = 1, pageSize = 20, filter = {} } = options;
    const where = buildWhere(filter);
    const [items, total] = await Promise.all([
      prisma.esp32.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { id: 'asc' },
      }),
      prisma.esp32.count({ where }),
    ]);
    return { items, total };
  },
  async findById(id) {
    return prisma.esp32.findUnique({ where: { id: Number(id) } });
  },
  async create(data) {
    return prisma.esp32.create({ data: { ...data, token: generateDeviceToken() } });
  },
  async update(id, data) {
    try {
      return await prisma.esp32.update({ where: { id: Number(id) }, data });
    } catch {
      return null;
    }
  },
  async remove(id) {
    try {
      await prisma.esp32.delete({ where: { id: Number(id) } });
      return true;
    } catch {
      return false;
    }
  },
  async findByToken(token) {
    return prisma.esp32.findFirst({ where: { token } });
  },
  async touchContact(id) {
    await prisma.esp32.update({ where: { id }, data: { ultimoContato: new Date() } });
  },
};

const mockRepository: DeviceRepository = {
  ...createMockRepository<Device, CreateDeviceDTO, UpdateDeviceDTO>(devicesMock),
  async create(data) {
    return devicesMock.create({
      ...data,
      descricao: data.descricao ?? null,
      token: generateDeviceToken(),
      ultimoContato: null,
      criadoEm: new Date(),
    });
  },
  async findByToken(token) {
    return devicesMock.findOne((item) => item.token === token);
  },
  async touchContact(id) {
    devicesMock.update(id, { ultimoContato: new Date() });
  },
};

function generateDeviceToken(): string {
  return `dev-${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
}

export function createDeviceRepository(): DeviceRepository {
  return env.MOCK_MODE ? mockRepository : prismaRepository;
}

export async function findDeviceByToken(token: string): Promise<Device | null> {
  return createDeviceRepository().findByToken(token);
}
