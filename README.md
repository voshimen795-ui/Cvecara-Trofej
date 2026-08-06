# Cvećara Trofej — Frontend

Editorial-style storefront for a Belgrade boutique flower shop. React + Vite, Tailwind CSS,
Lucide icons, Framer Motion.

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production bundle -> dist/
npm run preview  # serve the built bundle
```

## Design tokens

Defined once in `tailwind.config.js` and used semantically everywhere — no raw hex values
in components.

| Token           | Value     | Role                          |
| --------------- | --------- | ----------------------------- |
| `brand-primary` | `#4A9B9B` | Soft mint teal — accent fills, with dark text on top |
| `brand-primary-dark` | `#3D7A73` | Teal **text** on light grounds |
| `brand-teal` | `#55B5B3` | Logo teal — hover state for fills |
| `brand-mist` | `#E0F2F0` | Palest teal — product grounds, selected states |
| `brand-rose`    | `#E88295` | Soft rose — badges, highlights |
| `brand-bg`      | `#FAFAFA` | Canvas background             |
| `brand-surface` | `#FFFFFF` | Cards, navbar, drawer         |
| `brand-dark`    | `#1C2826` | Charcoal typography           |
| `brand-muted`   | `#6B7280` | Muted text                    |
| `brand-border`  | `#E5E7EB` | Hairline borders              |

Type: **Playfair Display** (`font-serif`) for headlines, **Inter** (`font-sans`) for UI/body.
Spacing follows an 8pt rhythm.

**Which teal goes where.** Teal fills carry **dark** text (`#1C2826` on `#4A9B9B` is
4.67:1). Teal used *as* text sits on light grounds and must be `brand-primary-dark`
(`#3D7A73` on white is 4.96:1). White on any teal lighter than `#3D7A73` fails, which
is why the dark-on-light pairing exists at all — don't swap them back.

Three shared classes in `src/index.css` keep the system honest: `.container-editorial`
(horizontal rhythm), `.btn-primary` / `.btn-ghost`, and `.eyebrow`.

## Deploying (Vercel)

The repo is a Vite build plus serverless functions in `api/`, which is Vercel's
default layout — no adapter needed.

1. vercel.com → **Add New… → Project** → import this GitHub repo.
2. Framework preset **Vite**; build command and output directory come from
   `vercel.json`. Leave them as detected.
3. **Settings → Environment Variables**: add the keys from `.env.example`.
   Leave them blank to deploy in test mode.
4. Deploy. Every push to the branch redeploys automatically.

Routing uses `HashRouter`, so deep links resolve without rewrite rules and the
build works on any static host — but the Wolt endpoints need a platform that
runs functions, which rules out GitHub Pages.

Locally, `npm run dev` serves the site but **not** `api/`. Use `vercel dev` to
run both together.

## Catalogue

- **Sizes.** Bouquets and arrangements carry `sizes` (mali / srednji / veliki), generated
  by `sizesFrom(base)` in `src/data/products.js` and rounded to 50 RSD. Override any one
  by editing its `price`. Cards quick-add the medium; the product page has the selector.
  A cart line is keyed by product **and** size, so one bouquet in two sizes is two lines.
- **Availability.** Set `available: false` on a product to grey out its card, swap the
  badge for "Trenutno nije dostupno" and disable add-to-cart on both card and product page.

## Quick view

Tapping a card opens `ProductQuickView` — image, description, size, quantity,
add to cart. It exists because sizes used to live only on the product page, so
the grid silently added a medium. Cards for products with sizes now say
"Izaberi veličinu" and route through the modal; sizeless products still
quick-add. One modal for the whole app, mounted in `QuickViewProvider`.

## Social proof

- `src/data/reviews.js` holds the Google reviews, transcribed verbatim, plus
  the rating and a link to the listing. They're rendered as native cards in
  `ReviewsSlider`, not pasted screenshots: screenshots carry Google's dark
  chrome, don't reflow, and can't be read aloud. The marquee duplicates the
  list and translates by exactly half the measured track width, so the loop is
  seamless; hover, focus and reduced-motion all pause it.
