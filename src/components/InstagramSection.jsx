import { Instagram } from 'lucide-react';
import { SHOP } from '../data/shop.js';
import { Bloom, Bud, Eucalyptus, Sprig } from './ui/Botanical.jsx';
import { useI18n } from '../i18n/index.jsx';

const MARKS = [Sprig, Bloom, Eucalyptus, Bud];

/**
 * Instagram invitation rather than an embedded feed: the official embed needs
 * a Meta app and a long-lived token, and third-party widget scripts want
 * payment plus a script tag on every page. A link costs nothing and never
 * breaks. Swap in the Basic Display API here when there's an app to point at.
 */
export default function InstagramSection() {
  const { t } = useI18n();

  return (
    <section className="container-editorial py-16 lg:py-24">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-forest via-brand-primary-darker to-brand-deep px-6 py-14 text-center sm:px-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex items-center justify-between px-4 text-white opacity-[0.12] sm:px-10"
        >
          {MARKS.map((Mark, i) => (
            <Mark key={i} className={`h-24 w-24 sm:h-32 sm:w-32 ${i % 2 ? 'translate-y-6' : ''}`} />
          ))}
        </div>

        <div className="relative">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
            <Instagram className="h-7 w-7 text-white" strokeWidth={1.75} aria-hidden="true" />
          </span>

          <h2 className="mt-6 font-serif text-3xl text-white sm:text-4xl">
            {t('instagram.title')}
          </h2>
          <p className="mx-auto mt-4 max-w-lg font-serif text-lg italic text-brand-light/80">
            {t('instagram.lead')}
          </p>

          <a
            href={SHOP.instagram}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 font-semibold text-brand-dark transition hover:bg-brand-mist"
          >
            <Instagram className="h-4 w-4" aria-hidden="true" />
            {SHOP.instagramHandle}
          </a>
        </div>
      </div>
    </section>
  );
}
