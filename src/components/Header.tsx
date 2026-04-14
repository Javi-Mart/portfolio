import { useState } from 'react';
import { navigation, siteMeta } from '../content/siteContent';
import { ScrollProgress } from './ScrollProgress';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-page/72 backdrop-blur-xl">
      <ScrollProgress />
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
        <a href="#intro" className="group flex items-center gap-3" onClick={() => setIsOpen(false)}>
          <span className="brand-mark" aria-hidden="true">
            JC
          </span>
          <span className="hidden text-sm font-semibold text-ink sm:block">{siteMeta.name}</span>
        </a>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Navegacion principal">
          {navigation.map((item) => (
            <a key={item.href} className="nav-link" href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          className="menu-button md:hidden"
          aria-label="Abrir navegacion"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((current) => !current)}
        >
          <span />
          <span />
        </button>
      </div>

      {isOpen ? (
        <nav className="border-t border-white/10 bg-page px-5 py-4 md:hidden" aria-label="Navegacion movil">
          <div className="mx-auto grid max-w-7xl gap-2">
            {navigation.map((item) => (
              <a key={item.href} className="mobile-nav-link" href={item.href} onClick={() => setIsOpen(false)}>
                {item.label}
              </a>
            ))}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