- `InstagramSection` links out rather than embedding. The official embed needs
  a Meta app and a long-lived token, and third-party widgets want a paid script
  on every page. Swap in the Basic Display API when there's an app to point at.
  **The handle in `src/data/shop.js` is a guess — confirm it.**

## Vouchers

`api/vouchers/validate.js` checks two kinds of code: campaign codes from the
table (override with `VOUCHER_CODES=CODE:percent:10,...`) and loyalty codes,
`TROFEJ-XXXXXX`, issued on the confirmation screen after an order and verified
by shape rather than by lookup. Codes never reach the browser.

**No redemption store**, so nothing enforces single use — a valid code keeps
working. Acceptable while every order is confirmed by phone; first thing to fix
once orders are persisted.

## Checkout

Beyond the address, `/porudzbina` collects a voucher code and:

- **Scheduling** — date and time, in `ScheduleFields`. Slots come from `OPENING_HOURS` in
  `src/data/shop.js`, so a customer can't book a closed Sunday or a past hour today.
  Change the hours there and the picker follows.
- **Personalisation** — occasion, card message (200 chars) and special wishes. These are
  folded into the note that reaches the florist and the courier.
- **Geolocation** — a button, never an on-load prompt. Coordinates make Wolt's price
  binding rather than an estimate; `api/geo/reverse.js` turns them into a street via
  Nominatim. If that lookup fails the coordinates are still used and the customer is
  told to type the street — it degrades, it doesn't break.

Pickup mode skips Wolt and hands off to a phone call, because there is still no order
store to record a pickup against.

## Wolt Drive

Customers order on this site and a Wolt courier delivers. This is Wolt Drive,
the carrier product — it does not list the shop in the Wolt marketplace.

| Path | Role |
| --- | --- |
| `api/_lib/wolt.js` | Wolt client, mock mode, payload mapping |
| `api/wolt/quote.js` | `POST /api/wolt/quote` → price + ETA for an address |
| `api/wolt/delivery.js` | `POST /api/wolt/delivery` → books the courier |
| `src/services/wolt.js` | browser calls to the two endpoints above |
| `src/pages/CheckoutPage.jsx` | `/porudzbina` — address, quote, confirmation |

The bearer token is read only inside `api/`, so it never reaches the browser.

**Test mode.** With `WOLT_API_TOKEN` or `WOLT_VENUE_ID` unset, both endpoints
return simulated prices, dispatch nothing, and flag `mock: true`; checkout
shows an amber warning saying the order isn't real. Fill both variables in to
go live.

**Before going live**, verify the four mapping functions in `api/_lib/wolt.js`
— `buildPromiseBody`, `readPromise`, `buildDeliveryBody`, `readDelivery` —
against the endpoint reference Wolt sends with your dev token. The base URL,
paths and auth scheme are from Wolt's public docs; the individual field names
are not, because the reference sits behind their developer portal. Everything
uncertain is confined to those four functions.

Still missing for a real shop: order persistence, payment, and a notification
to the florist. Right now a confirmed order dispatches a courier and shows a
reference number — nothing is stored. Pickup orders can't be submitted at all
for the same reason.

## SEO

`index.html` carries the title, description, Serbian keywords, canonical, Open
Graph tags and a `Florist` JSON-LD block with address, hours and the 5.0
aggregate rating. Keep the JSON-LD in step with `src/data/shop.js` — Google
reads it for the knowledge panel, and stale hours there are worse than none.

Keywords target what a Belgrade florist actually competes on: *cvećara Beograd,
dostava cveća Beograd, buketi Beograd, cveće dostava istog dana, cvetni
aranžmani, cveće za venčanje, buket ruža, poklon buket, cvećara Zvezdara.*

## Map

`MapSection` draws its own brand-coloured street plan in SVG and fades the live
Google embed in over it on load. The embed alone left an empty rectangle
wherever it's blocked — strict CSP, ad blocker, no network — and a blocked
cross-origin frame neither errors nor loads, so there's no event to catch. The
drawn plan is a locator, not survey-accurate; the address and the directions
button carry the precision.

## Product photography

