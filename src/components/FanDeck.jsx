import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ProductImage from './ui/ProductImage.jsx';
import { FEATURED } from '../data/products.js';
import { formatPrice } from '../utils/format.js';
import { useBreakpoint } from '../hooks/useBreakpoint.js';

/**
 * Fan geometry per breakpoint. `slots` is how many cards are dealt; each slot
 * gets an angle, an x offset and a lift, mirrored around the upright centre.
 */
// `spread` is half the fan's width. Adjacent cards must stay far enough apart
// that each one's name and price strip is still legible under its neighbour.
const LAYOUT = {
  desktop: { slots: 5, spread: 232, angle: 15, drop: 30, card: 'w-56' },
  tablet: { slots: 5, spread: 150, angle: 11, drop: 22, card: 'w-40' },
  mobile: { slots: 3, spread: 88, angle: 8, drop: 14, card: 'w-36' },
};

// Botanical tile built from the logo's own line-art bloom — the brand's
// texture rather than a plain gradient behind the deck.
const PATTERN = "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22180%22%20height%3D%22180%22%20viewBox%3D%220%200%20180%20180%22%3E%20%3Cg%20fill%3D%22none%22%20stroke%3D%22%23ffffff%22%20stroke-width%3D%221.1%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20opacity%3D%220.55%22%3E%20%3Cg%20transform%3D%22translate%2845%2045%29%22%3E%20%3Cpath%20d%3D%22M0%20-7%20C-11%20-15%2C%20-13%20-30%2C%200%20-38%20C13%20-30%2C%2011%20-15%2C%200%20-7%20Z%22%2F%3E%20%3Cg%20transform%3D%22rotate%2872%29%22%3E%3Cpath%20d%3D%22M0%20-7%20C-11%20-15%2C%20-13%20-30%2C%200%20-38%20C13%20-30%2C%2011%20-15%2C%200%20-7%20Z%22%2F%3E%3C%2Fg%3E%20%3Cg%20transform%3D%22rotate%28144%29%22%3E%3Cpath%20d%3D%22M0%20-7%20C-11%20-15%2C%20-13%20-30%2C%200%20-38%20C13%20-30%2C%2011%20-15%2C%200%20-7%20Z%22%2F%3E%3C%2Fg%3E%20%3Cg%20transform%3D%22rotate%28216%29%22%3E%3Cpath%20d%3D%22M0%20-7%20C-11%20-15%2C%20-13%20-30%2C%200%20-38%20C13%20-30%2C%2011%20-15%2C%200%20-7%20Z%22%2F%3E%3C%2Fg%3E%20%3Cg%20transform%3D%22rotate%28288%29%22%3E%3Cpath%20d%3D%22M0%20-7%20C-11%20-15%2C%20-13%20-30%2C%200%20-38%20C13%20-30%2C%2011%20-15%2C%200%20-7%20Z%22%2F%3E%3C%2Fg%3E%20%3Ccircle%20cx%3D%220%22%20cy%3D%220%22%20r%3D%223.5%22%2F%3E%20%3C%2Fg%3E%20%3Cg%20transform%3D%22translate%28135%20135%29%22%3E%20%3Cpath%20d%3D%22M0%2026%20C4%2012%2C%2010%202%2C%2018%20-8%22%2F%3E%20%3Cellipse%20cx%3D%226%22%20cy%3D%2212%22%20rx%3D%228%22%20ry%3D%224.5%22%20transform%3D%22rotate%28-35%206%2012%29%22%2F%3E%20%3Cellipse%20cx%3D%2212%22%20cy%3D%222%22%20rx%3D%228%22%20ry%3D%224.5%22%20transform%3D%22rotate%28-40%2012%202%29%22%2F%3E%20%3Cellipse%20cx%3D%22-2%22%20cy%3D%2218%22%20rx%3D%227%22%20ry%3D%224%22%20transform%3D%22rotate%2820%20-2%2018%29%22%2F%3E%20%3C%2Fg%3E%20%3Cg%20transform%3D%22translate%28135%2040%29%22%3E%3Cellipse%20cx%3D%220%22%20cy%3D%220%22%20rx%3D%229%22%20ry%3D%225%22%20transform%3D%22rotate%28-25%29%22%2F%3E%3Cpath%20d%3D%22M-9%203%20L10%20-4%22%2F%3E%3C%2Fg%3E%20%3Cg%20transform%3D%22translate%2842%20138%29%22%3E%3Cellipse%20cx%3D%220%22%20cy%3D%220%22%20rx%3D%229%22%20ry%3D%225%22%20transform%3D%22rotate%2835%29%22%2F%3E%3Cpath%20d%3D%22M-9%20-3%20L10%204%22%2F%3E%3C%2Fg%3E%20%3C%2Fg%3E%3C%2Fsvg%3E";

