import { SectionHeading } from '../../../components/ui/SectionHeading';

export function AboutSection() {
  return (
    <section id="quem-somos" className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Quem somos"
          title="Tecnologia industrial a serviço da operação"
          description="A SIVA é uma empresa de tecnologia industrial dedicada ao monitoramento de vazão e à gestão de manutenção de ativos críticos. Do sensor ao painel, construímos uma plataforma que dá às equipes o controle sobre o que acontece em campo — com dados confiáveis, histórico rastreável e processos que não dependem de papelada."
          align="left"
        />
      </div>
    </section>
  );
}
