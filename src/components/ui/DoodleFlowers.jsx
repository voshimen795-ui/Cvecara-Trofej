/**
 * Doodle blooms — outline-only flowers in the idiom of the reference sheet:
 * one continuous rounded stroke, no fills, everything drawn inside a 100x100
 * box so the falling animation can scale them freely.
 *
 * The stroke scales with the shape (no `vectorEffect`) on purpose: a petal
 * that drifts far into the background should look lighter, not carry the same
 * 2px outline as one falling right in front of you.
 */
const PEN = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

const ring = (count) => Array.from({ length: count }, (_, i) => (i * 360) / count);

/**
 * Straight stem with a leaf on each side — shared by the stemmed flowers.
 * `from` must be a number: it is arithmetic, and a string prop would silently
 * concatenate ("46" + 14 = "4614") and put the leaves off the canvas.
 */
function Stem({ from = 58 }) {
  const y = Number(from);
  return (
    <>
      <path d={`M50 ${y} C 52 ${y + 14}, 48 ${y + 24}, 50 96`} />
      <path
        d={`M50 ${y + 12} C 42 ${y + 9}, 35 ${y + 13}, 33 ${y + 21} C 41 ${y + 22}, 47 ${
          y + 19
        }, 50 ${y + 12} Z`}
      />
      <path
        d={`M50 ${y + 24} C 58 ${y + 21}, 65 ${y + 25}, 67 ${y + 33} C 59 ${y + 34}, 53 ${
          y + 31
        }, 50 ${y + 24} Z`}
      />
    </>
  );
}

/** One rounded petal on the +Y axis, from `inner` out to `outer`. */
const petal = (inner, outer, width) =>
  `M0 -${inner} C -${width} -${(inner + outer) / 2}, -${width} -${outer}, 0 -${outer} ` +
  `C ${width} -${outer}, ${width} -${(inner + outer) / 2}, 0 -${inner} Z`;

/** Eight rounded petals around an open centre, on a stem. */
export function Daisy(props) {
  return (
    <svg viewBox="0 0 100 100" {...PEN} {...props}>
      <g transform="translate(50 34)">
        {ring(8).map((a) => (
          <ellipse key={a} cx="0" cy="-18" rx="7" ry="11" transform={`rotate(${a})`} />
        ))}
        <circle cx="0" cy="0" r="8" />
      </g>
      <Stem from={46} />
    </svg>
  );
}

/**
 * A rose seen from above: three rings of petals closing in on the eye. The
 * first version was a single hand-drawn spiral and it read as a coil, not a
 * flower — layered rings are what the reference sheet actually shows.
 */
export function Rosette(props) {
  return (
    <svg viewBox="0 0 100 100" {...PEN} {...props}>
      <g transform="translate(50 50)">
        {ring(10).map((a) => (
          <path key={`o-${a}`} transform={`rotate(${a})`} d={petal(27, 45, 11)} />
        ))}
        {ring(8).map((a) => (
          <path key={`m-${a}`} transform={`rotate(${a + 22})`} d={petal(15, 31, 10)} />
        ))}
        {ring(6).map((a) => (
          <path key={`i-${a}`} transform={`rotate(${a + 30})`} d={petal(4, 18, 8)} />
        ))}
        <circle cx="0" cy="0" r="3.5" />
      </g>
    </svg>
  );
}

/** Narrow petals, each with a dot — the "aster" from the sheet. */
export function Aster(props) {
  return (
    <svg viewBox="0 0 100 100" {...PEN} {...props}>
      <g transform="translate(50 36)">
        {ring(10).map((a) => (
          <g key={a} transform={`rotate(${a})`}>
            <ellipse cx="0" cy="-20" rx="4.5" ry="12" />
            <circle cx="0" cy="-24" r="1.4" />
          </g>
        ))}
        <circle cx="0" cy="0" r="8.5" />
        {ring(6).map((a) => (
          <circle key={a} cx="0" cy="-4.5" r="1.3" transform={`rotate(${a})`} />
        ))}
      </g>
      <Stem from={48} />
    </svg>
  );
}

