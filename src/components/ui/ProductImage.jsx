import { useState } from 'react';
import { Flower2 } from 'lucide-react';

/**
 * Product photo with a branded fallback. If the remote asset 404s or the
 * network is offline we render an on-brand placeholder instead of a broken
 * image icon, so the grid geometry never collapses.
 */
export default function ProductImage({ src, alt, className = '', sizes }) {
  const [failed, setFailed] = useState(!src);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-primary/15 via-brand-bg to-brand-rose/15 ${className}`}
      >
        <Flower2 className="h-10 w-10 text-brand-primary/40" strokeWidth={1.25} aria-hidden="true" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      sizes={sizes}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
