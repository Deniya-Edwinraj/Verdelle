# Verdelle — Indoor Plant Shop (React + Vite + Tailwind)

A multi-page indoor-plant storefront built from the Verdelle homepage reference.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → /dist
npm run preview
```

Requires Node 18+. Fonts (Playfair Display, DM Sans) are bundled locally via `@fontsource` — no external requests.

## What's included

- **Homepage** in the reference order: header · immersive hero with 4 overlapping stat cards · “Why Shop with Verdelle?” benefits around a central plant · two-collection photo band · “Our Favorite Plants” 4×2 grid with working tabs · Spring into Green 25% sale banner · testimonial carousel · newsletter banner · GreenVibe blog · photographic footer.
- **26 routes** — Shop, `/shop/:category` (new-arrivals, easy-care, low-light, pet-friendly, flowering, large-plants, pots-and-planters, sale), product details, collections (8), Plant Care hub + 10 guides, About, Blog + 6 articles, Contact, Cart, Checkout, Order success, Wishlist, Login, Register, Account (dashboard/orders/addresses/profile), FAQ, Shipping & Returns, Privacy, Terms, 404.
- **Catalog** — 24 products (`src/data/products.js`): the 8 homepage plants plus monstera, snake plant, spider plant, areca, bird of paradise, Chinese evergreen, Boston fern, aloe, jade, string of pearls, syngonium, dracaena, calathea, peperomia and two planters. Each has botanical name, sizes, pot options, light/water/humidity/temperature, difficulty, pet-safety status and a linked care guide.
- **Shop features** — filters (category, price, size, light, watering, ease of care, pet-friendly, in stock), sorting, search (header overlay + `/shop?q=`), mobile filter drawer, Load More, empty states.
- **Cart & checkout** — size + pot pricing, sale savings, coupons (`GREEN10`, `WELCOME5`), free-delivery threshold, demo checkout with validation, order confirmation and demo order tracking in the account.

## Configuration — `src/data/site.js`

- **Currency**: one setting (`currency.code` / `locale`) used everywhere via `src/utils/format.js`. Default USD.
- **Promotion**: `saleDiscount` (0.25) applied to products with `onSale: true`; sale prices are derived from regular prices, so every page agrees.
- **Business details & social links**: placeholders — replace before launch.

## Imagery

The stock-photo hosts weren’t reachable from the build environment, so all imagery is **original SVG illustration** (`src/components/art/`): 24 species drawn individually and composed into room scenes. To use real licensed photos, add them to `public/images/` and reference them in **`src/data/assets.js`** — they automatically replace the matching illustration (hero, banners, footer, or any product by slug).

## Pet safety

Status is based on ASPCA toxic/non-toxic listings: pet-friendly = spider plant, areca palm, Boston fern, calathea, peperomia; others are marked toxic. Unknown cases display “Pet safety: check before purchasing”. Always confirm with a vet.

## Demo-only — needs a backend before launch

| Area | File | Connect to |
|---|---|---|
| Payments | `src/pages/Checkout.jsx` | Stripe / PayPal hosted fields (card data is never collected here) |
| Accounts & orders | `src/context/AuthContext.jsx` | Real auth + order API (passwords are never stored) |
| Newsletter | `src/components/forms/NewsletterForm.jsx` | Email platform |
| Contact form | `src/pages/Contact.jsx` | Helpdesk / email endpoint |
| Coupons, stock, prices | `src/data/*`, `CartContext.jsx` | Commerce backend (validate server-side) |
| Stats, testimonials, reviews, brand story, policies | home/about/policy pages | Real, verified content |

Cart, wishlist, recently viewed, demo profile, addresses and orders persist in `localStorage`. SPA rewrites are included for Netlify (`public/_redirects`) and Vercel (`vercel.json`).
