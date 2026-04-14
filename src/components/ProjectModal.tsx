import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import type { Project } from '../content/siteContent';
import { MediaFrame } from './MediaFrame';

type ProjectModalProps = {
  project: Project;
  onClose: () => void;
};

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeMedia = project.media[activeIndex];
  const hasMultipleMedia = project.media.length > 1;

  useEffect(() => {
    setActiveIndex(0);
  }, [project.id]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const showPrevious = () => {
    setActiveIndex((index) => (index === 0 ? project.media.length - 1 : index - 1));
  };

  const showNext = () => {
    setActiveIndex((index) => (index === project.media.length - 1 ? 0 : index + 1));
  };

  return createPortal(
    <motion.div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`project-${project.id}-title`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.24 }}
      onClick={onClose}
    >
      <motion.div
        className="modal-panel"
        initial={{ opacity: 0, y: 28, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.98 }}
        transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="modal-close" onClick={onClose} aria-label="Cerrar proyecto">
          Cerrar
        </button>

        <div className="grid gap-6 lg:grid-cols-[1.22fr_0.78fr]">
          <div className="modal-media">
            <MediaFrame media={activeMedia} controls={activeMedia.type === 'video'} className="h-full min-h-[280px]" />
            {hasMultipleMedia ? (
              <div className="modal-media-controls" aria-label="Navegacion de medios">
                <button type="button" onClick={showPrevious}>
                  Anterior
                </button>
                <span>
                  {activeIndex + 1} / {project.media.length}
                </span>
                <button type="button" onClick={showNext}>
                  Siguiente
                </button>
              </div>
            ) : null}
          </div>

          <div className="flex flex-col justify-between gap-8">
            <div>
              <p className="eyebrow">{project.eyebrow}</p>
              <h3 id={`project-${project.id}-title`} className="mt-4 text-3xl font-semibold text-ink sm:text-4xl">
                {project.title}
              </h3>
              <p className="mt-4 text-sm text-muted">{project.year}</p>
              <p className="mt-6 text-base leading-8 text-white/78">{project.description}</p>
            </div>

            <div className="grid gap-5">
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>

              {project.links ? (
                <div className="flex flex-wrap gap-3">
                  {project.links.map((link) => (
                    <a key={link.href} className="text-link" href={link.href} target="_blank" rel="noreferrer">
                      {link.label}
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  );
}
