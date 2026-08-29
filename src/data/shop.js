/**
 * Single source of truth for storefront copy that appears in more than one
 * place (announcement bar, footer, contact, checkout scheduling).
 */
export const SHOP = {
  name: 'Cvećara Trofej',
  street: 'Dimitrija Tucovića 128',
  city: 'Beograd',
  phone: '069/279-0074',
  phoneHref: 'tel:+381692790074',
  email: 'cvecara.trofej@gmail.com',
  // Serbian original. The UI reads `t('common.deliveryArea')`; this stays for
  // the order email and the structured data, which are always Serbian.
  deliveryArea: 'Dostava na teritoriji Beograda',
  instagramHandle: '@cvecaratrofej',
  instagram: 'https://www.instagram.com/cvecaratrofej/',
  /** Free delivery above this amount, in RSD. */
  freeDeliveryThreshold: 4000,
  /** Fee for the nearest zone, in RSD. Farther zones cost more — see DELIVERY_TIERS. */
  deliveryFee: 350,
};

/**
 * Delivery price by straight-line distance from the shop.
 *
 * ⚠️ PLACEHOLDER PRICES — the owner has to confirm these. The distances and
 * the arithmetic are ours; the numbers are a guess at what a Belgrade
 * courier run is worth. Change the `rsd` values here and nothing else moves.
 *
 * `km` is the upper bound of the zone. The last entry is the catch-all.
 */
export const DELIVERY_TIERS = [
  { km: 3, rsd: 350 },
  { km: 6, rsd: 500 },
  { km: 10, rsd: 700 },
  { km: 15, rsd: 900 },
  { km: Infinity, rsd: 1200 },
];

/** Straight-line distance in km -> delivery fee in RSD. */
export function deliveryFeeForKm(km) {
  if (!Number.isFinite(km)) return SHOP.deliveryFee;
  return (DELIVERY_TIERS.find((tier) => km <= tier.km) ?? DELIVERY_TIERS.at(-1)).rsd;
}

/** Full address, for maps and for the Wolt dropoff. */
export const SHOP_ADDRESS = `${SHOP.street}, ${SHOP.city}, Srbija`;

/**
 * Opening hours in machine-readable form — `open`/`close` are 24h hours and
 * drive the checkout time picker, so the two can never drift apart.
 * Index matches `Date.getDay()`: 0 = Sunday.
 */
export const OPENING_HOURS = [
  { day: 0, label: 'Nedelja', open: null, close: null },
  { day: 1, label: 'Ponedeljak', open: 10, close: 20 },
  { day: 2, label: 'Utorak', open: 10, close: 20 },
  { day: 3, label: 'Sreda', open: 10, close: 20 },
  { day: 4, label: 'Četvrtak', open: 10, close: 20 },
  { day: 5, label: 'Petak', open: 10, close: 20 },
  { day: 6, label: 'Subota', open: 10, close: 15 },
];

/**
 * Grouped for display — identical weekdays collapse into one row.
 *
 * `key` is what the UI translates (`hours.weekdays`, `hours.saturday`…) and
 * `closed` replaces the old `time === 'Ne radimo'` string comparison, which
 * silently stopped matching the moment the row was translated.
 */
export const HOURS_DISPLAY = [
  { key: 'weekdays', day: 'Ponedeljak — Petak', time: '10:00 — 20:00' },
  { key: 'saturday', day: 'Subota', time: '10:00 — 15:00' },
  { key: 'sunday', day: 'Nedelja', time: 'Ne radimo', closed: true },
];

export const isOpenOn = (date) => OPENING_HOURS[date.getDay()].open !== null;

/** Hours a customer can pick for a given date, respecting opening times. */
export function slotsFor(date) {
  const rules = OPENING_HOURS[date.getDay()];
  if (rules.open === null) return [];

  const slots = [];
  // Last slot is one hour before closing, so there is time to hand over.
  for (let hour = rules.open; hour <= rules.close - 1; hour += 1) {
    slots.push(`${String(hour).padStart(2, '0')}:00`);
  }
  return slots;
}

/** Primary navigation — also used by the mobile drawer menu and the footer. */
export const NAV_LINKS = [
  { label: 'Buketi', i18n: 'nav.buketi', to: '/buketi' },
  { label: 'Aranžmani', i18n: 'nav.aranzmani', to: '/aranzmani' },
  { label: 'Pokloni', i18n: 'nav.pokloni', to: '/pokloni' },
  { label: 'O nama', i18n: 'nav.onama', to: '/o-nama' },
];
