import { useState } from 'react';
import { Clock, ExternalLink, MapPin, Phone } from 'lucide-react';
import { HOURS_DISPLAY, SHOP, SHOP_ADDRESS } from '../data/shop.js';

const query = encodeURIComponent(SHOP_ADDRESS);

// The `output=embed` form needs no API key. The link opens the full map.
const EMBED_SRC = `https://maps.google.com/maps?q=${query}&z=16&output=embed`;
const MAPS_LINK = `https://www.google.com/maps/search/?api=1&query=${query}`;

/**
 * Shop location. The iframe is blocked wherever a strict CSP forbids external
 * frames (the static preview, for one), so a card with the address, hours and
 * a link out is rendered underneath rather than a blank rectangle.
 */
export default function MapSection() {
  const [loaded, setLoaded] = useState(false);

  return (
    <section id="mapa" className="container-editorial scroll-mt-24 py-16 lg:py-24">
      <div className="text-center">
        <p className="eyebrow">Lokacija</p>
        <h2 className="mt-2 font-serif text-3xl text-brand-dark sm:text-4xl">Gde smo</h2>
        <p className="mx-auto mt-4 max-w-xl text-gray-600">
          Nalazimo se u {SHOP.street}. Svratite, ili poručite dostavu na bilo koju adresu u
          {' '}
          {SHOP.city}u.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-12 gap-6 lg:gap-8">
        <div className="col-span-12 lg:col-span-8">
          <div className="relative overflow-hidden rounded-3xl border border-brand-border bg-brand-mist">
            <div className="relative aspect-[16/10] w-full sm:aspect-[16/9]">
              {/* The placeholder sits behind the frame, and the frame stays
                  transparent until it actually loads. A blocked cross-origin
                  iframe (strict CSP, ad blocker, no network) neither fires an
                  error nor loads — but it still paints over whatever is under
                  it, so fading it in on load is what keeps this from being an
                  empty rectangle. */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
                <MapPin
                  className="h-8 w-8 text-brand-primary-dark"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                <p className="font-serif text-lg text-brand-dark">{SHOP.street}</p>
                <p className="text-sm text-gray-600">{SHOP.city}</p>
                <a
                  href={MAPS_LINK}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 text-sm font-medium text-brand-primary-dark underline"
                >
                  Otvori mapu
                </a>
              </div>

              <iframe
                title={`Mapa — ${SHOP.name}, ${SHOP_ADDRESS}`}
                src={EMBED_SRC}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                onLoad={() => setLoaded(true)}
                className={`absolute inset-0 h-full w-full border-0 transition-opacity duration-500 ${
                  loaded ? 'opacity-100' : 'pointer-events-none opacity-0'
                }`}
              />
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4">
          <div className="flex h-full flex-col justify-between rounded-3xl border border-brand-border bg-brand-surface p-6">
            <div>
              <h3 className="flex items-center gap-2 font-serif text-lg text-brand-dark">
                <MapPin className="h-4 w-4 text-brand-primary-dark" aria-hidden="true" />
                Adresa
              </h3>
              <address className="mt-2 not-italic text-sm leading-relaxed text-gray-600">
                {SHOP.street}
                <br />
                {SHOP.city}, Srbija
              </address>

              <h3 className="mt-6 flex items-center gap-2 font-serif text-lg text-brand-dark">
                <Clock className="h-4 w-4 text-brand-primary-dark" aria-hidden="true" />
                Radno vreme
              </h3>
              <dl className="mt-2 space-y-1.5 text-sm">
                {HOURS_DISPLAY.map(({ day, time }) => (
                  <div key={day} className="flex justify-between gap-3">
                    <dt className="text-gray-600">{day}</dt>
                    <dd
                      className={
                        time === 'Ne radimo'
                          ? 'text-brand-muted'
                          : 'font-medium tabular-nums text-brand-dark'
                      }
                    >
                      {time}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="mt-6 flex flex-col gap-2">
              <a href={SHOP.phoneHref} className="btn-primary w-full">
                <Phone className="h-4 w-4" aria-hidden="true" />
                {SHOP.phone}
              </a>
              <a
                href={MAPS_LINK}
                target="_blank"
                rel="noreferrer"
                className="btn-ghost w-full"
              >
                Otvori u Google Mapama
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
