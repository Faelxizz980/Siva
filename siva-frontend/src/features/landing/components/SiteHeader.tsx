import { Link } from 'react-router-dom';

import { BrandLogo } from '../../../components/brand/BrandLogo';
import { buttonStyles } from '../../../components/ui/button-styles';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-siva-800/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" aria-label="SIVA — voltar ao início" className="rounded-md">
          <BrandLogo className="h-7 w-auto" />
        </Link>

        <Link to="/login" className={buttonStyles('primary', 'md')}>
          Entrar
        </Link>
      </div>
    </header>
  );
}
