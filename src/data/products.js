/**
 * Katalog. Oblik odgovara API odgovoru, pa se ovaj fajl može zameniti
 * `fetch`-om bez diranja komponenti.
 *
 * Fotografije su obrađene skriptom `scripts/process_products.py` — pozadina
 * uklonjena, kropovano na cveće, 1200x1200 master u `photos/catalog/`, a
 * ovde se koristi optimizovana WebP verzija.
 */

// Vite mapira slug -> URL slike u build-u; nova slika u folderu se pokupi sama.
const PHOTOS = import.meta.glob('../assets/products/*.webp', {
  eager: true,
  import: 'default',
});

const photo = (slug) => PHOTOS[`../assets/products/${slug}.webp`];

export const CATEGORIES = [
  { id: 'all', label: 'Svi Buketi' },
  { id: 'aranzmani', label: 'Aranžmani' },
  { id: 'pokloni', label: 'Pokloni i Dekoracije' },
  { id: 'plisane-igracke', label: 'Plišane Igračke' },
  { id: 'baloni', label: 'Baloni' },
];

/** Oznaka koja se ispisuje na kartici proizvoda. */
export const CATEGORY_TAG = {
  buketi: 'Buketi',
  aranzmani: 'Aranžmani',
  pokloni: 'Pokloni',
  'plisane-igracke': 'Plišane igračke',
  baloni: 'Baloni',
};

/** Zaglavlja zasebnih stranica po kategoriji. */
export const CATEGORY_PAGES = {
  buketi: {
    slug: 'buketi',
    title: 'Buketi',
    lead: 'Ručno komponovani buketi od svežeg cveća — svaki nastaje na dan isporuke.',
    intro:
      'Cveće biramo svakog jutra. Ako ne vidite ono što tražite, pozovite nas i komponovaćemo buket po vašoj želji i budžetu.',
  },
  aranzmani: {
    slug: 'aranzmani',
    title: 'Aranžmani',
    lead: 'Cveće u kutiji, korpi i vazi — traje duže i ne traži vazu kod kuće.',
    intro:
      'Aranžmani su idealni za kancelarije, proslave i poklone koji treba da stoje na stolu. Radimo i po meri prostora.',
  },
  pokloni: {
    slug: 'pokloni',
    title: 'Pokloni i Dekoracije',
    lead: 'Sitnice koje upotpunjuju buket — sveće, čestitke i keramika.',
    intro: 'Sve iz ove kategorije možete dodati uz bilo koji buket ili aranžman.',
  },
};

