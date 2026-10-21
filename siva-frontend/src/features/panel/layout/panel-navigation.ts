import { Activity, Cpu, LayoutDashboard, Radio, Warehouse } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface PanelNavItem {
  to: string;
  label: string;
  description: string;
  icon: LucideIcon;
  end?: boolean;
}

/** Navegação da área operacional (disponível para qualquer usuário autenticado). */
export const PANEL_NAV_ITEMS: PanelNavItem[] = [
  {
    to: '/painel',
    label: 'Dashboard',
    description: 'Consumo, sensores e atividades',
    icon: LayoutDashboard,
    end: true,
  },
  {
    to: '/painel/setores',
    label: 'Setores',
    description: 'Áreas de operação da empresa',
    icon: Warehouse,
  },
  {
    to: '/painel/ativos',
    label: 'Ativos',
    description: 'Máquinas e pontos monitorados',
    icon: Cpu,
  },
  {
    to: '/painel/esp32',
    label: 'ESP32',
    description: 'Dispositivos e tokens de acesso',
    icon: Radio,
  },
  {
    to: '/painel/sensores',
    label: 'Sensores',
    description: 'Pontos de medição de vazão',
    icon: Activity,
  },
];
