/**
 * Catalog fixtures. Shaped like an API response so this file can be swapped
 * for a `fetch` without touching any component.
 *
 * `image` points at a remote photo; <ProductImage> falls back to a branded
 * SVG placeholder if it fails to load, so a missing asset never breaks the grid.
 */

export const CATEGORIES = [
  { id: 'all', label: 'Svi Buketi' },
  { id: 'aranzmani', label: 'Aranžmani' },
  { id: 'pokloni', label: 'Pokloni i Dekoracije' },
  { id: 'plisane-igracke', label: 'Plišane Igračke' },
  { id: 'baloni', label: 'Baloni' },
];

/** Human-readable tag rendered on the product card. */
export const CATEGORY_TAG = {
  buketi: 'Buketi',
  aranzmani: 'Aranžmani',
  pokloni: 'Pokloni',
  'plisane-igracke': 'Plišane igračke',
  baloni: 'Baloni',
};

export const PRODUCTS = [
  {
    id: 'buket-bela-elegancija',
    name: 'Bela Elegancija',
    category: 'buketi',
    price: 4800,
    badge: 'Bestseler',
    description: 'Bele ruže i eustoma sa eukaliptusom, upakovano u mat papir.',
    image:
      'https://images.unsplash.com/photo-1487070183336-b863922373d4?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'buket-rose-garden',
    name: 'Rose Garden',
    category: 'buketi',
    price: 5600,
    badge: 'Novo',
    description: 'Baštenske ruže u nijansama pudrasto roze, sa mekim zelenilom.',
    image:
      'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'buket-poljsko-cvece',
    name: 'Poljsko Cveće',
    category: 'buketi',
    price: 3400,
    description: 'Sezonski miks poljskog cveća — drugačiji svakog jutra.',
    image:
      'https://images.unsplash.com/photo-1523694576729-1e00fdd58e15?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'buket-trofej-signature',
    name: 'Trofej Signature',
    category: 'buketi',
    price: 7900,
    badge: 'Premium',
    description: 'Naš potpisni buket od 51 ruže, ručno komponovan.',
    image:
      'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'aranzman-box-lux',
    name: 'Flower Box Lux',
    category: 'aranzmani',
    price: 6200,
    badge: 'Bestseler',
    description: 'Ruže u kutiji sa floralnom penom — traje do deset dana.',
    image:
      'https://images.unsplash.com/photo-1519378058457-4c29a0a2efac?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'aranzman-stoni',
    name: 'Stoni Aranžman',
    category: 'aranzmani',
    price: 5400,
    description: 'Nizak aranžman za sto — savršen za proslave i venčanja.',
    image:
      'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'aranzman-korpa',
    name: 'Korpa Sezone',
    category: 'aranzmani',
    price: 4900,
    description: 'Pletena korpa sa sezonskim cvećem i suvim dekoracijama.',
    image:
      'https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'poklon-set-svece',
    name: 'Poklon Set sa Svećama',
    category: 'pokloni',
    price: 3900,
    badge: 'Novo',
    description: 'Mirisne sveće, suvo cveće i ručno pisana čestitka.',
    image:
      'https://images.unsplash.com/photo-1602874801006-e26113c58cfa?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'poklon-cokoladna-kutija',
    name: 'Čokoladna Kutija',
    category: 'pokloni',
    price: 2800,
    description: 'Ručno pravljene pralline uz mini buket po izboru.',
    image:
      'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'plis-medved-veliki',
    name: 'Veliki Plišani Medved',
    category: 'plisane-igracke',
    price: 4500,
    description: 'Mekani medved 80 cm — uz buket ili samostalno.',
    image:
      'https://images.unsplash.com/photo-1530325553241-4f6e7690cf36?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'plis-zeka-mini',
    name: 'Mini Zeka',
    category: 'plisane-igracke',
    price: 1900,
    description: 'Sitan poklon koji uvek prođe — idealan uz cveće.',
    image:
      'https://images.unsplash.com/photo-1558877385-8c1b8e6d0e88?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'baloni-rodjendan',
    name: 'Rođendanski Set Balona',
    category: 'baloni',
    price: 2400,
    description: 'Helijumski baloni u brend nijansama, sa trakama.',
    image:
      'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'baloni-srce',
    name: 'Balon Srce XXL',
    category: 'baloni',
    badge: 'Popularno',
    price: 1600,
    description: 'Folijski balon u obliku srca, punjen helijumom.',
    image:
      'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'aranzman-orhideja',
    name: 'Orhideja u Kaši',
    category: 'aranzmani',
    price: 5900,
    description: 'Phalaenopsis u keramičkoj saksiji — dugotrajan poklon.',
    image:
      'https://images.unsplash.com/photo-1524598171353-ce84a157ba9b?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'buket-suvo-cvece',
    name: 'Suvo Cveće Pampas',
    category: 'buketi',
    price: 4200,
    description: 'Pampas trava i suvi cvetovi — dekoracija koja ne vene.',
    image:
      'https://images.unsplash.com/photo-1596438459194-f275f413d6ff?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'poklon-vaza-keramika',
    name: 'Keramička Vaza',
    category: 'pokloni',
    price: 3200,
    description: 'Ručno rađena vaza domaće izrade, mat glazura.',
    image:
      'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=800&q=80',
  },
];

/** `all` is the catch-all tab; every other id matches `product.category`. */
export function filterProducts(products, categoryId) {
  if (categoryId === 'all') return products;
  return products.filter((product) => product.category === categoryId);
}
