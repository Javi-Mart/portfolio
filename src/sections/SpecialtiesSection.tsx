import { motion } from 'framer-motion';
import { Reveal } from '../components/Reveal';
import { SectionLabel } from '../components/SectionLabel';
import { specialties } from '../content/siteContent';

export function SpecialtiesSection() {
  return (
    <section id="especialidades" className="section-wrap">
      <Reveal>
        <SectionLabel
          eyebrow="Especialidades"
          title="Capas creativas que se conectan sin perder precision."
          body="Cada area esta pensada para funcionar sola o como parte de un sistema visual mas grande."
        />
      </Reveal>

      <div className="mt-12 grid gap-4 md:grid-cols-2">
        {specialties.map((specialty, index) => (
          <Reveal key={specialty.title} delay={index * 0.04}>
            <motion.article className="specialty-card" whileHover={{ y: -6 }} transition={{ duration: 0.24 }}>
              <span className="specialty-index">{specialty.label}</span>
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