const SHUFFLE_MS = 2800;
const STAGGER_MS = 240;
// Coprime with FEATURED.length, so every slot changes on each tick and the
// deck works through all combinations instead of flipping between two deals.
const SHUFFLE_STEP = 3;

/** Position for slot `i` of `n`: -1 at the far left, 0 centre, +1 far right. */
function place(i, n, cfg) {
  const t = n === 1 ? 0 : (i / (n - 1)) * 2 - 1;
  return {
    rotate: t * cfg.angle,
    x: t * cfg.spread,
    // Centre card sits highest, outer cards drop away.
    y: Math.abs(t) * cfg.drop - 10,
    zIndex: n - Math.round(Math.abs(t) * n),
  };
}

export default function FanDeck() {
  const breakpoint = useBreakpoint();
  const reduceMotion = useReducedMotion();
  const cfg = LAYOUT[breakpoint];
  const slots = Math.min(cfg.slots, FEATURED.length);

  const [offset, setOffset] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef(null);

  // The deck deals FEATURED in a loop; advancing the offset re-deals every
  // slot at once, and the per-slot delay below turns that into a ripple.
  useEffect(() => {
    if (paused || reduceMotion) return undefined;
    timer.current = setInterval(() => setOffset((o) => o + SHUFFLE_STEP), SHUFFLE_MS);
    return () => clearInterval(timer.current);
  }, [paused, reduceMotion]);

  return (
    <section className="relative isolate overflow-hidden bg-brand-forest py-20 lg:py-28">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-[0.13]"
        style={{ backgroundImage: `url("${PATTERN}")`, backgroundSize: '180px 180px' }}
      />
      {/* Vignette keeps the pattern off the cards, so it reads as texture. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(60%_55%_at_50%_45%,rgba(26,61,58,0.92),rgba(26,61,58,0.35))]"
      />

      <div className="container-editorial">
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-wider text-brand-teal">
            Istaknuto
          </p>
          <h2 className="mt-2 font-serif text-3xl text-white sm:text-4xl">Naši favoriti</h2>
          <p className="mx-auto mt-4 max-w-md font-serif text-base italic text-brand-light/75">
            Buketi koji najčešće odlaze iz radnje.
          </p>
        </div>

        {/* perspective on the parent gives the fan its depth */}
        <div
          className="relative mx-auto mt-14 flex h-[26rem] items-center justify-center sm:h-[24rem] lg:h-[28rem]"
          style={{ perspective: '1400px' }}
          // Pause/resume both live on the container. Putting the pause on the
          // cards breaks it: a hovered card lifts and changes z-index, so the
          // pointer keeps leaving and re-entering individual cards.
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          {Array.from({ length: slots }).map((_, slot) => {
            const pos = place(slot, slots, cfg);
            const product = FEATURED[(offset + slot) % FEATURED.length];

            return (
              <motion.div
                key={slot}
                className="absolute"
                style={{ zIndex: pos.zIndex, transformStyle: 'preserve-3d' }}
                initial={false}
                animate={{ rotate: pos.rotate, x: pos.x, y: pos.y }}
                transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                whileHover={reduceMotion ? undefined : { y: pos.y - 10 }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, rotateY: -38 }}
                    animate={{ opacity: 1, rotateY: 0 }}
                    exit={{ opacity: 0, rotateY: 38 }}
                    transition={{
                      duration: 0.45,
                      delay: (slot * STAGGER_MS) / 1000,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <Link
                      to={`/proizvod/${product.id}`}
                      className="group block overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-white/20 transition-shadow duration-300 hover:shadow-2xl hover:ring-brand-teal/50"
                    >
                      <div
                        className={`${cfg.card} aspect-[3/4] bg-gradient-to-b from-brand-mist to-white`}
                      >
                        <ProductImage
                          src={product.image}
                          alt={product.name}
                          category={product.category}
                          className="h-full w-full object-contain p-3"
                        />
                      </div>

                      <div className="border-t border-brand-border/60 bg-white px-3 py-2.5">
                        <p className="truncate font-serif text-sm text-brand-dark">
                          {product.name}
                        </p>
                        <p className="mt-0.5 text-sm font-bold text-brand-primary-dark">
                          {formatPrice(product.price)}
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/buketi"
            className="group inline-flex items-center justify-center gap-2 rounded-xl border border-dashed border-white/50 px-8 py-4 font-medium text-white transition hover:border-white hover:bg-white/10"
          >
            Pogledaj sve bukete
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
