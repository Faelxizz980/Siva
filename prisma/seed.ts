import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { createHash } from 'node:crypto';

// O banco guarda apenas o hash SHA-256 do token; o firmware usa o valor em claro.
const hashToken = (token: string): string =>
  createHash('sha256').update(token, 'utf8').digest('hex');

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const senhaHash = await bcrypt.hash('senha123', 10);

  const empresa = await prisma.empresa.upsert({
    where: { cnpj: '12.345.678/0001-90' },
    update: {},
    create: { nome: 'Aquaplás Indústria Ltda', cnpj: '12.345.678/0001-90' },
  });

  await prisma.usuario.upsert({
    where: { email: 'admin@siva.local' },
    update: {},
    create: {
      nome: 'Administrador SIVA',
      email: 'admin@siva.local',
      senha: senhaHash,
      tipo: 'ADMIN',
      especialidade: null,
      status: 'ATIVO',
      empresaId: null,
    },
  });

  // Compatibilidade com o seed anterior.
  await prisma.usuario.upsert({
    where: { email: 'super@siva.com' },
    update: {},
    create: {
      nome: 'Administrador SIVA',
      email: 'super@siva.com',
      senha: senhaHash,
      tipo: 'ADMIN',
      especialidade: null,
      status: 'ATIVO',
      empresaId: null,
    },
  });

  const gestor = await prisma.usuario.upsert({
    where: { email: 'carla.mendes@aquaplas.com' },
    update: {},
    create: {
      nome: 'Carla Mendes',
      email: 'carla.mendes@aquaplas.com',
      senha: senhaHash,
      tipo: 'GESTOR',
      especialidade: null,
      status: 'ATIVO',
      empresaId: empresa.id,
    },
  });
  void gestor;

  const tecnico = await prisma.usuario.upsert({
    where: { email: 'diego.ramos@aquaplas.com' },
    update: {},
    create: {
      nome: 'Diego Ramos',
      email: 'diego.ramos@aquaplas.com',
      senha: senhaHash,
      tipo: 'TECNICO',
      especialidade: 'MECANICO',
      status: 'ATIVO',
      empresaId: empresa.id,
    },
  });

  const setor = await prisma.setor.upsert({
    where: { id: 1 },
    update: {},
    create: { empresaId: empresa.id, nome: 'Produção' },
  });

  const esp32 = await prisma.esp32.upsert({
    where: { espId: 'esp_01' },
    update: {},
    create: {
      setorId: setor.id,
      espId: 'esp_01',
      tokenHash: hashToken('dev-token-esp01'),
      descricao: 'ESP32 de produção',
    },
  });

  const ativo = await prisma.ativo.upsert({
    where: { tag: 'AT-PRD-001' },
    update: {},
    create: { setorId: setor.id, nome: 'Tanque de ETA 01', tag: 'AT-PRD-001', criticidade: 'alta' },
  });

  const sensor = await prisma.sensor.upsert({
    where: { esp32Id_sensorId: { esp32Id: esp32.id, sensorId: 'sensor_01' } },
    update: {},
    create: { ativoId: ativo.id, esp32Id: esp32.id, sensorId: 'sensor_01', tag: 'SN-PRD-001' },
  });

  await prisma.manutencao.upsert({
    where: { id: 1 },
    update: {},
    create: {
      sensorId: sensor.id,
      tipo: 'preventiva',
      descricao: 'Calibração inicial do sensor.',
      funcionarioId: tecnico.id,
    },
  });

  console.log('Seed concluído.');
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
