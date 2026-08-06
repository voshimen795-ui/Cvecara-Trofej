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
  email: 'cvecaratrofej@gmail.com',
  deliveryArea: 'Dostava na teritoriji Beograda',
  // TODO: potvrdite tačan handle — pretpostavka na osnovu imena radnje.
  instagramHandle: '@cvecara_trofej',
  instagram: 'https://www.instagram.com/cvecara_trofej/',
  /** Free delivery above this amount, in RSD. */
  freeDeliveryThreshold: 4000,
  /** Flat delivery fee below the threshold, in RSD. */
  deliveryFee: 350,
};

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

/** Grouped for display — identical weekdays collapse into one row. */
export const HOURS_DISPLAY = [
  { day: 'Ponedeljak — Petak', time: '10:00 — 20:00' },
  { day: 'Subota', time: '10:00 — 15:00' },
  { day: 'Nedelja', time: 'Ne radimo' },
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
  { label: 'Buketi', to: '/buketi' },
  { label: 'Aranžmani', to: '/aranzmani' },
  { label: 'Pokloni', to: '/pokloni' },
  { label: 'O nama', to: '/o-nama' },
];
