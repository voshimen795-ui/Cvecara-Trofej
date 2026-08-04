import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import ProductImage from './ui/ProductImage.jsx';
import HeroPetals from './HeroPetals.jsx';
import logoBadge from '../assets/logo-trofej.png';
import logoFlower from '../assets/logo-flower.png';
import logoHeart from '../assets/logo-heart.png';
import heroBouquet from '../assets/hero-bouquet.jpg';
import heroBackdrop from '../assets/hero-bg-duotone.jpg';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Hero({ onSelectCategory }) {
  const reduceMotion = useReducedMotion();

  return (
    <section id="top" className="relative isolate overflow-hidden bg-brand-deep">
      {/* Layer 1 — blurred, teal-duotoned bouquet with a slow Ken Burns drift. */}
      <motion.div
        className="absolute inset-0 -z-30"
        initial={{ scale: 1.04 }}
        animate={reduceMotion ? { scale: 1.04 } : { scale: [1.04, 1.16, 1.04], x: [0, -14, 0] }}
        transition={{ duration: 38, repeat: Infinity, ease: 'easeInOut' }}
      >
        <img
          src={heroBackdrop}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover"
        />
      </motion.div>

      {/* Layer 2 — scrim. Carries the headline's contrast, heaviest behind the copy. */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-r from-brand-deep/95 via-brand-deep/80 to-brand-deep/45" />
      <div className="absolute inset-0 -z-20 bg-brand-primary/15 mix-blend-overlay" />

      {/* Layer 3 — the logo's own line-art bloom, enlarged as a watermark. */}
      <img
        src={logoFlower}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-10 -z-10 hidden w-[34rem] opacity-[0.10] lg:block"
      />

      <HeroPetals />

      {/* Layer 4 — dashed frame echoing the logo's dashed ring. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-3 rounded-[1.75rem] border border-dashed border-white/25 sm:inset-5"
      />

      <div className="container-editorial relative py-16 lg:py-24">
        <div className="grid grid-cols-12 items-center gap-8 lg:gap-12">
          {/* Left column — copy (5 of 12) */}
          <div className="col-span-12 lg:col-span-5">
            <motion.span
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-dashed border-white/45 bg-white/10 px-4 py-1.5 text-xs font-medium text-white backdrop-blur-sm"
            >
              Ručno komponovani buketi
            </motion.span>

            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.08}
              className="text-balance font-serif text-white"
            >
              <span className="block text-3xl font-bold uppercase leading-[1.1] tracking-[0.01em] sm:text-[2.75rem]">
                Cveće koje govori
              </span>
              <span className="mt-1 block font-script text-5xl font-bold leading-[1.05] text-brand-teal sm:text-6xl">
                iz srca
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
              className="mb-8 max-w-md text-lg leading-relaxed text-white/85"
            >
              Svakog jutra biramo najsvežije cveće sa pijace i komponujemo ga u bukete koji
              prenose ono što je teško reći. Dostavljamo na teritoriji Beograda, istog dana.
            </motion.p>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.3}
              className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"
            >
              <a
                href="#kolekcija"
                onClick={() => onSelectCategory?.('all')}
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 font-medium text-brand-deep transition hover:bg-white/90"
              >
                Pogledaj kolekciju
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </a>

              <a
                href="#o-nama"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-dashed border-white/60 px-8 py-4 font-medium text-white transition hover:border-white hover:bg-white/10"
              >
                Buket po želji
              </a>
            </motion.div>
          </div>

          {/* Right column — visual (7 of 12) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative col-span-12 lg:col-span-7"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-brand-deep/40 shadow-card ring-1 ring-white/15">
              <ProductImage
                src={heroBouquet}
                alt="Buket svežeg sezonskog cveća iz Cvećare Trofej"
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="h-full w-full object-cover"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-3 rounded-[1.25rem] border border-dashed border-white/30"
              />
            </div>

            {/* The logo itself, overlapping the card — the hero grows out of the mark. */}
            <motion.img
              initial={{ opacity: 0, scale: 0.85, rotate: -8 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
              src={logoBadge}
              alt="Cvećara Trofej"
              className="absolute left-3 -top-7 w-24 drop-shadow-xl sm:-left-6 sm:-top-8 sm:w-32 lg:w-36"
            />

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="absolute -bottom-4 right-4 flex items-center gap-2.5 rounded-2xl bg-white/95 px-4 py-3 shadow-card backdrop-blur-sm sm:-bottom-5 sm:right-6"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-brand-rose" aria-hidden="true" />
              <span className="text-sm font-medium text-brand-dark">
                Sveže cveće svakog dana
              </span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
