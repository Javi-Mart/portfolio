import { lazy, Suspense } from 'react';
import { hero, siteMeta } from '../content/siteContent';
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

      <div className="hero-stage-lines" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <div className="hero-ambient-copy" aria-hidden="true">
        <div className="hero-marquee hero-marquee-top">
          <span>DESIGN SYSTEMS / MOTION / AI / REALTIME 3D /</span>
          <span>DESIGN SYSTEMS / MOTION / AI / REALTIME 3D /</span>
        </div>
        <div className="hero-marquee hero-marquee-bottom">
          <span>PORTFOLIO / DIGITAL CRAFT / IMMERSIVE / BRAND WORLDS /</span>
          <span>PORTFOLIO / DIGITAL CRAFT / IMMERSIVE / BRAND WORLDS /</span>
        </div>
      </div>

      <div className="hero-content">
        <div className="hero-meta-rail" aria-label="Especialidades principales">
          {hero.sideNotes.map((note) => (
            <span key={note}>{note}</span>
          ))}
        </div>

        <div className="hero-copy">
          <Reveal>
            <p className="eyebrow">{hero.eyebrow}</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="hero-title">
              {hero.title}
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="hero-body">{hero.body}</p>
          </Reveal>
          <Reveal delay={0.24}>
            <div className="hero-actions">
              <a className="button-primary" href={hero.primaryCta.href}>
                {hero.primaryCta.label}
              </a>
              <a className="button-secondary" href={hero.secondaryCta.href}>
                {hero.secondaryCta.label}
              </a>
            </div>
          </Reveal>
        </div>

        <div className="hero-editorial-card" aria-hidden="true">
          <span>01</span>
          <p>Brand worlds, cinematic motion and interactive systems.</p>
        </div>
      </div>

      <div className="hero-bottom-bar">
        <span>{siteMeta.role}</span>
        <span>{siteMeta.location}</span>
        <a className="scroll-cue" href="#reel">
          <span>Scroll</span>
          <span aria-hidden="true" />
        </a>
      </div>

      <div className="hero-type-stack" aria-hidden="true">
        {hero.ambientText.map((word) => (
          <span key={word}>{word}</span>
        ))}
      </div>
    </section>
  );
}
