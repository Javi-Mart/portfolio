import { Reveal } from '../components/Reveal';
import { SectionLabel } from '../components/SectionLabel';
import { about } from '../content/siteContent';

export function AboutSection() {
  return (
    <section id="perfil" className="section-wrap">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <Reveal>
          <SectionLabel eyebrow={about.eyebrow} title={about.title} />
        </Reveal>

        <div className="grid gap-8">
          <Reveal delay={0.08}>
            <div className="grid gap-5 text-lg leading-9 text-white/76">
              {about.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.14}>
            <div className="grid gap-3 sm:grid-cols-3">
              {about.facts.map((fact) => (
                <div key={fact.label} className="metric">
                  <strong>{fact.value}</strong>
                  <span>{fact.label}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
