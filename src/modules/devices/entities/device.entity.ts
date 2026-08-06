export interface Device {
  id: number;
  setorId: number;
  espId: string;
  token: string;
  descricao: string | null;
  ultimoContato: Date | null;
  criadoEm: Date;
}

export type PublicDevice = Omit<Device, 'token'>;

export function toPublicDevice(device: Device): PublicDevice {
  const { token: _token, ...publicDevice } = device;
  return publicDevice;
}
