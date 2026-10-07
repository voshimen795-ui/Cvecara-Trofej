import { Clock, HeartHandshake } from 'lucide-react';
import { SHOP } from '../data/shop.js';
import { useI18n } from '../i18n/index.jsx';

const PILLARS = [
  { icon: HeartHandshake, key: 'pillar2' },
  { icon: Clock, key: 'pillar3' },
];

export default function AboutSection() {
  const { t } = useI18n();

  return (
    <section id="o-nama" className="border-y border-gray-100 bg-brand-surface py-16 lg:py-24">
      <div className="container-editorial">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <p className="eyebrow">{t('about.eyebrow')}</p>
            <h2 className="mt-2 font-serif text-3xl leading-tight text-brand-dark sm:text-4xl">
              {t('about.title')}
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-gray-600">
              {t('about.lead', { street: SHOP.street })}
            </p>
          </div>

          <div className="lg:col-span-7">
            <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {PILLARS.map(({ icon: Icon, key }) => (
                <li key={key} className="rounded-2xl border border-gray-100 bg-brand-bg p-6">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-primary/10">
                    <Icon className="h-5 w-5 text-brand-primary" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 font-serif text-lg text-brand-dark">
                    {t(`about.${key}Title`)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    {t(`about.${key}Body`)}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
