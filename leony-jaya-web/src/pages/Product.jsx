import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getProduct } from '../supabase';
import { useCart } from '../store';
import { contrastText, parseSizes, rupiah, translateError } from '../utils';

export default function Product() {
  const { slug } = useParams();
  const add = useCart((s) => s.add);
  const [p, setP] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [error, setError] = useState('');
  const [size, setSize] = useState('');
  const [img, setImg] = useState(0);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setP(null); setLoadError(''); setError(''); setSize(''); setImg(0);
    getProduct(slug).then(setP).catch((e) => setLoadError(translateError(e.message)));
  }, [slug]);

  if (loadError) return <p role="alert" className="p-20 text-center text-red-400">{loadError}</p>;
  if (!p) return <p className="p-20 text-center text-neutral-500">Loading…</p>;

  // Dynamic accent: everything below is driven by the API's article_color.
  const accent = p.article_color;
  const sizes = parseSizes(p.size_guide);
  const soldOut = p.stock <= 0;
  const images = p.images.length ? p.images : [{ id: 0, image_url: p.primary_image }];
  const showImage = (index) => setImg((index + images.length) % images.length);

  const handleAdd = () => {
    if (!size) return setError('Please select a size.');
    add(p, size);
    setError('');
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}
      className="mx-auto grid max-w-7xl gap-8 px-5 py-8 sm:gap-12 sm:py-12 md:grid-cols-2 lg:px-8"
    >
      <div className="md:sticky md:top-28 md:self-start">
        <div
          className="group relative aspect-[4/5] overflow-hidden border bg-[#171717]"
          style={{ borderColor: accent, boxShadow: `0 0 70px ${accent}55, 0 0 20px ${accent}33` }}
        >
          {images[img]?.image_url && (
            <motion.img
              key={images[img].id}
              initial={{ opacity: 0.6, scale: 1.025 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35 }}
              src={images[img].image_url}
              alt={`${p.name} view ${img + 1}`}
              className="h-full w-full object-cover"
            />
          )}
          {images.length > 1 && (
            <>
              <button type="button" onClick={() => showImage(img - 1)} aria-label="Previous product image" className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-black/45 text-white backdrop-blur transition hover:bg-black/80">←</button>
              <button type="button" onClick={() => showImage(img + 1)} aria-label="Next product image" className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-black/45 text-white backdrop-blur transition hover:bg-black/80">→</button>
              <span className="absolute bottom-3 right-3 bg-black/65 px-3 py-2 text-[9px] uppercase tracking-[0.14em]">{String(img + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}</span>
            </>
          )}
        </div>
        {images.length > 1 && (
          <div className="mt-4 flex gap-3">
            {images.map((im, i) => (
              <button key={im.id} onClick={() => setImg(i)} aria-label={`View product image ${i + 1}`} aria-pressed={i === img}
                className="h-20 w-16 overflow-hidden border transition hover:opacity-100"
                style={{ borderColor: i === img ? accent : '#2A2A2A', opacity: i === img ? 1 : undefined }}>
                <img src={im.image_url} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="md:pt-5">
        <Link to="/" className="text-[11px] uppercase tracking-[0.3em] text-neutral-500 hover:text-white">&larr; All products</Link>
        <p className="mt-7 text-[9px] uppercase tracking-[0.25em] text-neutral-500">Leony Jaya · Everyday denim</p>
        <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl">{p.name}</h1>
        <div className="mt-4 flex items-center justify-between gap-4">
          <p className="text-3xl font-semibold" style={{ color: accent }}>{rupiah(p.price)}</p>
          <span className="shrink-0 border border-white/15 px-3 py-2 text-[8px] uppercase tracking-[0.16em] text-neutral-400">
            {soldOut ? 'Sold out' : p.stock <= 5 ? `Only ${p.stock} left` : 'In stock'}
          </span>
        </div>
        {p.description && <p className="mt-6 max-w-md text-sm leading-relaxed text-neutral-400">{p.description}</p>}

        <div className="mt-8 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-widest">Choose your size</p>
          <a href="#size-guide" className="text-[9px] uppercase tracking-[0.14em] text-neutral-500 underline underline-offset-4 transition hover:text-white">Size guide</a>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {sizes.map((s) => (
            <button key={s} onClick={() => { setSize(s); setError(''); }} aria-pressed={size === s}
              className="min-w-[3.5rem] border px-4 py-3 text-xs transition hover:scale-[1.03]"
              style={size === s
                ? { borderColor: accent, color: accent, boxShadow: `0 0 12px ${accent}66` }
                : { borderColor: '#2A2A2A', color: '#A3A3A3' }}>
              {s}
            </button>
          ))}
        </div>

        <button
          onClick={handleAdd}
          disabled={soldOut}
          className="group mt-8 flex w-full items-center justify-between px-5 py-4 font-display text-xs font-semibold uppercase tracking-[0.2em] transition hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
          style={{ background: accent, color: contrastText(accent), boxShadow: `0 0 30px ${accent}66` }}
        >
          <span>{soldOut ? 'Sold out' : added ? 'Added to bag ✓' : 'Add to bag'}</span>
          <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
        </button>
        {error && <p role="alert" className="mt-3 text-sm text-red-400">{error}</p>}
        <p className="mt-4 flex items-center gap-2 text-[9px] uppercase tracking-[0.13em] text-neutral-500">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Secure checkout · Easy everyday wear
        </p>

        {p.size_guide && (
          <div id="size-guide" className="mt-10 scroll-mt-28 border-t border-white/10 pt-6">
            <h3 className="text-xs font-semibold tracking-widest">Size guide</h3>
            <pre className="mt-3 whitespace-pre-wrap font-sans text-xs leading-6 text-neutral-500">{p.size_guide}</pre>
          </div>
        )}
      </div>
    </motion.div>
  );
}
