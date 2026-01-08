import Scene3D from "@/components/Scene3D";

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="section hero" id="home">
        <div className="hero-left">
          <p className="section-label">Portfolio · Preview</p>
          <h1 className="hero-title">
            Diseñador gráfico & <span>Artista técnico</span>
          </h1>
          <p className="hero-subtitle">
            Combino dirección de arte, diseño gráfico y pipelines técnicos para
            crear experiencias visuales consistentes, optimizadas y listas para
            producción.
          </p>

          <div className="pill-row">
            <span className="pill pill-accent">Branding & Visual Design</span>
            <span className="pill">Technical Art · 3D · Shaders</span>
            <span className="pill">Game / Real-time pipelines</span>
          </div>

          <div className="hero-actions">
            <a href="#projects" className="btn btn-primary">
              Ver proyectos destacados
            </a>
            <a href="#contact" className="btn">
              Contactar
            </a>
          </div>
        </div>

        <div className="hero-right">
          <Scene3D />
        </div>
      </section>

      {/* SOBRE MÍ */}
      <section className="section" id="about">
        <div className="section-header">
          <div>
            <p className="section-label">Sobre mí</p>
            <h2 className="section-title-main">Diseño + Tecnología</h2>
          </div>
          <p className="section-subtitle">
            Un breve resumen de quién eres, tu experiencia en diseño gráfico,
            technical art, y cómo conectas ambos mundos en proyectos reales.
          </p>
        </div>

        <div className="cards-grid">
          <article className="card">
            <small className="card-label">Especialidad</small>
            <h3 className="card-title">Diseño gráfico & branding</h3>
            <div className="tags-row">
              <span className="tag">Identidad visual</span>
              <span className="tag">Sistemas gráficos</span>
              <span className="tag">Tipografía</span>
              <span className="tag">Dirección de arte</span>
            </div>
          </article>

          <article className="card">
            <small className="card-label">Especialidad</small>
            <h3 className="card-title">Technical Art & 3D</h3>
            <div className="tags-row">
              <span className="tag">Blender / Maya</span>
              <span className="tag">Shaders & materiales</span>
              <span className="tag">Optimización</span>
              <span className="tag">Automatización</span>
            </div>
          </article>

          <article className="card">
            <small className="card-label">Stack</small>
            <h3 className="card-title">Herramientas & Pipeline</h3>
            <div className="tags-row">
              <span className="tag">Adobe CC / Figma</span>
              <span className="tag">Blender / Roblox Studio</span>
              <span className="tag">GitHub / Notion</span>
              <span className="tag">Python / Lua / JS</span>
            </div>
          </article>
        </div>
      </section>

      {/* PROYECTOS */}
      <section className="section" id="projects">
        <div className="section-header">
          <div>
            <p className="section-label">Proyectos</p>
            <h2 className="section-title-main">Selección de trabajos</h2>
          </div>
          <p className="section-subtitle">
            Una vista rápida a proyectos de branding, dirección de arte, assets
            3D y soluciones técnicas para producción.
          </p>
        </div>

        <div className="projects-grid">
          <article className="project-card">
            <div className="project-thumb" />
            <div className="project-body">
              <div className="project-header">
                <h3 className="project-title">Proyecto 01 · Branding + UI</h3>
                <span className="project-type">Graphic Design</span>
              </div>
              <p className="project-desc">
                Sistema de identidad visual y UI kit para una plataforma
                digital. Enfoque en consistencia tipográfica, color y
                componentes.
              </p>
              <div className="project-footer">
                <div className="project-tags">
                  <span className="project-tag">Branding</span>
                  <span className="project-tag">UI/UX</span>
                </div>
                <span className="project-link">Caso pronto</span>
              </div>
            </div>
          </article>

          <article className="project-card">
            <div className="project-thumb" />
            <div className="project-body">
              <div className="project-header">
                <h3 className="project-title">Proyecto 02 · Technical Art</h3>
                <span className="project-type">Tech Art</span>
              </div>
              <p className="project-desc">
                Setup de materiales, iluminación y optimización para entorno en
                tiempo real, integrando arte y performance.
              </p>
              <div className="project-footer">
                <div className="project-tags">
                  <span className="project-tag">Shaders</span>
                  <span className="project-tag">3D</span>
                  <span className="project-tag">Real-time</span>
                </div>
                <span className="project-link">Breakdown pronto</span>
              </div>
            </div>
          </article>

          <article className="project-card">
            <div className="project-thumb" />
            <div className="project-body">
              <div className="project-header">
                <h3 className="project-title">Proyecto 03 · Pipeline</h3>
                <span className="project-type">Tools</span>
              </div>
              <p className="project-desc">
                Herramientas personalizadas y automatización para acelerar el
                flujo de trabajo de arte (naming, exports, organización de
                assets).
              </p>
              <div className="project-footer">
                <div className="project-tags">
                  <span className="project-tag">Automation</span>
                  <span className="project-tag">Python / Lua</span>
                </div>
                <span className="project-link">Repo pronto</span>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* CONTACTO */}
      <section className="section" id="contact">
        <div className="section-header">
          <div>
            <p className="section-label">Contacto</p>
            <h2 className="section-title-main">Trabajemos juntos</h2>
          </div>
          <p className="section-subtitle">
            Ideal para dejar forma de contacto directa y links a redes
            profesionales (Behance, ArtStation, GitHub, LinkedIn, etc.).
          </p>
        </div>

        <div className="contact-row">
          <div className="contact-main">
            <p className="contact-highlight">
              ¿Tienes un proyecto que combine <span>diseño</span> y{" "}
              <span>tecnología</span>?
            </p>
            <p className="contact-text">
              Estoy abierto a colaborar en branding, diseño de producto digital,
              entornos 3D y soluciones técnicas para equipos creativos.
            </p>
            <div className="contact-list">
              <span>
                Email:{" "}
                <a href="mailto:tucorreo@ejemplo.com">
                  tucorreo@ejemplo.com
                </a>
              </span>
              <span>
                LinkedIn:{" "}
                <a href="#" target="_blank">
                  linkedin.com/in/tu-perfil
                </a>
              </span>
              <span>
                GitHub:{" "}
                <a href="#" target="_blank">
                  github.com/tuusuario
                </a>
              </span>
              <span>
                Portfolio visual:{" "}
                <a href="#" target="_blank">
                  Behance / ArtStation
                </a>
              </span>
            </div>
          </div>

          <div className="contact-side">
            <p className="contact-pill">
              Próximo paso: integrar un formulario real (Netlify Forms,
              Formspree o una API propia).
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
