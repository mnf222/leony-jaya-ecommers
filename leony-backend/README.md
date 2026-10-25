# Leony Jaya Collection - Supabase Backend

The website and Android app share Supabase Auth and Postgres. The active Supabase
schema, Row Level Security rules, seed products, and transactional checkout
function are defined in
[`../supabase/migrations/20261019000000_create_store_schema.sql`](../supabase/migrations/20261019000000_create_store_schema.sql).

## Provision Supabase

1. Open the Supabase project SQL editor.
2. Run the migration SQL file linked above once.
3. In Supabase Authentication settings, choose whether new accounts require email confirmation.
4. After registering an admin account, promote it using the SQL editor:

   ```sql
   update public.profiles
   set role = 'admin', updated_at = now()
   where id = (
       select id from auth.users where email = 'your-admin-email@example.com'
   );
   ```

The migration creates `profiles`, `products`, `product_images`, `orders`, and
`order_items` tables. It seeds the four demo products. User profile rows are
created by a trigger on Supabase Auth users. Customers can only read their own
orders; only admins can manage catalog data or update order status/tracking.

## Shared client integration

- Web: configure `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in
  `leony-jaya-web/.env`.
- Android: use the Supabase SDK for the app's language with the same project URL
  and publishable key.
- Both clients use Supabase Auth. Checkout calls `public.checkout_order` through
  `supabase.rpc('checkout_order', { p_payment_method, p_items })`. The database
  function verifies the authenticated user, locks product rows, checks stock,
  calculates prices from the database, and creates/decrements everything in one
  transaction.

Do not put Supabase secret/service-role keys in either client. The Laravel
application in this folder is legacy and is no longer used as the website or
Android API.
