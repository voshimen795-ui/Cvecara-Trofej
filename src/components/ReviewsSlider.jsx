import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { ExternalLink, Languages, Quote, Star } from 'lucide-react';
import { GOOGLE, REVIEWS } from '../data/reviews.js';
import { useI18n } from '../i18n/index.jsx';

const initials = (name) =>
  name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

/** Deterministic tint per author, so a card's colour never changes on re-render. */
const TINTS = [
  'bg-brand-primary/15 text-brand-primary-dark',
  'bg-brand-rose/20 text-brand-dark',
  'bg-brand-teal/20 text-brand-primary-dark',
  'bg-brand-mist text-brand-primary-dark',
];

function Stars({ rating, label }) {
  return (
    <span className="flex gap-0.5" aria-label={label}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${
            i < rating ? 'fill-brand-rose text-brand-rose' : 'text-brand-border'
          }`}
          aria-hidden="true"
        />
      ))}
    </span>
  );
}

function Card({ review, index }) {
  const { t } = useI18n();

  return (
    <figure className="flex w-[19rem] shrink-0 flex-col rounded-3xl border border-brand-border bg-brand-surface p-6 shadow-sm sm:w-[22rem]">
      <Quote className="h-6 w-6 text-brand-primary/40" aria-hidden="true" />
      <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-gray-700">
        {t(`reviews.items.${review.id}`)}
      </blockquote>

      <figcaption className="mt-5 flex items-center gap-3 border-t border-brand-border/70 pt-4">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
            TINTS[index % TINTS.length]
          }`}
          aria-hidden="true"
        >
          {initials(review.author)}
        </span>
        <span className="min-w-0">
          <span className="block truncate font-medium text-brand-dark">{review.author}</span>
          <span className="mt-0.5 flex items-center gap-2">
            <Stars rating={review.rating} label={t('reviews.stars', { n: review.rating })} />
            <span className="text-xs text-brand-muted">{t(`reviews.when.${review.when}`)}</span>
          </span>
        </span>
      </figcaption>
    </figure>
  );
}

/**
 * Continuous marquee. The list is rendered twice and the track translates by
 * exactly half its width, so the loop point is seamless. Hovering or focusing
 * pauses it, and it can still be dragged/scrolled by hand.
 */
export default function ReviewsSlider() {
  const reduceMotion = useReducedMotion();
  const { locale, t } = useI18n();
  const [paused, setPaused] = useState(false);
  const trackRef = useRef(null);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const measure = () => {
      if (trackRef.current) setDistance(trackRef.current.scrollWidth / 2);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
    // Translated cards are a different length, so the loop distance has to be
    // re-measured on a language change or the marquee jumps at the seam.
  }, [locale]);

  // ~55px/s reads as unhurried at any list length.
  const duration = distance ? distance / 55 : 40;
  const animate = !reduceMotion && distance > 0;

  return (
    <section id="recenzije" className="scroll-mt-24 overflow-hidden bg-brand-mist/50 py-16 lg:py-24">
      <div className="container-editorial text-center">
        <p className="eyebrow">{t('reviews.eyebrow')}</p>
        <h2 className="mt-2 font-serif text-3xl text-brand-dark sm:text-4xl">
          {t('reviews.title')}
        </h2>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
          <span className="flex items-center gap-2">
            <span className="text-3xl font-bold tabular-nums text-brand-dark">
              {GOOGLE.rating.toFixed(2)}
            </span>
            <Stars rating={5} label={t('reviews.stars', { n: 5 })} />
          </span>
          <a
            href={GOOGLE.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-primary-dark hover:underline"
          >
            {t('reviews.onGoogle', { n: GOOGLE.count })}
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>

        {/* Said out loud rather than left implicit: these are real customers'
            words, and away from Serbian what you read is our translation of
            them, not the review as it was written. */}
        {locale !== 'sr' && (
          <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-brand-muted">
            <Languages className="h-3.5 w-3.5" aria-hidden="true" />
            {t('reviews.translated')}
          </p>
        )}
      </div>

      {/* Edges fade so cards enter and leave instead of being cut off. */}
      <div className="relative mt-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-brand-mist/50 to-transparent sm:w-24"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-brand-mist/50 to-transparent sm:w-24"
        />

        <div
          className="no-scrollbar overflow-x-auto"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          <div
            ref={trackRef}
            className="flex w-max gap-5 px-5"
            style={
              animate
                ? {
                    animation: `reviews-marquee ${duration}s linear infinite`,
                    animationPlayState: paused ? 'paused' : 'running',
                    ['--marquee-distance']: `-${distance}px`,
                  }
                : undefined
            }
          >
            {REVIEWS.map((review, i) => (
              <Card key={review.id} review={review} index={i} />
            ))}
            {/* Duplicate pass — the loop resets here, invisibly. */}
            {REVIEWS.map((review, i) => (
              <Card key={`${review.id}-loop`} review={review} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
