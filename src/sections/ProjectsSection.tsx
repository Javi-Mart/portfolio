import { motion } from 'framer-motion';
import { MediaFrame } from '../components/MediaFrame';
import { Reveal } from '../components/Reveal';
import { SectionLabel } from '../components/SectionLabel';
import type { Project } from '../content/siteContent';
import { projects } from '../content/siteContent';

type ProjectsSectionProps = {
  onProjectSelect: (project: Project) => void;
};

export function ProjectsSection({ onProjectSelect }: ProjectsSectionProps) {
  return (
    <section id="trabajos" className="section-wrap">
      <Reveal>
        <SectionLabel
          eyebrow="Trabajos"
          title="Proyectos pensados como sistemas, no como piezas aisladas."
          body="La estructura esta lista para agregar nuevos casos, medios, etiquetas y enlaces desde un solo archivo de contenido."
        />
      </Reveal>

      <div className="mt-12 grid gap-5 md:grid-cols-2">
        {projects.map((project, index) => (
          <Reveal key={project.id} delay={index * 0.05}>
            <motion.button
              type="button"
              className="project-card"
              onClick={() => onProjectSelect(project)}
              whileHover={{ y: -7 }}
              whileTap={{ scale: 0.99 }}
              transition={{ duration: 0.25 }}
            >
              <MediaFrame media={project.media[0]} className="h-[280px]" />
              <span className="project-card-meta">
                <span>{project.eyebrow}</span>
                <span>{project.year}</span>
              </span>
              <span className="block px-5 pb-5 pt-4 text-left">
                <span className="block text-2xl font-semibold text-ink">{project.title}</span>
                <span className="mt-3 block text-sm leading-7 text-white/66">{project.summary}</span>
                <span className="mt-4 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </span>
              </span>
            </motion.button>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
