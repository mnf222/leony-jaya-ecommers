# Leony Jaya Collection - Web Frontend

React 18 + Vite + Tailwind CSS 3 + Zustand + Framer Motion.
The website and Android app use the same Supabase project for authentication,
products, and orders.

## Requirements
- Node.js 22+ (`node -v`)
- A Supabase project

## Setup
```bash
cd leony-jaya-web
npm install
copy .env.example .env
```

Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in `.env` from
Supabase **Project Settings → API Keys**, then apply
`../supabase/migrations/20261019000000_create_store_schema.sql` in the Supabase
SQL editor. Start the app with `npm run dev`.

The publishable key is intended for client apps; never put a Supabase secret or
service-role key in frontend or Android configuration. Row Level Security protects
database access. Checkout uses the transactional `checkout_order` RPC.

## Production build
Run `npm run build` after configuring the Supabase URL and publishable key in the
deployment build environment.

## Pages
| Route | What it does |
|---|---|
| `/` | Product grid from Supabase (hover border uses each product's colour) |
| `/product/:slug` | Detail page. `article_color` drives the Add to Cart button, price, size highlight and the glow around the image |
| `/cart` | Persistent cart (Zustand + localStorage), checkout via the Supabase RPC |
| `/login` | Login / register with Supabase Auth |

## Try it
The Supabase migration seeds products. Open a product and compare the indigo,
grey, red and olive accents.

## Structure
```
src/supabase.js  Supabase client, product queries, and transactional checkout
src/store.js     Zustand stores: useAuth, useCart
src/utils.js     rupiah(), contrastText() (readable text on accent), parseSizes()
src/pages/       Home, Product, Cart, Login
```
