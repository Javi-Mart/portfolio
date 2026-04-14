import { Reveal } from '../components/Reveal';
import { SectionLabel } from '../components/SectionLabel';
import { reel } from '../content/siteContent';

export function ReelSection() {
  return (
    <section id="reel" className="section-wrap">
      <Reveal>
        <SectionLabel eyebrow={reel.eyebrow} title={reel.title} body={reel.body} />
      </Reveal>

      <Reveal delay={0.12}>
        <div className="reel-shell">
          <video
            className="aspect-video w-full object-cover"
            src={reel.videoSrc}
            poster={reel.poster}
            controls
            playsInline
            preload="metadata"
          />
        </div>
      </Reveal>
    </section>
  );
}
