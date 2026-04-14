import type { ProjectMedia } from '../content/siteContent';

type MediaFrameProps = {
  media: ProjectMedia;
  className?: string;
  controls?: boolean;
  autoPlay?: boolean;
};

export function MediaFrame({ media, className = '', controls = false, autoPlay = false }: MediaFrameProps) {
  if (media.type === 'video') {
    return (
      <video
        className={`media-frame ${className}`}
        src={media.src}
        poster={media.poster}
        aria-label={media.alt}
        controls={controls}
        autoPlay={autoPlay}
        muted={autoPlay}
        loop={autoPlay}
        playsInline
        preload="metadata"
      />
    );
  }

  return (
    <img
      className={`media-frame ${className}`}
      src={media.src}
      alt={media.alt}
      loading="lazy"
      decoding="async"
    />
  );
}
