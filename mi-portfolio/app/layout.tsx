import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Javier Martínez | Portfolio",
  description:
    "Portafolio de Javier Martínez, diseñador gráfico y artista técnico.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="body">
        <div className="page-wrapper">
          <header className="site-header">
            <div className="brand">
              <div className="brand-logo">JM</div>
              <div className="brand-text">
                <span>Javier Martínez</span>
                <span>Graphic Designer · Technical Artist</span>
              </div>
            </div>
            <nav className="nav">
              <a href="#about">Sobre mí</a>
              <a href="#projects">Proyectos</a>
              <a href="#contact" className="nav-primary">
                Contacto
              </a>
            </nav>
          </header>

          <main>{children}</main>

          <footer className="site-footer">
            © {new Date().getFullYear()} Javier Martínez · Portfolio Preview
          </footer>
        </div>
      </body>
    </html>
  );
}
