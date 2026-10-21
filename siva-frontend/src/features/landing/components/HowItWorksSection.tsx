import { Activity, Cpu, Factory } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { SectionHeading } from '../../../components/ui/SectionHeading';

interface Etapa {
  numero: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

const ETAPAS: Etapa[] = [
  {
    numero: '01',
    title: 'Empresa contratante',
    description:
      'A empresa é cadastrada pelo administrador, junto com seus setores, ativos e usuários.',
    icon: Factory,
  },
  {
    numero: '02',
    title: 'Sensor provisionado',
    description:
      'O dispositivo ESP32 é vinculado ao ativo e aos sensores que medem a vazão da linha.',
    icon: Cpu,
  },
  {
    numero: '03',
    title: 'Operação monitorada',
    description:
      'As leituras chegam em tempo real e alimentam o painel e a manutenção da equipe.',
    icon: Activity,
  },
];

export function HowItWorksSection() {
  return (
    <section id="como-funciona" className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Como funciona"
          title="Do contrato ao dado, em três etapas"
          description="O caminho de uma empresa até a leitura de vazão em tempo real no painel."
        />

        <ol className="mt-12 grid gap-6 md:grid-cols-3">
          {ETAPAS.map(({ numero, title, description, icon: Icon }) => (
            <li
              key={numero}
              className="relative rounded-xl border border-slate-200 bg-siva-50/60 p-6 transition-colors hover:border-siva-300"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex size-11 items-center justify-center rounded-lg bg-white text-bright-teal-blue shadow-sm">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span className="font-display text-3xl font-extrabold text-siva-200" aria-hidden="true">
                  {numero}
                </span>
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-900">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
