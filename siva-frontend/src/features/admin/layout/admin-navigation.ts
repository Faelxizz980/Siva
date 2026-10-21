import { LayoutDashboard, Building, Radio, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface AdminNavItem {
  to: string;
  label: string;
  description: string;
  icon: LucideIcon;
  /** Correspondência exata (para a raiz do admin). */
  end?: boolean;
}

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  {
    to: '/admin',
    label: 'Dashboard',
    description: 'Resumo operacional da plataforma',
    icon: LayoutDashboard,
    end: true,
  },
  {
    to: '/admin/empresas',
    label: 'Empresas',
    description: 'Cadastro e gestão das empresas',
    icon: Building,
  },
  {
    to: '/admin/usuarios',
    label: 'Usuários',
    description: 'Contas de acesso e perfis',
    icon: Users,
  },
  {
    to: '/admin/sensores',
    label: 'Sensores',
    description: 'Sensores de vazão instalados',
    icon: Radio,
  },
];
