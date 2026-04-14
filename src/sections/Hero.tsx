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

      <div className="pointer-events-none absolute inset-0 z-[1]" aria-hidden="true">
        <div className="mx-auto flex h-full max-w-7xl items-end justify-end px-5 pb-10 sm:px-6 lg:px-8">
          <div className="hidden gap-4 text-right text-7xl font-black text-white/[0.035] lg:grid">
            {hero.ambientText.map((word) => (
              <span key={word}>{word}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto grid h-[74svh] max-h-[720px] min-h-[540px] max-w-7xl items-center px-5 pt-16 sm:px-6 lg:h-[88svh] lg:max-h-[820px] lg:min-h-[590px] lg:px-8">
        <div className="max-w-3xl">
          <Reveal>
            <p className="eyebrow">{hero.eyebrow}</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="mt-6 max-w-4xl break-words text-4xl font-black leading-[1.02] text-ink sm:text-6xl lg:text-7xl">
              {hero.title}
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/74 sm:text-xl">{hero.body}</p>
          </Reveal>
          <Reveal delay={0.24}>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a className="button-primary" href={hero.primaryCta.href}>
                {hero.primaryCta.label}
              </a>
              <a className="button-secondary" href={hero.secondaryCta.href}>
                {hero.secondaryCta.label}
              </a>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="relative z-10 border-y border-white/10 bg-white/[0.03]">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-3 text-sm text-white/68 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <span>{siteMeta.role}</span>
          <span>{siteMeta.location}</span>
          <a className="text-link" href="#reel">
            Bajar al reel
          </a>
        </div>
      </div>
    </section>
  );
}
