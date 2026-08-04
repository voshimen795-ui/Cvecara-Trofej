import { Facebook, Instagram, Mail, MapPin, Phone } from 'lucide-react';
import { NAV_LINKS, SHOP } from '../data/shop.js';

const SOCIALS = [
  { label: 'Instagram', href: '#', icon: Instagram },
  { label: 'Facebook', href: '#', icon: Facebook },
];

export default function Footer({ onSelectCategory }) {
  return (
    <footer className="bg-brand-surface">
      <div className="container-editorial py-16 lg:py-20">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* 1 — Brand */}
          <div>
            <p className="font-serif text-base font-bold tracking-widest text-brand-dark">
              CVEĆARA TROFEJ
            </p>
            <p className="mt-4 text-sm leading-relaxed text-gray-600">
              Buketi, aranžmani i pokloni od svežeg cveća. Ručno komponovano u {SHOP.city}u,
              isporučeno istog dana.
            </p>

            <ul className="mt-6 flex gap-3">
              {SOCIALS.map(({ label, href, icon: Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    aria-label={label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-border text-brand-dark transition hover:border-brand-primary hover:text-brand-primary"
                  >
                    <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* 2 — Navigation */}
          <nav aria-label="Podnožje — navigacija">
            <h2 className="text-sm font-semibold text-brand-dark">Ponuda</h2>
            <ul className="mt-4 space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={() => link.category && onSelectCategory?.(link.category)}
                    className="text-sm text-gray-600 transition-colors hover:text-brand-primary"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* 3 — Working hours */}
          <div>
            <h2 className="text-sm font-semibold text-brand-dark">Radno vreme</h2>
            <dl className="mt-4 space-y-3 text-sm">
              {SHOP.hours.map(({ day, time }) => (
                <div key={day} className="flex flex-col gap-0.5">
                  <dt className="text-gray-600">{day}</dt>
                  <dd className="font-medium text-brand-dark tabular-nums">{time}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* 4 — Contact */}
          <div>
            <h2 className="text-sm font-semibold text-brand-dark">Kontakt</h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-start gap-2.5 text-gray-600">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" aria-hidden="true" />
                <span>
                  {SHOP.street}
                  <br />
                  {SHOP.city}
                </span>
              </li>
              <li>
                <a
                  href={SHOP.phoneHref}
                  className="flex items-center gap-2.5 text-gray-600 transition-colors hover:text-brand-primary"
                >
                  <Phone className="h-4 w-4 shrink-0 text-brand-primary" aria-hidden="true" />
                  {SHOP.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${SHOP.email}`}
                  className="flex items-center gap-2.5 break-all text-gray-600 transition-colors hover:text-brand-primary"
                >
                  <Mail className="h-4 w-4 shrink-0 text-brand-primary" aria-hidden="true" />
                  {SHOP.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-gray-100 pt-8 text-xs text-brand-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {SHOP.name}. Sva prava zadržana.
          </p>
          <p>{SHOP.deliveryArea}</p>
        </div>
      </div>
    </footer>
  );
}
