/**
 * Line-art botanicals drawn in the logo's idiom: thin white strokes, open
 * outlines, no fills. Each shape is a plain <svg> that inherits colour from
 * `currentColor` and sizing from its wrapper, so the hero can place and
 * animate them freely.
 */

const STROKE = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.4,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  vectorEffect: 'non-scaling-stroke',
};

/** Pointed oval leaf with a centre vein, drawn from its stem-end at (0,0). */
function Leaf({ transform }) {
  return (
    <g transform={transform}>
      <path d="M0 0 C 7 -9 20 -11 28 -2 C 20 7 7 9 0 0 Z" />
      <path d="M2 -0.6 L 25 -2.2" />
    </g>
  );
}

/** A curving stem with leaves alternating down its length. */
export function Sprig({ className = '' }) {
  return (
    <svg viewBox="0 0 130 150" className={className} aria-hidden="true" {...STROKE}>
      <path d="M10 146 C 28 116, 44 82, 58 44 C 64 28, 70 14, 76 4" />
      <Leaf transform="translate(56,50) rotate(-32) scale(1.05)" />
      <Leaf transform="translate(53,58) rotate(196) scale(0.95)" />
      <Leaf transform="translate(44,80) rotate(-20) scale(0.9)" />
      <Leaf transform="translate(41,88) rotate(208) scale(0.8)" />
      <Leaf transform="translate(30,110) rotate(-12) scale(0.72)" />
      <Leaf transform="translate(66,26) rotate(-44) scale(0.8)" />
    </svg>
  );
}

/** Open five-petal wild rose, echoing the bloom on the logo disc. */
export function Bloom({ className = '' }) {
  const petals = [0, 72, 144, 216, 288];
  const stamens = [-40, -20, 0, 20, 40];
  return (
    <svg viewBox="-56 -60 112 112" className={className} aria-hidden="true" {...STROKE}>
      {petals.map((angle) => (
        <g key={angle} transform={`rotate(${angle})`}>
          <path d="M0 -7 C -13 -17, -15 -36, 0 -46 C 15 -36, 13 -17, 0 -7 Z" />
          <path d="M0 -12 C -4 -22, -4 -32, 0 -40" />
        </g>
      ))}
      {stamens.map((angle) => (
        <path key={angle} transform={`rotate(${angle})`} d="M0 -2 L 0 -11" />
      ))}
      <circle cx="0" cy="0" r="4.5" />
    </svg>
  );
}

/** Eucalyptus-style stem: round leaves stepping alternately off a curve. */
export function Eucalyptus({ className = '' }) {
  // Anchor points sampled off the stem curve itself, so every leaf touches it.
  const leaves = [
    [62, 17, -38, 1],
    [57, 32, 142, 0.92],
    [51, 48, -30, 0.86],
    [45, 66, 150, 0.8],
    [40, 85, -24, 0.72],
    [34, 104, 156, 0.64],
  ];
  return (
    <svg viewBox="0 0 90 130" className={className} aria-hidden="true" {...STROKE}>
      <path d="M66 6 C 56 34, 44 66, 30 120" />
      {leaves.map(([x, y, rot, s], i) => (
        <g key={i} transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
          <ellipse cx="11" cy="0" rx="11" ry="7.5" />
        </g>
      ))}
    </svg>
  );
}

/** A closed bud on a short stem, with two guard leaves. */
export function Bud({ className = '' }) {
  return (
    <svg viewBox="0 0 80 120" className={className} aria-hidden="true" {...STROKE}>
      <path d="M40 116 C 40 92, 40 70, 40 52" />
      <path d="M40 52 C 26 44, 24 24, 40 10 C 56 24, 54 44, 40 52 Z" />
      <path d="M40 46 C 34 34, 34 22, 40 14" />
      <path d="M40 74 C 28 72, 20 62, 18 50 C 30 50, 38 60, 40 74 Z" />
      <path d="M40 88 C 52 86, 60 78, 62 66 C 50 66, 42 76, 40 88 Z" />
    </svg>
  );
}
