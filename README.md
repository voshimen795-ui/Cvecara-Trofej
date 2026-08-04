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
│   ├── HomePage.jsx            # hero + filterable catalogue + about
│   ├── CategoryPage.jsx        # /buketi, /aranzmani, /pokloni
│   ├── AboutPage.jsx           # /o-nama
│   └── NotFoundPage.jsx
├── components/
│   ├── AnnouncementBar.jsx     # h-10 teal strip
│   ├── Navbar.jsx              # sticky h-20, 3-col grid, mobile menu
│   ├── Hero.jsx                # 12-col grid, 5/7 asymmetric split
│   ├── CategoryFilter.jsx      # pill tabs
│   ├── ProductGrid.jsx         # 1 / 2 / 4 responsive grid
│   ├── ProductCard.jsx         # 4:5 image, hover zoom, add-to-cart
│   ├── CartDrawer.jsx          # right slide-over
│   ├── AboutSection.jsx        # #o-nama
│   ├── Footer.jsx              # 4-column
│   └── ui/ProductImage.jsx     # image with branded fallback
├── context/CartContext.jsx     # useReducer cart + localStorage
├── hooks/                      # scroll lock, escape key
├── data/                       # products.js, shop.js
└── utils/format.js             # RSD currency formatting
```

## Cart

`CartContext` holds line items in a reducer and persists them to `localStorage`. Adding an
item opens the drawer; decrementing to zero removes the line. Delivery is free above
`SHOP.freeDeliveryThreshold` (4.000 RSD), otherwise `SHOP.deliveryFee` (350 RSD) — both in
`src/data/shop.js`.

Checkout is a UI-only button; wire it to a backend when one exists.

## Content

All shop details (address, phone, hours, delivery copy) live in `src/data/shop.js`.
Product fixtures are in `src/data/products.js`, shaped like an API response so the array can
be swapped for a `fetch` without touching components.

Product photos currently point at Unsplash placeholders. `<ProductImage>` falls back to a
branded SVG mark if an image fails to load, so the grid never breaks — replace the `image`
fields with real product shots when they're available.
