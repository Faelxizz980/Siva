import { useCallback, useState } from 'react';
import { Outlet } from 'react-router-dom';

import { PanelSidebar } from './PanelSidebar';
import type { PanelOutletContext } from './panel-layout-context';

export function PanelLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const openMenu = useCallback(() => setIsMenuOpen(true), []);
  const closeMenu = useCallback(() => setIsMenuOpen(false), []);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen">
        <PanelSidebar isOpen={isMenuOpen} onClose={closeMenu} />

        <div className="flex min-w-0 flex-1 flex-col">
          <main className="min-w-0 flex-1">
            <Outlet context={{ openMenu } satisfies PanelOutletContext} />
          </main>
        </div>
      </div>
    </div>
  );
}
