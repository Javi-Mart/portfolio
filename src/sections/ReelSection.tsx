import { Reveal } from '../components/Reveal';
import { SectionLabel } from '../components/SectionLabel';
import { reel } from '../content/siteContent';

export function ReelSection() {
  return (
    <section id="reel" className="section-wrap reel-section">
      <div className="reel-layout">
        <Reveal className="reel-copy">
          <SectionLabel eyebrow={reel.eyebrow} title={reel.title} body={reel.body} />
          <div className="reel-notes" aria-label="Detalles del reel">
            <span>Motion</span>
            <span>Direction</span>
            <span>Visual rhythm</span>
          </div>
        </Reveal>

        <Reveal delay={0.12} className="reel-stage">
          <div className="reel-shell">
            <div className="reel-chrome" aria-hidden="true">
              <span />
              <span>REEL / 00:00</span>
              <span />
            </div>
            <video
              className="reel-video"
              src={reel.videoSrc}
              poster={reel.poster}
              controls
              playsInline
              preload="metadata"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
