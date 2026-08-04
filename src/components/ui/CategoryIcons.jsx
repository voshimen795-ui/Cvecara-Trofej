/**
 * Category marks drawn in the same idiom as the logo's bloom: thin strokes,
 * open outlines, no fills. Keeps the quick-links row consistent with the
 * botanicals in the hero rather than mixing in a stock icon set.
 */

const STROKE = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

/** Wrapped bouquet: blooms above a cone of paper. */
export function BouquetMark({ className = '' }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" {...STROKE}>
      <path d="M22 34 L32 58 L42 34" />
      <path d="M18 34 C24 30 40 30 46 34" />
      {/* Stems first, then blooms on top of them. */}
      <path d="M26 34 L23 26 M38 34 L41 26 M32 34 L32 20" />
      {/* Centre dots turn the discs into flowers — without them the three
          circles over a cone read as an ice-cream cone. */}
      <circle cx="22" cy="22" r="5.5" />
      <circle cx="22" cy="22" r="1.6" />
      <circle cx="42" cy="22" r="5.5" />
      <circle cx="42" cy="22" r="1.6" />
      <circle cx="32" cy="14" r="6" />
      <circle cx="32" cy="14" r="1.8" />
      <ellipse cx="14" cy="29" rx="5" ry="3" transform="rotate(-28 14 29)" />
      <ellipse cx="50" cy="29" rx="5" ry="3" transform="rotate(28 50 29)" />
    </svg>
  );
}

/** Arrangement: stems fanning out of a vase. */
export function VaseMark({ className = '' }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" {...STROKE}>
      <path d="M22 36 L24 56 C24 57 25 58 26 58 L38 58 C39 58 40 57 40 56 L42 36 Z" />
      <path d="M20 36 L44 36" />
      <path d="M32 36 L32 18 M32 26 L22 16 M32 26 L42 16" />
      <circle cx="32" cy="14" r="4.5" />
      <ellipse cx="19" cy="13" rx="4.5" ry="3.2" transform="rotate(-35 19 13)" />
      <ellipse cx="45" cy="13" rx="4.5" ry="3.2" transform="rotate(35 45 13)" />
    </svg>
  );
}

/** Gift box with a ribbon and a two-loop bow. */
export function GiftMark({ className = '' }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" {...STROKE}>
      <rect x="12" y="26" width="40" height="30" rx="3" />
      <rect x="9" y="18" width="46" height="10" rx="2.5" />
      <path d="M32 18 L32 56" />
      <path d="M32 18 C28 12 22 10 20 13 C18 16 24 18 32 18 Z" />
      <path d="M32 18 C36 12 42 10 44 13 C46 16 40 18 32 18 Z" />
    </svg>
  );
}

/** Teddy bear, front on. */
export function TeddyMark({ className = '' }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" {...STROKE}>
      <circle cx="20" cy="16" r="6" />
      <circle cx="44" cy="16" r="6" />
      <circle cx="32" cy="24" r="13" />
      <ellipse cx="32" cy="28" rx="5" ry="4" />
      <circle cx="27" cy="20" r="1.4" />
      <circle cx="37" cy="20" r="1.4" />
      <path d="M32 26 L32 29" />
      <path d="M22 42 C22 37 42 37 42 42 L42 50 C42 55 22 55 22 50 Z" />
      <ellipse cx="16" cy="44" rx="5" ry="6.5" transform="rotate(-18 16 44)" />
      <ellipse cx="48" cy="44" rx="5" ry="6.5" transform="rotate(18 48 44)" />
    </svg>
  );
}

/** Three helium balloons on curling strings. */
export function BalloonMark({ className = '' }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" {...STROKE}>
      <ellipse cx="22" cy="20" rx="9" ry="11" />
      <ellipse cx="42" cy="17" rx="8" ry="10" />
      <ellipse cx="33" cy="32" rx="7.5" ry="9" />
      <path d="M22 31 L21 34 L23 34 Z" />
      <path d="M42 27 L41 30 L43 30 Z" />
      <path d="M33 41 L32 44 L34 44 Z" />
      <path d="M22 34 C24 42 20 46 22 54" />
      <path d="M42 30 C40 38 44 42 42 54" />
      <path d="M33 44 C34 48 32 50 33 54" />
    </svg>
  );
}
