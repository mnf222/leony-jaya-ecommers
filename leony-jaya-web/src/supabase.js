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

export function throwIfError(error) {
  if (error) {
    throw new Error(error.message);
  }
}

const PRODUCT_COLUMNS =
  'id,name,slug,description,price,stock,size_guide,article_color,is_active,created_at,'
  + 'product_images(id,image_url,is_primary),product_variants(id,size,stock)';

function formatProduct(product) {
  const images = [...(product.product_images ?? [])].sort(
    (left, right) => Number(right.is_primary) - Number(left.is_primary)
  );
  const variants = [...(product.product_variants ?? [])].sort(
    (a, b) => String(a.size).localeCompare(String(b.size), undefined, { numeric: true })
  );
  const { product_images: _productImages, product_variants: _productVariants, ...fields } = product;

  return {
    ...fields,
    primary_image: images[0]?.image_url ?? null,
    images,
    variants,
  };
}

// ---------------------------------------------------------------- catalog

export async function listProducts() {
  const { data, error } = await requireSupabase()
    .from('products')
    .select(PRODUCT_COLUMNS)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(24);
  throwIfError(error);

  return (data ?? []).map(formatProduct);
}

export async function getProduct(slug) {
  const { data, error } = await requireSupabase()
    .from('products')
    .select(PRODUCT_COLUMNS)
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle();
  throwIfError(error);

  if (!data) {
    throw new Error('Product not found.');
  }

  return formatProduct(data);
}

// ---------------------------------------------------------------- orders

/** shipping = { name, phone, address }. Prices and stock are verified inside the database. */
export async function placeOrder(paymentMethod, items, shipping) {
  const { data, error } = await requireSupabase().rpc('checkout_order', {
    p_payment_method: paymentMethod,
    p_items: items,
    p_shipping: shipping,
  });
  throwIfError(error);

  return data;
}

const ORDER_COLUMNS =
  'id,total_price,status,payment_method,resi_number,created_at,expires_at,'
  + 'shipping_name,shipping_phone,shipping_address,payment_proof_path,proof_uploaded_at,'
  + 'order_items(id,product_id,quantity,price,size,products(name,article_color))';

export async function listMyOrders(userId) {
  const { data, error } = await requireSupabase()
    .from('orders')
    .select(ORDER_COLUMNS)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  throwIfError(error);

  return data ?? [];
}

export async function cancelOrder(orderId) {
  const { data, error } = await requireSupabase().rpc('cancel_order', { p_order_id: orderId });
  throwIfError(error);

  return data;
}

const PROOF_TYPES = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

export function validateImageFile(file) {
  if (!file) throw new Error('Please choose an image.');
  if (!PROOF_TYPES[file.type]) throw new Error('Only JPG, PNG or WebP images are allowed.');
  if (file.size > MAX_UPLOAD_BYTES) throw new Error('The image must be 5 MB or smaller.');
  return PROOF_TYPES[file.type];
}

/** Uploads to the private bucket under <userId>/..., then links it to the order. */
export async function uploadPaymentProof(userId, orderId, file) {
  const ext = validateImageFile(file);
  const client = requireSupabase();
  const path = `${userId}/${orderId}-${Date.now()}.${ext}`;

  const { error: uploadError } = await client.storage
    .from('payment-proofs')
    .upload(path, file, { contentType: file.type, upsert: false });
  throwIfError(uploadError);

  const { error } = await client.rpc('submit_payment_proof', { p_order_id: orderId, p_path: path });
  throwIfError(error);

  return path;
}

/** Private files are opened through short-lived signed links. */
export async function getProofUrl(path) {
  const { data, error } = await requireSupabase()
    .storage.from('payment-proofs')
    .createSignedUrl(path, 300);
  throwIfError(error);

  return data.signedUrl;
}

// ---------------------------------------------------------------- admin

export async function getIsAdmin(userId) {
  if (!userId || !supabase) return false;
  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .maybeSingle();
  if (error) return false;

  return data?.role === 'admin';
}

export async function adminListProducts() {
  const { data, error } = await requireSupabase()
    .from('products')
    .select(PRODUCT_COLUMNS)
    .order('created_at', { ascending: false });
  throwIfError(error);

  return (data ?? []).map(formatProduct);
}

