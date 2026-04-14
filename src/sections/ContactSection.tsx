import { Reveal } from '../components/Reveal';
import { contact } from '../content/siteContent';

export function ContactSection() {
  return (
    <section id="contacto" className="section-wrap contact-section">
      <Reveal>
        <div className="contact-band">
          <div className="contact-copy">
            <p className="eyebrow">{contact.eyebrow}</p>
            <h2>{contact.title}</h2>
            <p>{contact.body}</p>

            <div className="contact-actions">
              <a className="button-primary" href={`mailto:${contact.email}`}>
                Escribir por email
              </a>
              <a className="button-secondary" href="#trabajos">
                Volver a trabajos
              </a>
            </div>
          </div>

          <div className="contact-links">
            <span className="contact-email">{contact.email}</span>
            <div className="social-grid">
              {contact.links.map((link) => (
                <a key={link.label} className="social-link" href={link.href} target="_blank" rel="noreferrer">
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
