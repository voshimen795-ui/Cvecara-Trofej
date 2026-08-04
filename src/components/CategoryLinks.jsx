import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  BalloonMark,
  BouquetMark,
  GiftMark,
  TeddyMark,
  VaseMark,
} from './ui/CategoryIcons.jsx';

/**
 * Each tile stays inside the teal-to-navy spectrum, varying the angle and the
 * stops so the row reads as one family without five identical rectangles.
 * Gradients are sized 200% and shifted on hover, so the colour travels.
 *
 * No stop is lighter than #3E7D76: white copy sits on these, and the brand's
 * lighter teals (#55B5B3, #4A9B9B) only reach 2.4-3.3:1 behind it. Variety
 * comes from the angle and the dark end instead of the light end.
 */
const TILES = [
  {
    to: '/buketi',
    label: 'Buketi',
    Mark: BouquetMark,
    gradient: 'bg-[linear-gradient(135deg,#3E7D76_0%,#2F5F58_55%,#12332F_100%)]',
  },
  {
    to: '/aranzmani',
    label: 'Aranžmani',
    Mark: VaseMark,
    gradient: 'bg-[linear-gradient(160deg,#35706A_0%,#24504A_55%,#0F2726_100%)]',
  },
  {
    to: '/pokloni',
    label: 'Pokloni i Dekoracije',
    Mark: GiftMark,
    // The one gold-touched tile — enough to break the run without leaving the palette.
    gradient: 'bg-[linear-gradient(120deg,#3D7A73_0%,#2F5F58_45%,#6E5F2C_86%,#7E6B2F_100%)]',
  },
  {
    to: '/plisane-igracke',
    label: 'Plišane Igračke',
    Mark: TeddyMark,
    gradient: 'bg-[linear-gradient(200deg,#39746D_0%,#2A574F_50%,#143430_100%)]',
  },
  {
    to: '/baloni',
    label: 'Baloni',
    Mark: BalloonMark,
    gradient: 'bg-[linear-gradient(145deg,#3E7D76_0%,#276059_50%,#0F2726_100%)]',
  },
];

export default function CategoryLinks() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="container-editorial py-20 lg:py-28">
      <div className="text-center">
        <p className="eyebrow">Kolekcija</p>
        <h2 className="mt-2 font-serif text-3xl text-brand-dark sm:text-4xl">
          Istražite po kategoriji
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-gray-600">
          Od buketa do balona — sve što šaljemo, na jednom mestu.
        </p>
      </div>

      {/* Grid on desktop, a snapping scroll rail on phones. */}
      <ul className="no-scrollbar -mx-4 mt-12 flex snap-x gap-4 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 lg:grid-cols-5 lg:gap-6">
        {TILES.map(({ to, label, Mark, gradient }) => (
          <li key={to} className="w-40 shrink-0 snap-start sm:w-auto">
            <motion.div
              whileHover={reduceMotion ? undefined : { scale: 1.05 }}
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="h-full"
            >
              <Link
                to={to}
                className={`group flex h-full flex-col items-center justify-center gap-4 rounded-3xl px-5 py-9 text-center shadow-md ring-1 ring-black/5 transition-[background-position,box-shadow] duration-500 hover:shadow-xl ${gradient} bg-[length:200%_200%] bg-[position:0%_50%] hover:bg-[position:100%_50%]`}
              >
                <motion.span
                  className="text-white"
                  whileHover={reduceMotion ? undefined : { y: [-0, -7, 0], rotate: [0, -8, 0] }}
                  transition={{ duration: 0.6, ease: 'easeInOut' }}
                >
                  <Mark className="h-14 w-14" />
                </motion.span>

                <span className="font-serif text-base font-semibold leading-snug text-white">
                  {label}
                </span>
              </Link>
            </motion.div>
          </li>
        ))}
      </ul>
    </section>
  );
}
