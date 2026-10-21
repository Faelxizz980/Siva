import { Activity, Building, LayoutDashboard, Users } from 'lucide-react';
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
    to: '/painel',
    label: 'Painel operacional',
    description: 'Consumo, setores, ativos e dispositivos',
    icon: Activity,
  },
  {
    to: '/admin',
    label: 'Dashboard',
    description: 'Resumo administrativo da plataforma',
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
];
