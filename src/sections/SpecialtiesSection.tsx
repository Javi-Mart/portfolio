import { motion } from 'framer-motion';
import { Reveal } from '../components/Reveal';
import { SectionLabel } from '../components/SectionLabel';
import { specialties } from '../content/siteContent';

export function SpecialtiesSection() {
  return (
    <section id="especialidades" className="section-wrap specialties-section">
      <Reveal>
        <SectionLabel
          eyebrow="Especialidades"
          title="Capas creativas que se conectan sin perder precision."
          body="Cada area esta pensada para funcionar sola o como parte de un sistema visual mas grande."
        />
      </Reveal>

      <div className="specialty-grid">
        {specialties.map((specialty, index) => (
          <Reveal key={specialty.title} delay={index * 0.04}>
            <motion.article
              className="specialty-card"
              whileHover={{ y: -10, rotateX: 1.5, rotateY: index % 2 === 0 ? -1.5 : 1.5 }}
              transition={{ duration: 0.28 }}
            >
              <span className="specialty-index">{specialty.label}</span>
              <span className="specialty-glyph" aria-hidden="true" />
              <div>
                <h3>{specialty.title}</h3>
                <p>{specialty.description}</p>
              </div>
            </motion.article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