function slugify(text) {
  return String(text).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || 'product';
}

/** product = { id?, name, description, price, size_guide, article_color, is_active }, variants = [{ size, stock }] */
export async function adminSaveProduct(product, variants) {
  const client = requireSupabase();
  const fields = {
    name: product.name.trim(),
    description: product.description?.trim() || null,
    price: Math.round(Number(product.price)),
    size_guide: product.size_guide?.trim() || null,
    article_color: product.article_color,
    is_active: product.is_active,
  };

  let id = product.id;
  if (id) {
    const { error } = await client.from('products').update(fields).eq('id', id);
    throwIfError(error);
  } else {
    const slug = `${slugify(fields.name)}-${Math.random().toString(36).slice(2, 6)}`;
    const { data, error } = await client.from('products').insert({ ...fields, slug }).select('id').single();
    throwIfError(error);
    id = data.id;
  }

  const cleaned = variants
    .map((v) => ({ size: String(v.size).trim(), stock: Math.max(0, Math.round(Number(v.stock) || 0)) }))
    .filter((v) => v.size);
  const seen = new Set(cleaned.map((v) => v.size));

  const { data: existing, error: existingError } = await client
    .from('product_variants').select('id,size').eq('product_id', id);
  throwIfError(existingError);

  const removed = (existing ?? []).filter((v) => !seen.has(v.size)).map((v) => v.id);
  if (removed.length) {
    const { error } = await client.from('product_variants').delete().in('id', removed);
    throwIfError(error);
  }
  if (cleaned.length) {
    const { error } = await client
      .from('product_variants')
      .upsert(cleaned.map((v) => ({ ...v, product_id: id })), { onConflict: 'product_id,size' });
    throwIfError(error);
  }

  return id;
}

export async function adminUploadProductImage(productId, file, makePrimary) {
  const ext = validateImageFile(file);
  const client = requireSupabase();
  const path = `products/${productId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error: uploadError } = await client.storage
    .from('product-images')
    .upload(path, file, { contentType: file.type, upsert: false });
  throwIfError(uploadError);

  const { data } = client.storage.from('product-images').getPublicUrl(path);

  if (makePrimary) {
    const { error } = await client.from('product_images').update({ is_primary: false }).eq('product_id', productId);
    throwIfError(error);
  }
  const { error } = await client
    .from('product_images')
    .insert({ product_id: productId, image_url: data.publicUrl, is_primary: Boolean(makePrimary) });
  throwIfError(error);
}

export async function adminSetPrimaryImage(productId, imageId) {
  const client = requireSupabase();
  const { error: clearError } = await client.from('product_images').update({ is_primary: false }).eq('product_id', productId);
  throwIfError(clearError);
  const { error } = await client.from('product_images').update({ is_primary: true }).eq('id', imageId);
  throwIfError(error);
}

export async function adminDeleteImage(image) {
  const client = requireSupabase();
  const marker = '/product-images/';
  const index = image.image_url.indexOf(marker);
  if (index >= 0) {
    // Best effort: external (seed) URLs have nothing to remove from storage.
    await client.storage.from('product-images').remove([image.image_url.slice(index + marker.length)]);
  }
  const { error } = await client.from('product_images').delete().eq('id', image.id);
  throwIfError(error);
}

/** Products that were ordered can't be deleted (order history); they are hidden instead. */
export async function adminDeleteProduct(id) {
  const client = requireSupabase();
  const { error } = await client.from('products').delete().eq('id', id);
  if (!error) return 'deleted';

  const { error: hideError } = await client.from('products').update({ is_active: false }).eq('id', id);
  throwIfError(hideError);
  return 'hidden';
}

export async function adminListOrders() {
  const { data, error } = await requireSupabase()
    .from('orders')
    .select(ORDER_COLUMNS)
    .order('created_at', { ascending: false })
    .limit(100);
  throwIfError(error);

  return data ?? [];
}

export async function adminUpdateOrder(id, changes) {
  const { data, error } = await requireSupabase()
    .from('orders')
    .update(changes)
    .eq('id', id)
    .select('id');
  throwIfError(error);
  if (!data?.length) throw new Error('The order was not updated. Check your admin permissions.');
}
