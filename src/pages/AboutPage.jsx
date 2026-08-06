import { Link } from 'react-router-dom';
import { ChevronRight, Mail, MapPin, Phone } from 'lucide-react';
import AboutSection from '../components/AboutSection.jsx';
import MapSection from '../components/MapSection.jsx';
import { HOURS_DISPLAY, SHOP } from '../data/shop.js';

export default function AboutPage() {
  return (
    <>
      <header className="relative isolate overflow-hidden bg-brand-deep">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(70%_60%_at_50%_0%,rgba(85,181,179,0.25),transparent_70%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-3 rounded-[1.5rem] border border-dashed border-white/20 sm:inset-5"
        />

        <div className="container-editorial relative py-14 text-center sm:py-20">
          <nav aria-label="Putanja" className="mb-6 flex justify-center">
            <ol className="flex items-center gap-1.5 text-xs text-white/60">
              <li>
                <Link to="/" className="transition-colors hover:text-white">
                  Početna
                </Link>
              </li>
              <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
              <li aria-current="page" className="text-white">
                O nama
              </li>
            </ol>
          </nav>

          <h1 className="font-serif text-3xl font-bold uppercase tracking-[0.01em] text-white sm:text-5xl">
            Buket po želji
          </h1>
          <p className="mx-auto mt-5 max-w-xl font-serif text-lg italic text-white/75">
            Recite nam priliku i budžet — ostalo je na nama.
          </p>
        </div>
      </header>

      <AboutSection />
      <MapSection />

      <section className="container-editorial py-14 lg:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">Kontakt</p>
          <h2 className="mt-2 font-serif text-3xl text-brand-dark">Javite nam se</h2>
          <p className="mx-auto mt-4 max-w-xl text-gray-600">
            Porudžbine primamo telefonom i u radnji. Radimo{' '}
            {HOURS_DISPLAY[0].day.toLowerCase()} {HOURS_DISPLAY[0].time}, subotom{' '}
            {HOURS_DISPLAY[1].time}. Nedeljom ne radimo.
          </p>

          <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { icon: Phone, label: SHOP.phone, href: SHOP.phoneHref },
              { icon: Mail, label: SHOP.email, href: `mailto:${SHOP.email}` },
              { icon: MapPin, label: `${SHOP.street}, ${SHOP.city}`, href: null },
            ].map(({ icon: Icon, label, href }) => {
              const body = (
                <>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-primary/10">
                    <Icon className="h-5 w-5 text-brand-primary" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <span className="mt-3 block break-words text-sm text-brand-dark">{label}</span>
                </>
              );
              return (
                <li
                  key={label}
                  className="flex flex-col items-center rounded-2xl border border-gray-100 bg-brand-surface p-6"
                >
                  {href ? (
                    <a href={href} className="flex flex-col items-center transition hover:text-brand-primary">
                      {body}
                    </a>
                  ) : (
                    body
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </>
  );
}
