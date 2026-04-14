import { motion } from 'framer-motion';
import { ContactScene } from '../components/ContactScene';
import { Reveal } from '../components/Reveal';
import { contact, navigation, siteMeta } from '../content/siteContent';

export function ContactSection() {
  return (
    <section id="contacto" className="contact-section">
      <Reveal>
        <div className="contact-editorial">
          <div className="contact-top-grid">
            <motion.div className="contact-symbol" aria-hidden="true" whileHover={{ x: 8 }} transition={{ duration: 0.25 }}>
              <span>JC</span>
            </motion.div>

            <div className="contact-column">
              <p className="contact-column-label">Navegación</p>
              <nav className="contact-link-stack" aria-label="Navegación secundaria">
                {navigation.map((item) => (
                  <a key={item.href} className="contact-editorial-link" href={item.href}>
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>

            <div className="contact-column">
              <p className="contact-column-label">Redes</p>
              <div className="contact-link-stack">
                {contact.links.map((link) => (
                  <a key={link.label} className="contact-editorial-link" href={link.href} target="_blank" rel="noreferrer">
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            <div className="contact-column contact-column-wide">
              <p className="contact-column-label">Contacto</p>
              <a className="contact-email-large" href={`mailto:${contact.email}`}>
                {contact.email}
              </a>
              <p className="contact-location">{siteMeta.location}</p>
              <p className="contact-body-text">{contact.body}</p>
            </div>
          </div>

          <div className="contact-middle-grid">
            <div className="contact-model-block">
              <div className="contact-model-shell">
                <ContactScene />
                <span className="contact-model-note">3D SIGNAL</span>
              </div>
            </div>

            <div className="contact-message">
              <p className="eyebrow">{contact.eyebrow}</p>
              <h2>{contact.title}</h2>
              <div className="contact-editorial-actions">
                <a className="button-primary" href={`mailto:${contact.email}`}>
                  Escribir por email
                </a>
                <a className="contact-return-link" href="#trabajos">
                  Volver a trabajos
                </a>
              </div>
            </div>
          </div>

          <div className="contact-footer-line" aria-hidden="true">
            <span>2026 / PORTFOLIO</span>
            <span>DESIGN + MOTION + 3D + AI</span>
          </div>

          <div className="contact-giant-word" aria-hidden="true">
            MARTINEZ
          </div>
        </div>
      </Reveal>
    </section>
  );
}
