import { MapPin, Phone, Truck } from 'lucide-react';
import { SHOP } from '../data/shop.js';

/**
 * Fixed-height promo strip above the navbar. It scrolls away with the page —
 * only the navbar below it is sticky.
 */
export default function AnnouncementBar() {
  return (
    <div className="h-10 bg-brand-primary text-white">
      <div className="container-editorial flex h-full items-center justify-center">
        <p className="flex items-center gap-2 truncate text-xs sm:gap-3">
          <span className="flex items-center gap-1.5">
            <Truck className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {SHOP.deliveryArea}
          </span>

          <span className="hidden text-white/40 sm:inline" aria-hidden="true">
            |
          </span>

          <span className="hidden items-center gap-1.5 sm:flex">
            <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {SHOP.street}
          </span>

          <span className="text-white/40" aria-hidden="true">
            |
          </span>

          <a
            href={SHOP.phoneHref}
            className="flex items-center gap-1.5 rounded transition hover:text-white/80"
          >
            <Phone className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {SHOP.phone}
          </a>
        </p>
      </div>
    </div>
  );
}
