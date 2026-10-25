import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabase = url && publishableKey
  ? createClient(url, publishableKey)
  : null;

export function requireSupabase() {
  if (!supabase) {
    throw new Error('Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to connect this app to Supabase.');
  }

  return supabase;
}

function throwIfError(error) {
  if (error) {
    throw new Error(error.message);
  }
}

function formatProduct(product) {
  const images = [...(product.product_images ?? [])].sort(
    (left, right) => Number(right.is_primary) - Number(left.is_primary)
  );
  const { product_images: _productImages, ...fields } = product;

  return {
    ...fields,
    primary_image: images[0]?.image_url ?? null,
    images,
  };
}

export async function listProducts() {
  const { data, error } = await requireSupabase()
    .from('products')
    .select('id,name,slug,description,price,stock,size_guide,article_color,is_active,created_at,product_images(id,image_url,is_primary)')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(24);
  throwIfError(error);

  return (data ?? []).map(formatProduct);
}

export async function getProduct(slug) {
  const { data, error } = await requireSupabase()
    .from('products')
    .select('id,name,slug,description,price,stock,size_guide,article_color,is_active,created_at,product_images(id,image_url,is_primary)')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle();
  throwIfError(error);

  if (!data) {
    throw new Error('Product not found.');
  }

  return formatProduct(data);
}

export async function placeOrder(paymentMethod, items) {
  const { data, error } = await requireSupabase().rpc('checkout_order', {
    p_payment_method: paymentMethod,
    p_items: items,
  });
  throwIfError(error);

  return data;
}
