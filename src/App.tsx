import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Header } from './components/Header';
import { ProjectModal } from './components/ProjectModal';
import type { Project } from './content/siteContent';
import { siteMeta } from './content/siteContent';
import { AboutSection } from './sections/AboutSection';
import { ContactSection } from './sections/ContactSection';
import { Hero } from './sections/Hero';
import { ProjectsSection } from './sections/ProjectsSection';
import { ReelSection } from './sections/ReelSection';
import { SpecialtiesSection } from './sections/SpecialtiesSection';

export default function App() {
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  return (
    <>
      <Header />
      <main>
        <Hero />
        <ReelSection />
        <AboutSection />
        <SpecialtiesSection />
        <ProjectsSection onProjectSelect={setActiveProject} />
        <ContactSection />
      </main>
      <footer className="border-t border-white/10 px-5 py-8 text-sm text-white/54 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span>{siteMeta.name}</span>
          <span>{siteMeta.role}</span>
        </div>
      </footer>

      <AnimatePresence>{activeProject ? <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} /> : null}</AnimatePresence>
    </>
  );
}
