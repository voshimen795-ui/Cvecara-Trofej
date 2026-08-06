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

/**
 * Bouquet sizes. `price` is absolute so the shop can override any single one
 * by hand; the defaults are derived from the medium price and rounded to 50
 * RSD so nothing ends in an odd number.
 */
const round50 = (n) => Math.round(n / 50) * 50;

export const sizesFrom = (base) => [
  { id: 'mali', label: 'Mali', price: round50(base * 0.75), note: 'Oko 15 stabljika' },
  { id: 'srednji', label: 'Srednji', price: base, note: 'Oko 25 stabljika' },
  { id: 'veliki', label: 'Veliki', price: round50(base * 1.45), note: 'Oko 40 stabljika' },
];

// All three tolerate a missing product: pages call them before the
// "not found" guard runs, and an unknown /proizvod/:id must 404, not crash.

/** The size a quick add-to-cart uses when the customer hasn't picked one. */
export const defaultSize = (product) =>
  product?.sizes?.find((s) => s.id === 'srednji') ?? product?.sizes?.[0] ?? null;

/** Price for a product at a given size id, falling back to the base price. */
export const priceFor = (product, sizeId) =>
  product?.sizes?.find((s) => s.id === sizeId)?.price ?? product?.price ?? 0;

export const isAvailable = (product) => product?.available !== false;

/**
 * Ovde ostaju srpski originali. Interfejs ih prevodi preko `t()`, po ključu
 * koji je izveden iz `id`-a (`tiles.baloni`, `tags.buketi`, `pages.buketi.*`),
 * pa dodavanje jezika ne dira ovaj fajl.
 */
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
  'plisane-igracke': {
    slug: 'plisane-igracke',
    title: 'Plišane Igračke',
    lead: 'Meki saputnik uz buket — za rođendane i rodilišta.',
    intro: 'Igračke slažemo uz cveće ili ih šaljemo samostalno, upakovane po želji.',
  },
  baloni: {
    slug: 'baloni',
    title: 'Baloni',
    lead: 'Helijumski i folijski baloni za proslave i iznenađenja.',
    intro: 'Balone punimo na dan isporuke da izdrže što duže.',
  },
};

/**
 * Ručno biran redosled za fan deck na početnoj — najizraženiji buketi i
 * aranžmani, poređani tako da susedne kartice ne budu iste boje.
 */
export const FEATURED_IDS = [
  'tirkizni-buket',
  'ljubicasti-san',
  'zuti-sjaj',
  'medveni-zagrljaj',
  'prolecna-simfonija',
  'purpurna-dalija',
  'meki-pastel',
  'korpa-sunca',
  'ljubicasta-elegancija',
  'roze-oblak',
];

