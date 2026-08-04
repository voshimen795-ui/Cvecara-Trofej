import { useState } from 'react';
import { Flower2, Gift, Leaf, PartyPopper, Rabbit } from 'lucide-react';

/**
 * Per-category placeholder art. Keeps a catalog with missing photography
 * looking deliberate instead of showing sixteen identical grey boxes.
 */
const FALLBACK = {
  buketi: { icon: Flower2, tint: 'from-brand-primary/15 via-brand-bg to-brand-rose/15' },
  aranzmani: { icon: Leaf, tint: 'from-brand-primary/20 via-brand-bg to-brand-primary/5' },
  pokloni: { icon: Gift, tint: 'from-brand-rose/15 via-brand-bg to-brand-primary/10' },
  'plisane-igracke': { icon: Rabbit, tint: 'from-brand-rose/20 via-brand-bg to-brand-rose/5' },
  baloni: { icon: PartyPopper, tint: 'from-brand-primary/10 via-brand-bg to-brand-rose/20' },
};

const DEFAULT_FALLBACK = FALLBACK.buketi;

/**
 * Product photo with a branded fallback. If the remote asset 404s or the
 * network is offline we render an on-brand placeholder instead of a broken
 * image icon, so the grid geometry never collapses.
 */
export default function ProductImage({ src, alt, category, className = '', sizes }) {
  const [failed, setFailed] = useState(!src);

  if (failed) {
    const { icon: Icon, tint } = FALLBACK[category] ?? DEFAULT_FALLBACK;
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${tint} ${className}`}
      >
        <Icon className="h-10 w-10 text-brand-primary/40" strokeWidth={1.25} aria-hidden="true" />
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
