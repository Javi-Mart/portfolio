import { Reveal } from '../components/Reveal';
import { contact } from '../content/siteContent';

export function ContactSection() {
  return (
    <section id="contacto" className="section-wrap pb-16">
      <Reveal>
        <div className="contact-band">
          <p className="eyebrow">{contact.eyebrow}</p>
          <h2>{contact.title}</h2>
          <p>{contact.body}</p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a className="button-primary" href={`mailto:${contact.email}`}>
              Escribir por email
            </a>
            <a className="button-secondary" href="#trabajos">
              Volver a trabajos
            </a>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            {contact.links.map((link) => (
              <a key={link.label} className="social-link" href={link.href} target="_blank" rel="noreferrer">
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
