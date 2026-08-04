/**
 * Single source of truth for storefront copy that appears in more than one
 * place (announcement bar, footer, checkout messaging).
 */
export const SHOP = {
  name: 'Cvećara Trofej',
  street: 'Dimitrija Tucovića 128',
  city: 'Beograd',
  phone: '061/123-4567',
  phoneHref: 'tel:+381611234567',
  email: 'kontakt@cvecara-trofej.rs',
  deliveryArea: 'Dostava na teritoriji Beograda',
  /** Free delivery above this amount, in RSD. */
  freeDeliveryThreshold: 4000,
  /** Flat delivery fee below the threshold, in RSD. */
  deliveryFee: 350,
  hours: [
    { day: 'Ponedeljak — Petak', time: '08:00 — 20:00' },
    { day: 'Subota', time: '08:00 — 18:00' },
    { day: 'Nedelja', time: '09:00 — 15:00' },
  ],
};

/**
 * Primary navigation — also used by the mobile drawer menu.
 * `category` links scroll to the shop section and preselect that filter pill.
 */
export const NAV_LINKS = [
  { label: 'Buketi', href: '#kolekcija', category: 'all' },
  { label: 'Aranžmani', href: '#kolekcija', category: 'aranzmani' },
  { label: 'Pokloni', href: '#kolekcija', category: 'pokloni' },
  { label: 'O nama', href: '#o-nama' },
];
