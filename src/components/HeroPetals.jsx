import { motion, useReducedMotion } from 'framer-motion';

/**
 * Three petals drifting down across the hero. Deliberately slow and uneven —
 * the brand is hand-made, so the motion should read organic rather than timed.
 */
const PETALS = [
  { left: '18%', size: 26, duration: 23, delay: 0, drift: 40, spin: 160 },
  { left: '52%', size: 18, duration: 31, delay: 6, drift: -34, spin: -120 },
  { left: '78%', size: 22, duration: 27, delay: 13, drift: 26, spin: 200 },
];

export default function HeroPetals() {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {PETALS.map((petal, i) => (
        <motion.svg
          key={i}
          viewBox="0 0 24 24"
          width={petal.size}
          height={petal.size}
          className="absolute -top-12 text-white/25"
          style={{ left: petal.left }}
          initial={{ y: -60, x: 0, rotate: 0, opacity: 0 }}
          animate={{
            y: ['-10%', '115%'],
            x: [0, petal.drift, 0],
            rotate: [0, petal.spin],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: petal.duration,
            delay: petal.delay,
            repeat: Infinity,
            ease: 'linear',
            times: [0, 0.12, 0.85, 1],
            x: { duration: petal.duration / 2, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' },
          }}
        >
          {/* Single rose petal: teardrop with a soft notch at the tip. */}
          <path
            d="M12 2c4.2 2.6 6.5 6 6.5 9.6 0 3.9-2.9 7-6.5 10.4-3.6-3.4-6.5-6.5-6.5-10.4C5.5 8 7.8 4.6 12 2z"
            fill="currentColor"
          />
        </motion.svg>
      ))}
    </div>
  );
}
