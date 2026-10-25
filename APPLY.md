# Leony Jaya: launch update

Copy the folders in this zip into your repo root (same paths), then:

1. **Database** - Supabase Dashboard > SQL Editor: run `supabase/migrations/20261025000000_launch_hardening.sql`
   (after the original `20261019000000_create_store_schema.sql`). Safe to re-run.
   - Existing products get per-size stock automatically (current stock split evenly across sizes).
     Open Admin > Products afterwards and set the real number per size.
   - Optional: enable the `pg_cron` extension first so unpaid orders auto-cancel after 24 h.
     Otherwise run `select public.expire_pending_orders();` now and then.
2. **Website** - add the new variables from `leony-jaya-web/.env.example` to your `.env`
   (bank details / QRIS image), then `npm run dev`.
   Make yourself admin once, in the SQL Editor:
   `update public.profiles set role = 'admin' where id = (select id from auth.users where email = 'YOUR_EMAIL');`
3. **Android** - open `leony-jaya-android/` in Android Studio, copy `local.properties.example` to
   `local.properties`, fill in the URL and publishable key, run.

Deploy the database migration and the new website/app together: `checkout_order` now needs shipping
details, so the old website build can no longer place orders.

## What changed
- Shipping name / phone / address on every order, 24 h payment window, `cancelled` status with automatic restock.
- Stock per size (`product_variants`); `products.stock` is the sum, kept in sync by a trigger.
- Private `payment-proofs` bucket (owner/admin only, 5 MB images), public `product-images` bucket (admin write).
- Status changes are validated in the database (pending > paid > shipped > completed, or cancelled).
- Website: shipping form, payment instructions, My orders (cancel, upload proof), Admin (orders + products).
- Android: same checkout, per-size sizes, cancel, proof upload.

## Not done / next
- Shipping cost (RajaOngkir/Biteship), payment gateway with webhooks, email/WhatsApp notifications,
  forgot-password, categories/search/pagination, tests + CI, Play Store assets.
- Nothing here was run: no database, npm or Android SDK was available. The JS was syntax-checked only.
