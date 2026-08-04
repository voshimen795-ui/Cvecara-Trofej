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
| `brand-primary` | `#4A9B9B` | Soft mint teal — primary accent |
| `brand-rose`    | `#E88295` | Soft rose — badges, highlights |
| `brand-bg`      | `#FAFAFA` | Canvas background             |
| `brand-surface` | `#FFFFFF` | Cards, navbar, drawer         |
| `brand-dark`    | `#1C2826` | Charcoal typography           |
| `brand-muted`   | `#6B7280` | Muted text                    |
| `brand-border`  | `#E5E7EB` | Hairline borders              |

Type: **Playfair Display** (`font-serif`) for headlines, **Inter** (`font-sans`) for UI/body.
Spacing follows an 8pt rhythm.

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
reference number — nothing is stored.

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
