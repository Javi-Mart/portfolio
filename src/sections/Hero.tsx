import { lazy, Suspense } from 'react';
import { hero } from '../content/siteContent';
import { Reveal } from '../components/Reveal';

const HeroScene = lazy(() => import('../components/HeroScene').then((module) => ({ default: module.HeroScene })));

export function Hero() {
  return (
    <section id="intro" className="hero-section">
      <Suspense
        fallback={
          <div className="hero-fallback" aria-hidden="true">
            <div className="fallback-core">
              <span>3D</span>
            </div>
          </div>
        }
      >
        <HeroScene />
      </Suspense>

      <div className="hero-cinematic-field" aria-hidden="true" />
      <div className="hero-orbit-line" aria-hidden="true" />

      <div className="hero-content">
        <div className="hero-copy">
          <Reveal>
            <p className="eyebrow">{hero.eyebrow}</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="hero-title">{hero.title}</h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="hero-body">{hero.body}</p>
          </Reveal>
          <Reveal delay={0.24}>
            <div className="hero-actions">
              <a className="button-primary" href={hero.primaryCta.href}>
                {hero.primaryCta.label}
              </a>
            </div>
          </Reveal>
        </div>

        <div className="hero-minimal-badge" aria-hidden="true">
          <span>01</span>
          <strong>Visual systems</strong>
        </div>
      </div>

      <a className="hero-scroll-floating scroll-cue" href="#reel">
        <span>Scroll</span>
        <span aria-hidden="true" />
      </a>
    </section>
  );
}
