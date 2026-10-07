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
};

/**
 * Delivery price by part of Belgrade, straight from the owner's price list
 * ("Stari Grad - Vračar - za cvećare.pdf"). The customer picks their area at
 * checkout and its price is added to the order. To change a price, change the
 * `rsd` here and nothing else moves. Same order and names as the list.
 */
export const DELIVERY_ZONES = [
  { id: 'altina', name: 'Altina', rsd: 1800 },
  { id: 'banjica', name: 'Banjica', rsd: 1200 },
  { id: 'banovo-brdo', name: 'Banovo Brdo', rsd: 1000 },
  { id: 'batajnica', name: 'Batajnica', rsd: 2500 },
  { id: 'bezanijska-kosa', name: 'Bežanijska Kosa', rsd: 1200 },
  { id: 'borca', name: 'Borča', rsd: 2000 },
  { id: 'brace-jerkovic', name: 'Braće Jerković', rsd: 1000 },
  { id: 'cerak', name: 'Cerak', rsd: 1300 },
  { id: 'dedinje', name: 'Dedinje', rsd: 1000 },
  { id: 'jajinci', name: 'Jajinci', rsd: 1700 },
  { id: 'kaludjerica', name: 'Kaluđerica', rsd: 1700 },
  { id: 'karaburma', name: 'Karaburma', rsd: 1000 },
  { id: 'kumodraz', name: 'Kumodraž', rsd: 1700 },
  { id: 'ledine', name: 'Ledine', rsd: 1700 },
  { id: 'mali-mokri-lug', name: 'Mali Mokri Lug', rsd: 1200 },
  { id: 'mirijevo', name: 'Mirijevo', rsd: 1100 },
  { id: 'novi-beograd', name: 'Novi Beograd', rsd: 1000 },
  { id: 'petlovo-brdo', name: 'Petlovo Brdo', rsd: 1500 },
  { id: 'rakovica', name: 'Rakovica', rsd: 1300 },
  { id: 'senjak', name: 'Senjak', rsd: 1000 },
  { id: 'stari-grad', name: 'Stari Grad', rsd: 600 },
  { id: 'stepa-vlahovic', name: 'Stepa / Vlahović', rsd: 1100 },
  { id: 'sremcica', name: 'Sremčica', rsd: 2700 },
  { id: 'surcin', name: 'Surčin', rsd: 2000 },
  { id: 'visnjica', name: 'Višnjica', rsd: 1200 },
  { id: 'vozdovac', name: 'Voždovac', rsd: 1000 },
  { id: 'vracar', name: 'Vračar', rsd: 600 },
  { id: 'zarkovo', name: 'Žarkovo', rsd: 1300 },
  { id: 'zeleznik', name: 'Železnik', rsd: 1700 },
  { id: 'zemun', name: 'Zemun', rsd: 1100 },
  { id: 'zvezdara', name: 'Zvezdara', rsd: 600 },
  { id: 'uska-zona', name: 'Uska zona', rsd: 600 },
];

export const deliveryZone = (id) => DELIVERY_ZONES.find((zone) => zone.id === id) ?? null;

/** Cheapest delivery anywhere — what the cart quotes before an area is picked. */
export const MIN_DELIVERY_FEE = Math.min(...DELIVERY_ZONES.map((zone) => zone.rsd));

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