export const PRODUCTS = [
  // ——— Buketi ———
  {
    id: 'prolecna-simfonija',
    name: 'Prolećna Simfonija',
    category: 'buketi',
    price: 4800,
    sizes: sizesFrom(4800),
    badge: 'bestseler',
    description: 'Roze ruže, iris i lila hrizantema u pastelnom papiru.',
    image: photo('prolecna-simfonija'),
  },
  {
    id: 'crveni-akcenat',
    name: 'Crveni Akcenat',
    category: 'buketi',
    price: 5200,
    sizes: sizesFrom(5200),
    description: 'Anturijum i bela eustoma sa zelenilom, u kraft papiru.',
    image: photo('crveni-akcenat'),
  },
  {
    id: 'nezne-lale',
    available: false,
    name: 'Nežne Lale',
    category: 'buketi',
    price: 3400,
    sizes: sizesFrom(3400),
    badge: 'sezonski',
    description: 'Lale u nijansama roze i lila, vezane satenskom trakom.',
    image: photo('nezne-lale'),
  },
  {
    id: 'suncano-jutro',
    name: 'Sunčano Jutro',
    category: 'buketi',
    price: 3900,
    sizes: sizesFrom(3900),
    description: 'Suncokreti i sitno poljsko cveće — buket koji budi prostoriju.',
    image: photo('suncano-jutro'),
  },
  {
    id: 'ljubicasti-san',
    name: 'Ljubičasti San',
    category: 'buketi',
    price: 5600,
    sizes: sizesFrom(5600),
    badge: 'novo',
    description: 'Ljubičaste hrizanteme i zelenilo u kontrastnom papiru.',
    image: photo('ljubicasti-san'),
  },
  {
    id: 'roze-oblak',
    name: 'Roze Oblak',
    category: 'buketi',
    price: 5100,
    sizes: sizesFrom(5100),
    description: 'Mekana kombinacija roze i lila tonova sa eukaliptusom.',
    image: photo('roze-oblak'),
  },
  {
    id: 'livada-u-cvatu',
    name: 'Livada u Cvatu',
    category: 'buketi',
    price: 4300,
    sizes: sizesFrom(4300),
    description: 'Sitno poljsko cveće u žutom papiru — drugačije svakog dana.',
    image: photo('livada-u-cvatu'),
  },
  {
    id: 'lavanda-i-krem',
    name: 'Lavanda i Krem',
    category: 'buketi',
    price: 4900,
    sizes: sizesFrom(4900),
    description: 'Lila levkonija i krem hrizantema, upakovano u novinski papir.',
    image: photo('lavanda-i-krem'),
  },
  {
    id: 'zlatna-jesen',
    name: 'Zlatna Jesen',
    category: 'buketi',
    price: 4600,
    sizes: sizesFrom(4600),
    description: 'Topli tonovi i suve grančice u okerastom papiru.',
    image: photo('zlatna-jesen'),
  },

  {
    id: 'tirkizni-buket',
    name: 'Tirkizni Buket',
    category: 'buketi',
    price: 5900,
    sizes: sizesFrom(5900),
    badge: 'novo',
    description: 'Ruže, hrizanteme i sitno cveće u tirkiznom papiru — brend u buketu.',
    image: photo('tirkizni-buket'),
  },
  {
    id: 'ljubicasta-elegancija',
    name: 'Ljubičasta Elegancija',
    category: 'buketi',
    price: 6100,
    sizes: sizesFrom(6100),
    description: 'Ljiljani i ljubičasto cveće u kombinaciji zelenog i lila papira.',
    image: photo('ljubicasta-elegancija'),
  },
  {
    id: 'ljiljan-i-ruze',
    name: 'Ljiljan i Ruže',
    category: 'buketi',
    price: 6300,
    sizes: sizesFrom(6300),
    description: 'Roze ljiljani sa sitnim cvetovima, u svetlom papiru sa zlatnom ivicom.',
    image: photo('ljiljan-i-ruze'),
  },
  {
    id: 'purpurna-dalija',
    name: 'Purpurna Dalija',
    category: 'buketi',
    price: 5800,
    sizes: sizesFrom(5800),
    description: 'Krupne dalije i sezonsko cveće u toplim tonovima.',
    image: photo('purpurna-dalija'),
  },
  {
    id: 'bela-elegancija',
    name: 'Bela Elegancija',
    category: 'buketi',
    price: 5500,
    sizes: sizesFrom(5500),
    description: 'Bele ruže i zelenilo u crnom mat papiru — svečano i suzdržano.',
    image: photo('bela-elegancija'),
  },
  {
    id: 'cvetni-vez',
    name: 'Cvetni Vez',
    category: 'buketi',
    price: 5400,
    sizes: sizesFrom(5400),
    description: 'Ljiljani i karanfili u papiru sa cvetnim dezenom.',
    image: photo('cvetni-vez'),
  },
  {
    id: 'meki-pastel',
    name: 'Meki Pastel',
    category: 'buketi',
    price: 5300,
    sizes: sizesFrom(5300),
    description: 'Bele ruže i hrizanteme sa plišanim medom u buketu.',
    image: photo('meki-pastel'),
  },
  {
    id: 'pastelna-prica',
    name: 'Pastelna Priča',
    category: 'buketi',
    price: 5200,
    sizes: sizesFrom(5200),
    description: 'Roze ruže, eustoma i eukaliptus u nežnom roze papiru.',
    image: photo('pastelna-prica'),
  },
  {
    id: 'roze-romansa',
    name: 'Roze Romansa',
    category: 'buketi',
    price: 4950,
    sizes: sizesFrom(4950),
    description: 'Roze papir i mešavina sitnog cveća — klasičan poklon.',
    image: photo('roze-romansa'),
  },
  {
    id: 'nezni-pozdrav',
    name: 'Nežni Pozdrav',
    category: 'buketi',
    price: 4700,
    sizes: sizesFrom(4700),
    description: 'Pastelni buket sa plišanim medom, u cvetnom papiru.',
    image: photo('nezni-pozdrav'),
  },
  {
    id: 'zuti-sjaj',
    name: 'Žuti Sjaj',
    category: 'buketi',
    price: 4400,
    sizes: sizesFrom(4400),
    description: 'Žute ruže i bele rade u žutom papiru — buket za dobro jutro.',
    image: photo('zuti-sjaj'),
  },
  {
    id: 'poljski-vez',
    name: 'Poljski Vez',
    category: 'buketi',
    price: 4100,
    sizes: sizesFrom(4100),
    description: 'Visok buket sa poljskim cvećem i paprati, u kraft papiru.',
    image: photo('poljski-vez'),
  },

  // ——— Aranžmani ———
  {
    id: 'medveni-zagrljaj',
    name: 'Medveđi Zagrljaj',
    category: 'aranzmani',
    price: 7400,
    sizes: sizesFrom(7400),
    badge: 'bestseler',
    description: 'Ruže i plišani medvedići u kutiji — poklon za rođendan.',
    image: photo('medveni-zagrljaj'),
  },
  {
    id: 'ruzicasti-ljiljan',
    available: false,
    name: 'Ružičasti Ljiljan',
    category: 'aranzmani',
    price: 6200,
    sizes: sizesFrom(6200),
    description: 'Ljiljani i ruže u crvenoj kutiji sa floralnom penom.',
    image: photo('ruzicasti-ljiljan'),
  },
  {
    id: 'divlja-basta',
    name: 'Divlja Bašta',
    category: 'aranzmani',
    price: 5800,
    sizes: sizesFrom(5800),
    description: 'Razgranat aranžman sa poljskim cvećem u lila kutiji.',
    image: photo('divlja-basta'),
  },
  {
    id: 'strastveni-trenutak',
    name: 'Strastveni Trenutak',
    category: 'aranzmani',
    price: 6500,
    sizes: sizesFrom(6500),
    badge: 'novo',
    description: 'Ljiljan i sitno cveće u kutiji — jednostavno i upečatljivo.',
    image: photo('strastveni-trenutak'),
  },
  {
    id: 'korpa-iznenadjenja',
    name: 'Korpa Iznenađenja',
    category: 'aranzmani',
    price: 6900,
    sizes: sizesFrom(6900),
    description: 'Pletena korpa sa sezonskim cvećem i dekorativnim grančicama.',
    image: photo('korpa-iznenadjenja'),
  },

  {
    id: 'cvetna-torba',
    name: 'Cvetna Torba',
    category: 'aranzmani',
    price: 7200,
    sizes: sizesFrom(7200),
    badge: 'novo',
    description: 'Aranžman u papirnoj torbi sa ručkama — spreman za nošenje.',
    image: photo('cvetna-torba'),
  },
  {
    id: 'slatki-pozdrav',
    name: 'Slatki Pozdrav',
    category: 'aranzmani',
    price: 6800,
    sizes: sizesFrom(6800),
    description: 'Ruže, karanfili i plišani meda u ukrasnoj kutiji.',
    image: photo('slatki-pozdrav'),
  },
  {
    id: 'korpa-sunca',
    name: 'Korpa Sunca',
    category: 'aranzmani',
    price: 6600,
    sizes: sizesFrom(6600),
    description: 'Pletena korpa sa ružama i gerberima u toplim tonovima.',
    image: photo('korpa-sunca'),
  },
  {
    id: 'cvetna-kesa',
    name: 'Cvetna Kesa',
    category: 'aranzmani',
    price: 5900,
    sizes: sizesFrom(5900),
    description: 'Ruže i zelenilo u kraft kesi — mali aranžman, velik utisak.',
    image: photo('cvetna-kesa'),
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
    available: false,
    name: 'Balon Srce XXL',
    category: 'baloni',
    price: 1600,
    badge: 'popularno',
    description: 'Folijski balon u obliku srca, punjen helijumom.',
  },
];

export const FEATURED = FEATURED_IDS.map((id) => PRODUCTS.find((p) => p.id === id)).filter(
  Boolean
);

export const getProduct = (id) => PRODUCTS.find((product) => product.id === id);

/** `all` je zbirna kartica; svaki drugi id odgovara `product.category`. */
export function filterProducts(products, categoryId) {
  if (categoryId === 'all') return products;
  return products.filter((product) => product.category === categoryId);
}
