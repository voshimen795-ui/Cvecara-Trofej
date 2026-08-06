import { Link } from 'react-router-dom';
import { Facebook, Instagram, Mail, MapPin, Phone } from 'lucide-react';
import { HOURS_DISPLAY, NAV_LINKS, SHOP } from '../data/shop.js';
import { useI18n } from '../i18n/index.jsx';

const SOCIALS = [
  { label: 'Instagram', href: SHOP.instagram, icon: Instagram },
  { label: 'Facebook', href: SHOP.instagram, icon: Facebook },
];

export default function Footer() {
  const { t } = useI18n();

  return (
    // Teal-navy fading to the hero's deep teal — same family as the hero,
    // a shade deeper so the two bands read as distinct.
    <footer className="bg-gradient-to-b from-brand-forest to-brand-deep text-brand-light">
      <div className="container-editorial py-16 lg:py-20">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* 1 — Brand */}
          <div>
            <Link
              to="/"
              className="font-serif text-base font-bold tracking-widest text-white transition-colors hover:text-brand-teal"
            >
              CVEĆARA TROFEJ
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-brand-light/80">
              Buketi, aranžmani i pokloni od svežeg cveća. Ručno komponovano u {SHOP.city}u,
              isporučeno istog dana.
            </p>

            <ul className="mt-6 flex gap-3">
              {SOCIALS.map(({ label, href, icon: Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 text-white transition-all duration-200 hover:scale-110 hover:border-white/60 hover:bg-white/10"
                  >
                    <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* 2 — Navigation */}
          <nav aria-label="Podnožje — navigacija">
            <h2 className="text-sm font-semibold text-white">{t('footer.offer')}</h2>
            <ul className="mt-4 space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-brand-light/80 transition-colors hover:text-white"
                  >
                    {t(link.i18n)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* 3 — Working hours */}
          <div>
            <h2 className="text-sm font-semibold text-white">{t('footer.hours')}</h2>
            <dl className="mt-4 space-y-3 text-sm">
              {HOURS_DISPLAY.map(({ day, time }) => (
                <div key={day} className="flex flex-col gap-0.5">
                  <dt className="text-brand-light/70">{day}</dt>
                  <dd
                    className={`font-medium ${
                      time === 'Ne radimo' ? 'text-brand-light/60' : 'tabular-nums text-white'
                    }`}
                  >
                    {time}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* 4 — Contact */}
          <div>
            <h2 className="text-sm font-semibold text-white">{t('footer.contact')}</h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-start gap-2.5 text-brand-light/80">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-teal" aria-hidden="true" />
                <span>
                  {SHOP.street}
                  <br />
                  {SHOP.city}
                </span>
              </li>
              <li>
                <a
                  href={SHOP.phoneHref}
                  className="flex items-center gap-2.5 text-brand-light/80 transition-colors hover:text-white"
                >
                  <Phone className="h-4 w-4 shrink-0 text-brand-teal" aria-hidden="true" />
                  {SHOP.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${SHOP.email}`}
                  className="flex items-center gap-2.5 break-all text-brand-light/80 transition-colors hover:text-white"
                >
                  <Mail className="h-4 w-4 shrink-0 text-brand-teal" aria-hidden="true" />
                  {SHOP.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-white/[0.12] pt-8 text-xs text-brand-light/65 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {SHOP.name}. {t('footer.rights')}
          </p>
          <p>{SHOP.deliveryArea}</p>
        </div>
      </div>
    </footer>
  );
}