export const PRODUCTS = [
  // ——— Buketi ———
  {
    id: 'prolecna-simfonija',
    name: 'Prolećna Simfonija',
    category: 'buketi',
    price: 4800,
    badge: 'Bestseler',
    description: 'Roze ruže, iris i lila hrizantema u pastelnom papiru.',
    image: photo('prolecna-simfonija'),
  },
  {
    id: 'crveni-akcenat',
    name: 'Crveni Akcenat',
    category: 'buketi',
    price: 5200,
    description: 'Anturijum i bela eustoma sa zelenilom, u kraft papiru.',
    image: photo('crveni-akcenat'),
  },
  {
    id: 'nezne-lale',
    name: 'Nežne Lale',
    category: 'buketi',
    price: 3400,
    badge: 'Sezonski',
    description: 'Lale u nijansama roze i lila, vezane satenskom trakom.',
    image: photo('nezne-lale'),
  },
  {
    id: 'suncano-jutro',
    name: 'Sunčano Jutro',
    category: 'buketi',
    price: 3900,
    description: 'Suncokreti i sitno poljsko cveće — buket koji budi prostoriju.',
    image: photo('suncano-jutro'),
  },
  {
    id: 'ljubicasti-san',
    name: 'Ljubičasti San',
    category: 'buketi',
    price: 5600,
    badge: 'Novo',
    description: 'Ljubičaste hrizanteme i zelenilo u kontrastnom papiru.',
    image: photo('ljubicasti-san'),
  },
  {
    id: 'roze-oblak',
    name: 'Roze Oblak',
    category: 'buketi',
    price: 5100,
    description: 'Mekana kombinacija roze i lila tonova sa eukaliptusom.',
    image: photo('roze-oblak'),
  },
  {
    id: 'livada-u-cvatu',
    name: 'Livada u Cvatu',
    category: 'buketi',
    price: 4300,
    description: 'Sitno poljsko cveće u žutom papiru — drugačije svakog dana.',
    image: photo('livada-u-cvatu'),
  },
  {
    id: 'lavanda-i-krem',
    name: 'Lavanda i Krem',
    category: 'buketi',
    price: 4900,
    description: 'Lila levkonija i krem hrizantema, upakovano u novinski papir.',
    image: photo('lavanda-i-krem'),
  },
  {
    id: 'zlatna-jesen',
    name: 'Zlatna Jesen',
    category: 'buketi',
    price: 4600,
    description: 'Topli tonovi i suve grančice u okerastom papiru.',
    image: photo('zlatna-jesen'),
  },

  // ——— Aranžmani ———
  {
    id: 'medveni-zagrljaj',
    name: 'Medveđi Zagrljaj',
    category: 'aranzmani',
    price: 7400,
    badge: 'Bestseler',
    description: 'Ruže i plišani medvedići u kutiji — poklon za rođendan.',
    image: photo('medveni-zagrljaj'),
  },
  {
    id: 'ruzicasti-ljiljan',
    name: 'Ružičasti Ljiljan',
    category: 'aranzmani',
    price: 6200,
    description: 'Ljiljani i ruže u crvenoj kutiji sa floralnom penom.',
    image: photo('ruzicasti-ljiljan'),
  },
  {
    id: 'divlja-basta',
    name: 'Divlja Bašta',
    category: 'aranzmani',
    price: 5800,
    description: 'Razgranat aranžman sa poljskim cvećem u lila kutiji.',
    image: photo('divlja-basta'),
  },
  {
    id: 'strastveni-trenutak',
    name: 'Strastveni Trenutak',
    category: 'aranzmani',
    price: 6500,
    badge: 'Novo',
    description: 'Ljiljan i sitno cveće u kutiji — jednostavno i upečatljivo.',
    image: photo('strastveni-trenutak'),
  },
  {
    id: 'korpa-iznenadjenja',
    name: 'Korpa Iznenađenja',
    category: 'aranzmani',
    price: 6900,
    description: 'Pletena korpa sa sezonskim cvećem i dekorativnim grančicama.',
    image: photo('korpa-iznenadjenja'),
  },

  // ——— Pokloni, igračke i baloni ———
  // Za ove artikle još nemamo fotografije; <ProductImage> crta brendiranu
  // zamenu po kategoriji dok se ne dodaju.
  {
    id: 'poklon-set-svece',
    name: 'Poklon Set sa Svećama',
    category: 'pokloni',
    price: 3900,
    description: 'Mirisne sveće, suvo cveće i ručno pisana čestitka.',
  },
  {
    id: 'poklon-vaza-keramika',
    name: 'Keramička Vaza',
    category: 'pokloni',
    price: 3200,
    description: 'Ručno rađena vaza domaće izrade, mat glazura.',
  },
  {
    id: 'plis-medved-veliki',
    name: 'Veliki Plišani Medved',
    category: 'plisane-igracke',
    price: 4500,
    description: 'Mekani medved 80 cm — uz buket ili samostalno.',
  },
  {
    id: 'plis-zeka-mini',
    name: 'Mini Zeka',
    category: 'plisane-igracke',
    price: 1900,
    description: 'Sitan poklon koji uvek prođe — idealan uz cveće.',
  },
  {
    id: 'baloni-rodjendan',
    name: 'Rođendanski Set Balona',
    category: 'baloni',
    price: 2400,
    description: 'Helijumski baloni u brend nijansama, sa trakama.',
  },
  {
    id: 'baloni-srce',
    name: 'Balon Srce XXL',
    category: 'baloni',
    price: 1600,
    badge: 'Popularno',
    description: 'Folijski balon u obliku srca, punjen helijumom.',
  },
];

/** `all` je zbirna kartica; svaki drugi id odgovara `product.category`. */
export function filterProducts(products, categoryId) {
  if (categoryId === 'all') return products;
  return products.filter((product) => product.category === categoryId);
}
