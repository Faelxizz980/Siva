import { Activity, Users, Wrench } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { SectionHeading } from '../../../components/ui/SectionHeading';

interface Card {
  title: string;
  description: string;
  icon: LucideIcon;
}

const CARDS: Card[] = [
  {
    title: 'Monitoramento de vazão',
    description:
      'Leituras contínuas dos sensores de vazão, organizadas por dispositivo, ativo e setor, prontas para consulta e análise do histórico da linha.',
    icon: Activity,
  },
  {
    title: 'Manutenção preventiva',
    description:
      'Chamados e ordens de serviço para planejar a manutenção, atribuir responsáveis e acompanhar o ciclo de trabalho até a conclusão.',
    icon: Wrench,
  },
  {
    title: 'Gestão de equipes',
    description:
      'Controle de acesso por perfil e por empresa, para que gestores e técnicos vejam exatamente as informações que precisam.',
    icon: Users,
  },
];

export function FeaturesSection() {
  return (
    <section id="o-que-e" className="bg-siva-50 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="O que é o SIVA"
          title="Uma plataforma única para a operação industrial"
          description="Reúne monitoramento, manutenção e pessoas em um só ambiente, com a mesma base de dados e as mesmas regras de acesso."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CARDS.map(({ title, description, icon: Icon }) => (
            <article
              key={title}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <span className="inline-flex size-11 items-center justify-center rounded-lg bg-siva-100 text-bright-teal-blue">
                <Icon className="size-5" aria-hidden="true" />
              </span>

              <h3 className="mt-5 text-lg font-bold text-slate-900">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
