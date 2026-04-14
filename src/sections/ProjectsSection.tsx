import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { MediaFrame } from '../components/MediaFrame';
import { Reveal } from '../components/Reveal';
import { SectionLabel } from '../components/SectionLabel';
import type { Project } from '../content/siteContent';
import { projects } from '../content/siteContent';

type ProjectsSectionProps = {
  onProjectSelect: (project: Project) => void;
};

export function ProjectsSection({ onProjectSelect }: ProjectsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'start 22%'],
  });
  const layerY = useSpring(useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [110, 0]), {
    stiffness: 88,
    damping: 25,
    mass: 0.86,
  });

  return (
    <section id="trabajos" ref={sectionRef} className="section-wrap projects-section">
      <motion.div className="projects-parallax-layer" style={{ y: layerY }}>
        <Reveal>
          <SectionLabel
            eyebrow="Trabajos"
            title="Proyectos pensados como sistemas, no como piezas aisladas."
            body="La estructura esta lista para agregar nuevos casos, medios, etiquetas y enlaces desde un solo archivo de contenido."
          />
        </Reveal>

        <div className="project-list">
          {projects.map((project, index) => (
            <Reveal key={project.id} delay={index * 0.05}>
              <motion.button
                type="button"
                className={`project-card ${index === 0 ? 'project-card-featured' : ''}`}
                onClick={() => onProjectSelect(project)}
                whileHover={{ y: -8, scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                transition={{ duration: 0.25 }}
              >
                <span className="project-card-media">
                  <MediaFrame media={project.media[0]} />
                </span>
                <span className="project-card-meta">
                  <span>{project.eyebrow}</span>
                  <span>{project.year}</span>
                </span>
                <span className="project-card-copy">
                  <span className="project-card-title">{project.title}</span>
                  <span className="project-card-summary">{project.summary}</span>
                  <span className="project-card-tags">
                    {project.tags.map((tag) => (
                      <span key={tag} className="tag">
                        {tag}
                      </span>
                    ))}
                  </span>
                  <span className="project-open">Abrir caso</span>
                </span>
              </motion.button>
            </Reveal>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
