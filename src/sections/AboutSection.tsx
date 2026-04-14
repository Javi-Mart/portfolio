import { Reveal } from '../components/Reveal';
import { SectionLabel } from '../components/SectionLabel';
import { about, creativeProcess } from '../content/siteContent';

export function AboutSection() {
  return (
    <section id="perfil" className="section-wrap about-section">
      <div className="about-layout">
        <Reveal className="about-heading">
          <SectionLabel eyebrow={about.eyebrow} title={about.title} />
          <p className="about-pullquote">Entre arte, branding, 3D, motion y sistemas AI: piezas con presencia y producción real.</p>
        </Reveal>

        <div className="about-body">
          <Reveal delay={0.08}>
            <div className="about-copy">
              {about.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.14}>
            <div className="metrics-grid">
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

      <Reveal delay={0.18}>
        <div className="process-strip">
          {creativeProcess.map((item) => (
            <article key={item.label} className="process-card">
              <span>{item.label}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
