import { Link } from 'react-router-dom';
import { Activity, ArrowRight, Building, Droplet, Radio, ShieldCheck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { buttonStyles } from '../../../components/ui/button-styles';

interface Indicador {
  label: string;
  description: string;
  icon: LucideIcon;
}

const INDICADORES: Indicador[] = [
  {
    label: 'Sensores ativos',
    description: 'Dispositivos reportando leitura',
    icon: Radio,
  },
  {
    label: 'Monitoramento',
    description: 'Vazão medida em tempo real',
    icon: Activity,
  },
  {
    label: 'Empresas',
    description: 'Organizações atendidas',
    icon: Building,
  },
  {
    label: 'Disponibilidade',
    description: 'Status da plataforma',
    icon: ShieldCheck,
  },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-siva-900">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(65%_60%_at_75%_0%,rgba(4,150,255,0.28),transparent_70%)]"
      />

      <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8 lg:py-28">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-cool-sky">
            <Droplet className="size-3.5" aria-hidden="true" />
            Sistema Inteligente de Vazão de Água
          </p>

          <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl">
            Monitoramento de vazão e gestão de manutenção para a indústria
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
            O SIVA conecta sensores, ativos e equipes em um só lugar — do provisionamento do
            dispositivo ao acompanhamento contínuo das linhas de produção.
          </p>

          <div className="mt-8">
            <Link to="/login" className={buttonStyles('primary', 'lg')}>
              Acessar sistema
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {INDICADORES.map(({ label, description, icon: Icon }) => (
              <div
                key={label}
                className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition-colors hover:border-cool-sky/40 hover:bg-white/10"
              >
                <Icon className="size-5 text-cool-sky" aria-hidden="true" />
                <p className="mt-4 text-sm font-medium text-slate-300">{label}</p>
                <p className="mt-1 text-2xl font-bold text-white" aria-hidden="true">
                  —
                </p>
                <p className="mt-1 text-xs leading-relaxed text-slate-400">{description}</p>
              </div>
            ))}
          </div>

          <p className="mt-4 text-xs leading-relaxed text-slate-400">
            Indicadores ilustrativos. Os valores reais são alimentados pela API do SIVA após a
            autenticação.
          </p>
        </div>
      </div>
    </section>
  );
}
