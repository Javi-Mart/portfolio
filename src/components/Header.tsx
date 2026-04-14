import { useState } from 'react';
import { navigation } from '../content/siteContent';
import { ScrollProgress } from './ScrollProgress';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="site-header">
      <ScrollProgress />
      <div className="site-header-inner">
        <a href="#intro" className="brand-link" onClick={() => setIsOpen(false)}>
          <span className="brand-mark" aria-hidden="true">
            JC
          </span>
        </a>

        <nav className="desktop-nav" aria-label="Navegacion principal">
          {navigation.map((item) => (
            <a key={item.href} className="nav-link" href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          className="menu-button"
          aria-label="Abrir navegacion"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((current) => !current)}
        >
          <span />
          <span />
        </button>
      </div>

      {isOpen ? (
        <nav className="mobile-nav" aria-label="Navegacion movil">
          <div className="mobile-nav-inner">
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
