import { useCallback, useEffect, useState } from 'react';
import {
  adminDeleteImage,
  adminDeleteProduct,
  adminListProducts,
  adminSaveProduct,
  adminSetPrimaryImage,
  adminUploadProductImage,
} from '../supabase';
import { rupiah, translateError } from '../utils';
import { ghostBtn, inputClass, labelClass, primaryBtn } from './ui';

const EMPTY = {
  name: '',
  description: '',
  price: '',
  size_guide: '',
  article_color: '#3B5BDB',
  is_active: true,
  variants: ['28', '30', '32', '34'].map((size) => ({ size, stock: 0 })),
};

const toForm = (p) => ({
  id: p.id,
  name: p.name,
  description: p.description || '',
  price: String(p.price),
  size_guide: p.size_guide || '',
  article_color: p.article_color,
  is_active: p.is_active,
  variants: p.variants.map((v) => ({ size: v.size, stock: v.stock })),
});

function validate(form) {
  if (form.name.trim().length < 2) return 'Please enter a product name.';
  const price = Number(form.price);
  if (!Number.isFinite(price) || price < 0) return 'Please enter a valid price.';
  if (!/^#[A-Fa-f0-9]{6}$/.test(form.article_color)) return 'Pick a valid colour.';
  const sizes = form.variants.map((v) => v.size.trim()).filter(Boolean);
  if (sizes.length === 0) return 'Add at least one size.';
  if (new Set(sizes).size !== sizes.length) return 'Each size can only appear once.';
  if (sizes.some((s) => s.length > 10)) return 'Sizes can be at most 10 characters.';
  return '';
}

export default function ProductsTab() {
  const [products, setProducts] = useState(null);
  const [form, setForm] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const load = useCallback(async () => {
    try {
      const list = await adminListProducts();
      setProducts(list);
      return list;
    } catch (e) {
      setError(translateError(e.message));
      return null;
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const run = async (action, success) => {
    setBusy(true); setError(''); setNotice('');
    try {
      const result = await action();
      if (success) setNotice(success);
      return result;
    } catch (e) {
      setError(translateError(e.message));
      return undefined;
    } finally {
      setBusy(false);
    }
  };

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  const setVariant = (index, field, value) =>
    setForm((f) => ({ ...f, variants: f.variants.map((v, i) => (i === index ? { ...v, [field]: value } : v)) }));

  const save = async (e) => {
    e.preventDefault();
    const problem = validate(form);
    if (problem) return setError(problem);

    const id = await run(() => adminSaveProduct(form, form.variants), 'Product saved.');
    if (!id) return undefined;
    const list = await load();
    const saved = list?.find((p) => p.id === id);
    if (saved) setForm(toForm(saved)); // stay on the product so photos can be added
    return undefined;
  };

  const current = form?.id ? products?.find((p) => p.id === form.id) : null;

  const upload = async (e) => {
    const files = [...(e.target.files ?? [])];
    e.target.value = '';
    if (!files.length || !form?.id) return;
    await run(async () => {
      let hasPrimary = Boolean(current?.images.some((i) => i.is_primary));
      for (const file of files) {
        await adminUploadProductImage(form.id, file, !hasPrimary);
        hasPrimary = true;
      }
    }, 'Photos uploaded.');
    await load();
  };

  const remove = async (p) => {
    if (!window.confirm(`Delete “${p.name}”? Products that were already ordered are hidden instead.`)) return;
    const result = await run(() => adminDeleteProduct(p.id));
    if (result === 'hidden') setNotice('This product has orders, so it was hidden from the shop instead of deleted.');
    if (result === 'deleted') setNotice('Product deleted.');
    if (form?.id === p.id) setForm(null);
    await load();
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
      <div>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold uppercase tracking-wider">Products</h2>
          <button onClick={() => { setForm({ ...EMPTY }); setError(''); setNotice(''); }} className={primaryBtn}>New product</button>
        </div>
        {!products && !error && <p className="mt-6 text-neutral-500">Loading…</p>}
        <ul className="mt-5 divide-y divide-white/10 border-y border-white/10">
          {products?.map((p) => (
            <li key={p.id} className="flex items-center gap-4 py-4">
              <div className="h-16 w-12 shrink-0 overflow-hidden border bg-[#171717]" style={{ borderColor: `${p.article_color}88` }}>
                {p.primary_image && <img src={p.primary_image} alt="" className="h-full w-full object-cover" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{p.name}{!p.is_active && <span className="ml-2 text-[9px] uppercase text-amber-400">hidden</span>}</p>
                <p className="mt-1 text-xs text-neutral-500">
                  {rupiah(p.price)} · {p.stock} in stock
                </p>
                <p className="mt-1 text-[10px] text-neutral-600">{p.variants.map((v) => `${v.size}:${v.stock}`).join('  ') || 'No sizes yet'}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button onClick={() => { setForm(toForm(p)); setError(''); setNotice(''); }} className={ghostBtn}>Edit</button>
                <button disabled={busy} onClick={() => remove(p)} className={ghostBtn}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div>
        {error && <p role="alert" className="mb-4 text-sm text-red-400">{error}</p>}
        {notice && <p className="mb-4 text-sm text-emerald-300">{notice}</p>}
        {!form ? (
          <p className="text-sm text-neutral-500">Choose a product to edit, or create a new one.</p>
        ) : (
          <form onSubmit={save} className="space-y-4 border border-white/10 bg-[#111] p-5">
            <h2 className="font-display text-lg font-semibold uppercase tracking-wider">{form.id ? 'Edit product' : 'New product'}</h2>

            <div>
              <label className={labelClass}>Name</label>
              <input value={form.name} onChange={set('name')} maxLength={255} className={inputClass} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Price (Rp)</label>
                <input type="number" min="0" step="1000" value={form.price} onChange={set('price')} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Accent colour</label>
                <input type="color" value={form.article_color} onChange={set('article_color')} className="h-[2.55rem] w-full border border-white/15 bg-ink p-1" />
              </div>
            </div>
            <div>
              <label className={labelClass}>Description</label>
              <textarea rows={3} value={form.description} onChange={set('description')} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Size guide (one line per size, e.g. “30 - Waist 76cm | Length 101cm”)</label>
              <textarea rows={4} value={form.size_guide} onChange={set('size_guide')} className={`${inputClass} font-mono`} />
            </div>

            <div>
              <label className={labelClass}>Sizes &amp; stock</label>
              <div className="space-y-2">
                {form.variants.map((v, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input value={v.size} onChange={(e) => setVariant(i, 'size', e.target.value)} placeholder="Size" maxLength={10} className={`${inputClass} w-24`} />
                    <input type="number" min="0" value={v.stock} onChange={(e) => setVariant(i, 'stock', e.target.value)} className={`${inputClass} w-28`} />
                    <button type="button" onClick={() => setForm((f) => ({ ...f, variants: f.variants.filter((_, n) => n !== i) }))} className="text-xs text-neutral-500 hover:text-red-400" aria-label="Remove size">✕</button>
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => setForm((f) => ({ ...f, variants: [...f.variants, { size: '', stock: 0 }] }))} className="mt-2 text-[10px] uppercase tracking-[0.14em] text-neutral-400 underline underline-offset-4 hover:text-white">
                + Add size
              </button>
            </div>

            <label className="flex items-center gap-2 text-xs text-neutral-300">
              <input type="checkbox" checked={form.is_active} onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))} />
              Visible in the shop
            </label>

            <div className="flex gap-3">
              <button type="submit" disabled={busy} className={primaryBtn}>{busy ? 'Saving…' : 'Save product'}</button>
              <button type="button" onClick={() => setForm(null)} className={ghostBtn}>Close</button>
            </div>

            {form.id ? (
              <div className="border-t border-white/10 pt-4">
                <label className={labelClass}>Photos (JPG, PNG or WebP, max 5 MB)</label>
                <div className="flex flex-wrap gap-3">
                  {current?.images.map((im) => (
                    <div key={im.id} className="w-20">
                      <img src={im.image_url} alt="" className={`h-24 w-20 object-cover ${im.is_primary ? 'ring-2 ring-white' : 'opacity-80'}`} />
                      <div className="mt-1 flex justify-between text-[9px] uppercase tracking-wider text-neutral-500">
                        {im.is_primary
                          ? <span className="text-white">Main</span>
                          : <button type="button" onClick={async () => { await run(() => adminSetPrimaryImage(form.id, im.id)); await load(); }} className="hover:text-white">Set main</button>}
                        <button type="button" onClick={async () => { await run(() => adminDeleteImage(im)); await load(); }} className="hover:text-red-400">Del</button>
                      </div>
                    </div>
                  ))}
                </div>
                <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={upload} disabled={busy} className="mt-3 block text-xs text-neutral-400" />
              </div>
            ) : (
              <p className="border-t border-white/10 pt-4 text-[11px] text-neutral-500">Save the product first, then you can add photos.</p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
