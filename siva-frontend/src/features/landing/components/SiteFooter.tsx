import { Link } from 'react-router-dom';

import { BrandLogo } from '../../../components/brand/BrandLogo';

const CURRENT_YEAR = new Date().getFullYear();

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-siva-950 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 text-center sm:px-6 lg:px-8">
        <Link to="/" aria-label="SIVA — voltar ao início" className="rounded-md">
          <BrandLogo className="h-8 w-auto" loading="lazy" />
        </Link>

        <p className="max-w-xl text-sm leading-relaxed text-slate-400">
          SIVA — Sistema Inteligente de Vazão de Água. Plataforma de monitoramento e gestão para a
          operação industrial.
        </p>

        <p className="text-xs text-slate-400">
          © {CURRENT_YEAR} SIVA. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
