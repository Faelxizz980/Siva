import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const senhaHash = await bcrypt.hash('senha123', 10);

  const empresa = await prisma.empresa.upsert({
    where: { cnpj: '12.345.678/0001-90' },
    update: {},
    create: { nome: 'Aquaplás Indústria Ltda', cnpj: '12.345.678/0001-90' },
  });

  await prisma.usuario.upsert({
    where: { email: 'super@siva.com' },
    update: {},
    create: {
      nome: 'Administrador SIVA',
      email: 'super@siva.com',
      senha: senhaHash,
      tipo: 'super_admin',
    },
  });

  await prisma.usuario.upsert({
    where: { email: 'carla.mendes@aquaplas.com' },
    update: {},
    create: {
      nome: 'Carla Mendes',
      email: 'carla.mendes@aquaplas.com',
      senha: senhaHash,
      tipo: 'admin_empresa',
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
      token: 'dev-token-esp01',
      descricao: 'ESP32 de produção',
    },
  });

  const ativo = await prisma.ativo.upsert({
    where: { tag: 'AT-PRD-001' },
    update: {},
    create: { setorId: setor.id, nome: 'Tanque de ETA 01', tag: 'AT-PRD-001', criticidade: 'alta' },
  });

  await prisma.sensor.upsert({
    where: { esp32Id_sensorId: { esp32Id: esp32.id, sensorId: 'sensor_01' } },
    update: {},
    create: { ativoId: ativo.id, esp32Id: esp32.id, sensorId: 'sensor_01', tag: 'SN-PRD-001' },
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
