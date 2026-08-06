import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import HeroPetals from './HeroPetals.jsx';
import { Bloom, Bud, Eucalyptus, Sprig } from './ui/Botanical.jsx';
import logoHeart from '../assets/logo-heart.png';
import { useI18n } from '../i18n/index.jsx';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
  }),
};

/**
 * Botanicals scattered around the copy. Offsets are deliberately unequal and
 * the float cycles are co-prime-ish, so the four never bob in unison.
 */
const BOTANICALS = [
  {
    Shape: Sprig,
    className: 'left-[3%] top-6 w-28 opacity-[0.18] sm:w-36 lg:left-[7%] lg:top-10 lg:w-44',
    range: 14,
    duration: 5.4,
    delay: 0,
  },
  {
    Shape: Bloom,
    className:
      'right-[4%] top-10 hidden w-24 opacity-[0.14] sm:block sm:w-32 lg:right-[9%] lg:w-40',
    range: -11,
    duration: 6.2,
    delay: 1.1,
  },
  {
    Shape: Eucalyptus,
    className:
      // On phones it sits low and half off-frame so it clears the stacked CTAs.
      'bottom-5 -right-3 w-20 opacity-[0.16] sm:bottom-8 sm:right-[6%] sm:w-32 lg:bottom-12 lg:right-[13%] lg:w-36',
    range: 12,
    duration: 4.6,
    delay: 2.3,
  },
  {
    Shape: Bud,
    className:
      'bottom-10 left-[7%] hidden w-16 opacity-[0.13] sm:block sm:w-20 lg:bottom-16 lg:left-[15%] lg:w-24',
    range: -9,
    duration: 5.9,
    delay: 3.4,
  },
];

export default function Hero() {
  const reduceMotion = useReducedMotion();
  const { t } = useI18n();

  return (
    <section id="top" className="relative isolate overflow-hidden bg-brand-deep">
      {/* Layer 1 — living teal-to-forest gradient. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-30 animate-gradient-drift bg-[linear-gradient(125deg,#0A2321_0%,#123B37_22%,#0E3038_44%,#15413A_66%,#0D2A2A_84%,#0A2321_100%)] bg-[length:300%_300%] motion-reduce:animate-none"
      />
      {/* Layer 2 — soft teal bloom of light, drifting against the gradient. */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-[radial-gradient(60%_55%_at_50%_38%,rgba(85,181,179,0.22),transparent_70%)]"
        animate={reduceMotion ? undefined : { opacity: [0.65, 1, 0.65], scale: [1, 1.08, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Layer 3 — line-art botanicals, each floating on its own cycle. */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        {BOTANICALS.map(({ Shape, className, range, duration, delay }, i) => (
          <motion.div
            key={i}
            className={`absolute text-white ${className}`}
            animate={reduceMotion ? undefined : { y: [0, range, 0] }}
            transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Shape className="h-auto w-full" />
          </motion.div>
        ))}
      </div>

      <HeroPetals />

      {/* Layer 4 — dashed frame echoing the logo's dashed ring. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-3 rounded-[1.75rem] border border-dashed border-white/25 sm:inset-5"
      />

      <div className="container-editorial relative py-20 sm:py-24 lg:py-32">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <motion.span
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center gap-2 rounded-full border border-dashed border-white/45 bg-white/10 px-4 py-1.5 text-xs font-medium text-white backdrop-blur-sm"
          >
            {t('hero.badge')}
          </motion.span>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.08}
            className="mt-7 text-balance font-serif text-white"
          >
            <span className="block text-3xl font-bold uppercase leading-[1.1] tracking-[0.01em] sm:text-5xl lg:text-[3.5rem]">
              {t('hero.line1')}
            </span>
            <span className="mt-1 block font-script text-5xl font-bold leading-[1.05] text-brand-teal sm:text-6xl lg:text-7xl">
              {t('hero.line2')}
            </span>
          </motion.h1>

          {/* Heart divider lifted straight from the logo. */}
          <motion.img
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.16}
            src={logoHeart}
            alt=""
            aria-hidden="true"
            className="my-7 h-7 w-auto opacity-90"
          />

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.22}
            className="font-serif text-lg italic leading-relaxed text-white/75 sm:text-xl"
          >
            {t('hero.tagline')}
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.3}
            className="mt-10 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row sm:gap-4"
          >
            <Link
              to="/buketi"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 font-medium text-brand-deep transition hover:bg-white/90 sm:w-auto"
            >
              {t('hero.cta')}
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>

            <Link
              to="/o-nama"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/60 px-8 py-4 font-medium text-white transition hover:border-white hover:bg-white/10 sm:w-auto"
            >
              {t('hero.custom')}
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