`scripts/process_products.py` turns raw shop photos into transparent catalog
PNGs: rembg removes the background, the result is cropped to the flowers,
padded and centred on a 1200×1200 RGBA canvas.

```bash
pip install rembg onnxruntime pillow numpy scipy

python scripts/process_products.py --review --web
python scripts/process_products.py --only nezne-lale --alpha-matting
```

| Path | What |
| --- | --- |
| `photos/raw/` | untouched source photos |
| `photos/catalog/` | 1200×1200 PNG masters + `manifest.json` |
| `photos/catalog/_review.png` | contact sheet on a checkerboard, for eyeballing cut quality |
| `src/assets/products/` | 800px WebP the site actually ships (`--web`) |

Every photo is an entry in `MANIFEST` inside the script, which is where you
tune a bad cut without touching the pipeline:

- `model` — `birefnet-general` is the default and holds whole arrangements
  together; `u2net` is ~5× faster but loses busy shop backgrounds.
- `alpha_matting` — finer edges on thin stems, at the cost of speed and some
  softness.
- `trim_bottom` / `trim_top` — rembg treats the hand holding the bouquet as
  part of the subject, so the band is cut off deterministically. Person
  segmentation was tried and rejected: it confuses pink flowers with skin.
- `drop_dark` — clears a dark sleeve standing beside the flowers, where
  trimming the bottom would eat the bouquet too.

Run with `--review` after any change and look at the sheet before shipping.

## Structure

```
src/
├── App.jsx                     # HashRouter + page routes
├── pages/
│   ├── HomePage.jsx            # hero + fan deck + category tiles + about
│   ├── CategoryPage.jsx        # /buketi, /aranzmani, /pokloni, …
│   ├── ProductPage.jsx         # /proizvod/:id
│   ├── CheckoutPage.jsx        # /porudzbina
│   ├── AboutPage.jsx           # /o-nama
│   └── NotFoundPage.jsx
├── components/
│   ├── AnnouncementBar.jsx     # h-10 teal strip
│   ├── Navbar.jsx              # sticky h-20, 3-col grid, mobile menu
│   ├── Hero.jsx                # centred, animated gradient + botanicals
│   ├── FanDeck.jsx             # shuffling fan carousel
│   ├── CategoryLinks.jsx       # gradient category tiles
│   ├── CategoryFilter.jsx      # pill tabs
│   ├── ProductGrid.jsx         # 1 / 2 / 4 responsive grid
│   ├── ProductCard.jsx         # 4:5 image, hover zoom, add-to-cart
│   ├── CartDrawer.jsx          # right slide-over
│   ├── AboutSection.jsx        # #o-nama
│   ├── Footer.jsx              # 4-column
│   └── ui/ProductImage.jsx     # image with branded fallback
├── context/CartContext.jsx     # useReducer cart + localStorage
├── services/wolt.js            # calls the /api endpoints
├── hooks/                      # scroll lock, escape key, breakpoint
├── data/                       # products.js, shop.js
└── utils/format.js             # RSD currency formatting

api/                            # Vercel serverless functions
├── _lib/wolt.js
└── wolt/{quote,delivery}.js
```

## Cart

`CartContext` holds line items in a reducer and persists them to `localStorage`. Adding an
item opens the drawer; decrementing to zero removes the line. Delivery is free above
`SHOP.freeDeliveryThreshold` (4.000 RSD), otherwise `SHOP.deliveryFee` (350 RSD) — both in
`src/data/shop.js`.

The drawer's own delivery estimate (free above `SHOP.freeDeliveryThreshold`) is a
shop-side rule for the cart summary. The binding price comes from Wolt at
checkout — see **Wolt Drive** above.

## Content

All shop details (address, phone, hours, delivery copy) live in `src/data/shop.js`.
Product fixtures are in `src/data/products.js`, shaped like an API response so the array can
be swapped for a `fetch` without touching components.

Bouquets and arrangements use real shop photography (see **Product photography**).
Gifts, soft toys and balloons have no photos yet, so `<ProductImage>` draws a
per-category branded mark instead — add files to `photos/raw/`, list them in the
script's `MANIFEST`, and they get picked up automatically.
