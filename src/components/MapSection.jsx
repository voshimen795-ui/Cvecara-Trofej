import { Clock, ExternalLink, MapPin, Navigation, Phone } from 'lucide-react';
import { HOURS_DISPLAY, SHOP, SHOP_ADDRESS } from '../data/shop.js';

const query = encodeURIComponent(SHOP_ADDRESS);

const MAPS_LINK = `https://www.google.com/maps/search/?api=1&query=${query}`;
const DIRECTIONS_LINK = `https://www.google.com/maps/dir/?api=1&destination=${query}`;

/**
 * A drawn locator, deliberately with no Google iframe.
 *
 * The embed was tried twice and failed twice. Blocked by a CSP or an ad
 * blocker it renders Google's own "This content is blocked" error page — and
 * that page *loads*, so `onLoad` fires and reveals it. There is no signal that
 * separates a real map from that error, which means an embed can always end up
 * showing customers a broken-looking box. Drawing our own is the only version
 * that renders every time; the buttons open the real map.
 */
export default function MapSection() {
  return (
    <section id="mapa" className="container-editorial scroll-mt-24 py-16 lg:py-24">
      <div className="text-center">
        <p className="eyebrow">Lokacija</p>
        <h2 className="mt-2 font-serif text-3xl text-brand-dark sm:text-4xl">Gde smo</h2>
        <p className="mx-auto mt-4 max-w-xl text-gray-600">
          {SHOP.street} — u {SHOP.city}u, na Zvezdari. Svratite ili poručite dostavu.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-12 gap-6 lg:gap-8">
        <div className="col-span-12 lg:col-span-8">
          <div className="relative overflow-hidden rounded-3xl border border-brand-border shadow-sm">
            <a
              href={MAPS_LINK}
              target="_blank"
              rel="noreferrer"
              aria-label={`Otvori ${SHOP_ADDRESS} u Google Mapama`}
              className="relative block aspect-[16/11] w-full transition hover:opacity-95 sm:aspect-[16/9]"
            >
              <DrawnMap />
            </a>
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
              <a
                href={DIRECTIONS_LINK}
                target="_blank"
                rel="noreferrer"
                className="btn-primary w-full"
              >
                <Navigation className="h-4 w-4" aria-hidden="true" />
                Navigacija do radnje
              </a>
              <a href={MAPS_LINK} target="_blank" rel="noreferrer" className="btn-ghost w-full">
                Otvori u Google Mapama
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
              <a href={SHOP.phoneHref} className="btn-ghost w-full">
                <Phone className="h-4 w-4" aria-hidden="true" />
                {SHOP.phone}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Stylised street plan in brand colours. Not survey-accurate — it's a locator,
 * and the address plus the directions button carry the precision.
 */
function DrawnMap() {
  return (
    <div className="absolute inset-0 bg-brand-mist">
      <svg
        viewBox="0 0 800 450"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
        aria-hidden="true"
      >
        <rect width="800" height="450" fill="#E0F2F0" />

        <g fill="#FFFFFF" opacity="0.75">
          <rect x="40" y="40" width="240" height="130" rx="6" />
          <rect x="330" y="30" width="200" height="140" rx="6" />
          <rect x="580" y="55" width="190" height="115" rx="6" />
          <rect x="60" y="250" width="210" height="150" rx="6" />
          <rect x="320" y="265" width="230" height="135" rx="6" />
          <rect x="600" y="245" width="170" height="160" rx="6" />
        </g>

        <g stroke="#B8E0DC" strokeWidth="14" strokeLinecap="round">
          <path d="M300 20 L300 430" />
          <path d="M560 20 L560 430" />
        </g>

        {/* Dimitrija Tucovića — the street the shop sits on */}
        <path d="M0 215 L800 200" stroke="#4A9B9B" strokeWidth="26" strokeLinecap="round" />
        <path
          d="M0 215 L800 200"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeDasharray="14 14"
          opacity="0.85"
        />
        <text
          x="56"
          y="250"
          fill="#2F5F58"
          fontSize="15"
          fontFamily="Inter, system-ui, sans-serif"
          letterSpacing="1.5"
        >
          DIMITRIJA TUCOVIĆA
        </text>

        <g transform="translate(400 204)">
          <ellipse cx="0" cy="34" rx="20" ry="6" fill="#1C2826" opacity="0.18" />
          <path
            d="M0 32 C0 32 22 8 22 -8 A22 22 0 1 0 -22 -8 C-22 8 0 32 0 32 Z"
            fill="#3D7A73"
            stroke="#FFFFFF"
            strokeWidth="3"
          />
          <circle cx="0" cy="-8" r="7.5" fill="#FFFFFF" />
        </g>
      </svg>

      <div className="absolute bottom-4 left-1/2 w-max max-w-[90%] -translate-x-1/2 rounded-2xl bg-white/95 px-4 py-2.5 text-center shadow-md backdrop-blur">
        <p className="font-serif text-sm text-brand-dark">
          {SHOP.name} — {SHOP.street}
        </p>
      </div>
    </div>
  );
}
