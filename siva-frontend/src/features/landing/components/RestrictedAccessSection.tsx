import { Link } from 'react-router-dom';
import { KeyRound } from 'lucide-react';

import { buttonStyles } from '../../../components/ui/button-styles';

export function RestrictedAccessSection() {
  return (
    <section className="bg-siva-700 py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <span className="mx-auto inline-flex size-12 items-center justify-center rounded-full bg-white/10 text-cool-sky">
          <KeyRound className="size-6" aria-hidden="true" />
        </span>

        <h2 className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Acesso restrito a usuários autorizados
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-siva-100">
          As contas são criadas pelo administrador do SIVA. Não existe cadastro público — o acesso
          ao painel é liberado somente a usuários autorizados da empresa.
        </p>

        <div className="mt-8">
          <Link to="/login" className={buttonStyles('primary', 'lg')}>
            Fazer login
          </Link>
        </div>
      </div>
    </section>
  );
}
