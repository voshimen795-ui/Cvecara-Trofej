import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import ProductImage from './ui/ProductImage.jsx';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&w=1400&q=80';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Hero({ onSelectCategory }) {
  return (
    <section id="top" className="container-editorial py-12 lg:py-20">
      <div className="grid grid-cols-12 items-center gap-8">
        {/* Left column — editorial copy (5 of 12) */}
        <div className="col-span-12 lg:col-span-5">
          <motion.span
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mb-6 inline-flex items-center gap-2 rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-medium text-brand-primary"
          >
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Ručno komponovani buketi
          </motion.span>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.08}
            className="mb-6 font-serif text-4xl leading-tight text-brand-dark sm:text-5xl"
          >
            Cveće koje govori
            <br className="hidden sm:block" /> iz srca
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.16}
            className="mb-8 text-lg leading-relaxed text-gray-600"
          >
            Svakog jutra biramo najsvežije cveće sa pijace i komponujemo ga u bukete koji
            prenose ono što je teško reći. Dostavljamo na teritoriji Beograda, istog dana.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.24}
            className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"
          >
            <a
              href="#kolekcija"
              onClick={() => onSelectCategory?.('all')}
              className="btn-primary group"
            >
              Pogledaj kolekciju
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </a>

            <a href="#o-nama" className="btn-ghost">
              Buket po želji
            </a>
          </motion.div>
        </div>

        {/* Right column — hero visual (7 of 12) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative col-span-12 lg:col-span-7"
        >
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-gray-50 shadow-card">
            <ProductImage
              src={HERO_IMAGE}
              alt="Buket svežeg sezonskog cveća iz Cvećare Trofej"
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="h-full w-full object-cover"
            />
          </div>

          {/* Floating trust badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="absolute -bottom-4 left-4 flex items-center gap-3 rounded-2xl bg-brand-surface/95 px-4 py-3 shadow-card backdrop-blur-sm sm:-bottom-6 sm:left-6 sm:px-5 sm:py-4"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-rose/15">
              <Sparkles className="h-4 w-4 text-brand-rose" aria-hidden="true" />
            </span>
            <span className="text-sm font-medium text-brand-dark">
              Sveže cveće svakog dana
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
