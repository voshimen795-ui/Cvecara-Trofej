import { useMemo } from 'react';
import { useReducedMotion } from 'framer-motion';
import { DOODLES } from './ui/DoodleFlowers.jsx';
import { useBreakpoint } from '../hooks/useBreakpoint.js';

/**
 * Line-art blooms tumbling down behind the catalogue.
 *
 * Built as three nested transforms rather than one, because each axis wants
 * its own timing: the outer element falls at a constant rate, the middle one
 * sways side to side on a slower cycle, and the flower itself tumbles in 3D.
 * Composed that way no two petals ever repeat the same path, and every
 * animated property is a `transform`/`opacity`, so it all runs on the
 * compositor and never triggers layout.
 *
 * Depth is faked the way it reads to the eye: petals nearer the viewer are
 * bigger, darker and fall faster; distant ones are small, pale and slow.
 *
 * Colours are the brand's teal family only, at low opacity — this sits *under*
 * the catalogue and must never compete with a photograph of a bouquet.
 *
 * The near-blacks were dropped after measuring rather than eyeballing: a
 * #0F2726 stroke at full strength tints the page enough to take gray-600 body
 * copy down to 3.67:1, under the 4.5:1 floor. The teals bottom out at 4.75:1.
 * Small `brand-muted` text has almost no headroom to begin with (4.63:1 on the
 * bare background), so the few places where it sits straight on the page carry
 * their own opaque `bg-brand-bg` and no petal ever crosses them.
 */

// Deterministic pseudo-random: same layout on every render and every reload,
// so the field never re-shuffles when React re-renders the page.
function random(seed) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

const TONES = ['text-brand-primary', 'text-brand-teal', 'text-brand-primary-dark'];

function build(count) {
  return Array.from({ length: count }, (_, i) => {
    const r = (n) => random(i * 7 + n);
    // Depth 0 = far away, 1 = close to the viewer.
    const depth = r(1);

    return {
      Flower: DOODLES[i % DOODLES.length],
      tone: TONES[Math.floor(r(2) * TONES.length)],
      left: `${(r(3) * 104 - 2).toFixed(2)}%`,
      size: 38 + depth * 66,
      opacity: (0.13 + depth * 0.19).toFixed(3),
      // Close petals fall in ~13 s, distant ones take almost half a minute.
      fall: (28 - depth * 15).toFixed(1),
      delay: (-r(4) * 26).toFixed(1),
      sway: (7 + r(5) * 7).toFixed(1),
      drift: `${(r(6) * 90 - 45).toFixed(0)}px`,
      spin: (11 + r(7) * 14).toFixed(1),
      // Amplitudes, not full turns — see the note on `petal-spin` in index.css.
      tiltX: `${(26 + r(8) * 34).toFixed(0)}deg`,
      tiltY: `${(26 + r(9) * 38).toFixed(0)}deg`,
      reverse: r(10) > 0.5,
    };
  });
}

export default function PetalRain({ className = '' }) {
  const reduceMotion = useReducedMotion();
  const breakpoint = useBreakpoint();
  const count = breakpoint === 'mobile' ? 9 : breakpoint === 'tablet' ? 13 : 18;

  const petals = useMemo(() => build(count), [count]);

  // Not a decorative-only opt-out: a page of tumbling shapes is exactly what
  // "prefers-reduced-motion" is asking us not to render.
  if (reduceMotion) return null;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden [perspective:900px] ${className}`}
    >
      {petals.map((petal, i) => (
        <div
          key={i}
          className="petal-fall absolute top-0"
          style={{
            left: petal.left,
            animationDuration: `${petal.fall}s`,
            animationDelay: `${petal.delay}s`,
          }}
        >
          <div
            className="petal-sway"
            style={{
              animationDuration: `${petal.sway}s`,
              ['--petal-drift']: petal.drift,
            }}
          >
            <div
              className={`petal-spin ${petal.tone}`}
              style={{
                width: `${petal.size}px`,
                height: `${petal.size}px`,
                opacity: petal.opacity,
                animationDuration: `${petal.spin}s`,
                animationDirection: petal.reverse ? 'reverse' : 'normal',
                ['--petal-ax']: petal.tiltX,
                ['--petal-ay']: petal.tiltY,
              }}
            >
              <petal.Flower className="h-full w-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