/** Five wide petals with dot-tipped stamens reaching out of the centre. */
export function Cinquefoil(props) {
  return (
    <svg viewBox="0 0 100 100" {...PEN} {...props}>
      <g transform="translate(50 50)">
        {ring(5).map((a) => (
          <g key={a} transform={`rotate(${a})`}>
            <path d="M0 -10 C -16 -18, -20 -36, 0 -42 C 20 -36, 16 -18, 0 -10 Z" />
            <path d="M0 -12 L 0 -26" />
            <circle cx="0" cy="-28" r="2" />
          </g>
        ))}
        <circle cx="0" cy="0" r="9" />
      </g>
    </svg>
  );
}

/** Dense chrysanthemum: a double ring of short petals around a dotted eye. */
export function Chrysanthemum(props) {
  return (
    <svg viewBox="0 0 100 100" {...PEN} {...props}>
      <g transform="translate(50 50)">
        {ring(14).map((a) => (
          <path
            key={`outer-${a}`}
            transform={`rotate(${a})`}
            d="M0 -26 C -6 -30, -6 -40, 0 -44 C 6 -40, 6 -30, 0 -26 Z"
          />
        ))}
        {ring(12).map((a) => (
          <path
            key={`inner-${a}`}
            transform={`rotate(${a + 12})`}
            d="M0 -12 C -5 -16, -5 -24, 0 -27 C 5 -24, 5 -16, 0 -12 Z"
          />
        ))}
        <circle cx="0" cy="0" r="10" />
        {ring(7).map((a) => (
          <circle key={a} cx="0" cy="-5.5" r="1.3" transform={`rotate(${a})`} />
        ))}
      </g>
    </svg>
  );
}

/** Pointed-petal sunflower with a hatched eye, on a stem. */
export function Sunflower(props) {
  return (
    <svg viewBox="0 0 100 100" {...PEN} {...props}>
      <g transform="translate(50 34)">
        {ring(12).map((a) => (
          <path
            key={a}
            transform={`rotate(${a})`}
            d="M0 -12 C -8 -18, -8 -28, 0 -32 C 8 -28, 8 -18, 0 -12 Z"
          />
        ))}
        <circle cx="0" cy="0" r="11" />
        <path d="M-7 -4 L 7 -4 M -8 0 L 8 0 M -7 4 L 7 4" />
      </g>
      <Stem from={46} />
    </svg>
  );
}

/** Six narrow petals in a star, the way a lily is doodled. */
export function Star(props) {
  return (
    <svg viewBox="0 0 100 100" {...PEN} {...props}>
      <g transform="translate(50 36)">
        {ring(6).map((a) => (
          <path
            key={a}
            transform={`rotate(${a})`}
            d="M0 -6 C -9 -16, -7 -30, 0 -38 C 7 -30, 9 -16, 0 -6 Z"
          />
        ))}
        <circle cx="0" cy="0" r="5" />
      </g>
      <Stem from={42} />
    </svg>
  );
}

/** Three-lobed tulip cup between two long leaves. */
export function Tulip(props) {
  return (
    <svg viewBox="0 0 100 100" {...PEN} {...props}>
      <path d="M32 30 C 32 48, 39 58, 50 58 C 61 58, 68 48, 68 30" />
      <path d="M32 30 C 36 20, 40 16, 43 14 C 44 22, 47 28, 50 32" />
      <path d="M68 30 C 64 20, 60 16, 57 14 C 56 22, 53 28, 50 32" />
      <path d="M43 14 C 46 20, 48 26, 50 32 C 52 26, 54 20, 57 14" />
      <path d="M50 58 L 50 94" />
      <path d="M50 70 C 38 66, 28 72, 24 84 C 36 86, 46 80, 50 70 Z" />
      <path d="M50 78 C 62 74, 72 80, 76 92 C 64 94, 54 88, 50 78 Z" />
    </svg>
  );
}

export const DOODLES = [
  Daisy,
  Rosette,
  Aster,
  Cinquefoil,
  Chrysanthemum,
  Sunflower,
  Star,
  Tulip,
];
