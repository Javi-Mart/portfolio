import { useRef } from 'react';
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { Reveal } from '../components/Reveal';
import { SectionLabel } from '../components/SectionLabel';
import { about } from '../content/siteContent';

type ProfileCardProps = {
  card: (typeof about.cards)[number];
  index: number;
  total: number;
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress'];
};

function ProfileCard({ card, index, total, scrollYProgress }: ProfileCardProps) {
  const reduceMotion = useReducedMotion();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const scrollY = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? [0, 0] : [68 + index * 22, -40 - index * 34],
  );
  const y = useSpring(scrollY, { stiffness: 92, damping: 24, mass: 0.82 });
  const rotateX = useTransform(mouseY, [-0.5, 0.5], reduceMotion ? [0, 0] : [3.5, -3.5]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], reduceMotion ? [0, 0] : [-4, 4]);
  const visualX = useTransform(mouseX, [-0.5, 0.5], reduceMotion ? [0, 0] : [-10, 10]);
  const visualY = useTransform(mouseY, [-0.5, 0.5], reduceMotion ? [0, 0] : [-8, 8]);

  return (
    <motion.article
      className={`profile-card profile-card-${card.title.toLowerCase()}`}
      style={{ y, rotateX, rotateY, zIndex: total - index }}
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        mouseX.set((event.clientX - rect.left) / rect.width - 0.5);
        mouseY.set((event.clientY - rect.top) / rect.height - 0.5);
      }}
      onPointerLeave={() => {
        mouseX.set(0);
        mouseY.set(0);
      }}
    >
      <span className="profile-card-glow" aria-hidden="true" />
      <span className="profile-card-label">{card.label}</span>
      <motion.span className="profile-card-visual" style={{ x: visualX, y: visualY }}>
        <img src={card.visual} alt={card.alt} loading="lazy" />
      </motion.span>
      <span className="profile-card-copy">
        <span className="profile-card-title">{card.title}</span>
        <span className="profile-card-description">{card.description}</span>
      </span>
    </motion.article>
  );
}

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 82%', 'end 24%'],
  });

  return (
    <section id="perfil" ref={sectionRef} className="section-wrap about-section">
      <div className="about-layout">
        <Reveal className="about-heading">
          <SectionLabel eyebrow={about.eyebrow} title={about.title} />
          <p className="about-pullquote">{about.subtitle}</p>
        </Reveal>

        <div className="about-body">
          <Reveal delay={0.08}>
            <div className="about-copy">
              {about.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      <div className="profile-card-stack" aria-label="Capacidades del perfil">
        {about.cards.map((card, index) => (
          <ProfileCard
            key={card.title}
            card={card}
            index={index}
            total={about.cards.length}
            scrollYProgress={scrollYProgress}
          />
        ))}
      </div>
    </section>
  );
}
