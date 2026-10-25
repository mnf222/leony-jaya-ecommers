import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { listProducts } from '../supabase';
import { useCart } from '../store';
import { parseSizes, rupiah, translateError } from '../utils';

const filters = [
  { id: 'all', label: 'All pieces' },
  { id: 'available', label: 'In stock' },
  { id: 'under-425', label: 'Under Rp 425K' },
];

export default function Home() {
  const [products, setProducts] = useState(null);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('featured');
  const [favorites, setFavorites] = useState(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem('lj-favorites') || '[]'));
    } catch {
      return new Set();
    }
  });
  const [toast, setToast] = useState('');
  const addToCart = useCart((state) => state.add);

  useEffect(() => {
    let active = true;
    listProducts()
      .then((items) => { if (active) setProducts(items); })
      .catch((loadError) => { if (active) setError(translateError(loadError.message)); });

    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(''), 2400);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const visibleProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    const result = (products || []).filter((product) => {
      const matchesQuery = !normalizedQuery
        || `${product.name} ${product.description || ''}`.toLocaleLowerCase().includes(normalizedQuery);
      const matchesFilter = filter === 'all'
        || (filter === 'available' && product.stock > 0)
        || (filter === 'under-425' && product.price < 425000);
      return matchesQuery && matchesFilter;
    });

    if (sort === 'price-low') result.sort((a, b) => a.price - b.price);
    if (sort === 'price-high') result.sort((a, b) => b.price - a.price);
    if (sort === 'name') result.sort((a, b) => a.name.localeCompare(b.name));
    return result;
  }, [filter, products, query, sort]);

  const toggleFavorite = (productId) => {
    const next = new Set(favorites);
    if (next.has(productId)) next.delete(productId);
    else next.add(productId);
    setFavorites(next);
    localStorage.setItem('lj-favorites', JSON.stringify([...next]));
  };

  const quickAdd = (product) => {
    const firstSize = parseSizes(product.size_guide)[0];
    addToCart(product, firstSize);
    setToast(`${product.name} · size ${firstSize} added to your bag`);
  };

  const heroImage = products?.[0]?.primary_image;

  return (
    <div>
      <section className="relative isolate min-h-[520px] overflow-hidden border-b border-white/10 sm:min-h-[620px]">
        <div
          className="absolute inset-0 -z-20 bg-cover bg-center transition-transform duration-[1400ms] hover:scale-[1.03]"
          style={{
            backgroundColor: '#201d19',
            backgroundImage: heroImage
              ? `linear-gradient(110deg, rgba(10, 10, 10, 0.3), rgba(10, 10, 10, 0.05)), url("${heroImage}")`
              : 'radial-gradient(ellipse at 72% 38%, #51483a 0%, transparent 38%), linear-gradient(120deg, #202020, #101010 55%, #28251f)',
          }}
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/75 to-black/20" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-transparent to-black/20" />
        <div className="mx-auto flex min-h-[520px] max-w-7xl items-end px-5 pb-12 pt-24 sm:min-h-[620px] sm:pb-16 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <div className="mb-5 flex items-center gap-3 text-[9px] font-medium uppercase tracking-[0.3em] text-neutral-300">
              <span className="h-px w-8 bg-white" />
              The everyday, considered
            </div>
            <h1 className="max-w-2xl font-display text-6xl font-bold uppercase leading-[0.86] tracking-tight sm:text-8xl lg:text-[112px]">
              Made to<br /><span className="text-neutral-400">move</span> with you.
            </h1>
            <p className="mt-6 max-w-md text-sm leading-6 text-neutral-300 sm:text-base">
              Denim with a point of view. Easy to live in, hard to wear out.
            </p>
            <a
              href="#collection"
              className="mt-8 inline-flex items-center gap-7 border border-white bg-white px-5 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-ink transition hover:bg-transparent hover:text-white"
            >
              Explore the collection <span aria-hidden="true">↓</span>
            </a>
          </motion.div>
          <div className="absolute bottom-7 right-8 hidden text-right text-[9px] uppercase tracking-[0.2em] text-white/60 md:block">
            <span className="block text-white">01 / 04</span>
            Everyday denim, reimagined
          </div>
        </div>
      </section>

      <section id="collection" className="mx-auto max-w-7xl scroll-mt-20 px-5 py-14 sm:py-20 lg:px-8">
        <div className="flex flex-col justify-between gap-6 border-b border-white/10 pb-8 sm:flex-row sm:items-end">
          <div>
            <p className="text-[9px] uppercase tracking-[0.28em] text-neutral-500">Find your fit</p>
            <h2 className="mt-2 font-display text-4xl font-semibold uppercase tracking-wide sm:text-5xl">The collection</h2>
          </div>
          <p className="max-w-sm text-xs leading-6 text-neutral-500">
            Built for wherever the day takes you. Choose a silhouette and make it your own.
          </p>
        </div>

        <div className="flex flex-col gap-4 border-b border-white/10 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {filters.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setFilter(item.id)}
                aria-pressed={filter === item.id}
                className={`shrink-0 border px-4 py-2.5 text-[9px] font-semibold uppercase tracking-[0.15em] transition ${
                  filter === item.id
                    ? 'border-white bg-white text-ink'
                    : 'border-white/15 text-neutral-400 hover:border-white/50 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="relative flex min-w-0 items-center border border-white/15 px-3 focus-within:border-white/60 sm:w-56">
              <span className="mr-2 text-neutral-500" aria-hidden="true">⌕</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Find your denim"
                aria-label="Search products"
                className="w-full bg-transparent py-2.5 text-xs outline-none placeholder:text-neutral-600"
              />
            </label>
            <label className="flex items-center justify-between gap-3 border border-white/15 px-3 text-[9px] uppercase tracking-[0.12em] text-neutral-500 sm:justify-start">
              <span>Sort by</span>
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                aria-label="Sort products"
                className="bg-ink py-2.5 text-xs text-white outline-none"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: low to high</option>
                <option value="price-high">Price: high to low</option>
                <option value="name">Name</option>
              </select>
            </label>
          </div>
        </div>

        <div className="mb-4 mt-6 flex items-center justify-between">
          <p className="text-[9px] uppercase tracking-[0.18em] text-neutral-500">
            {products ? `${visibleProducts.length} ${visibleProducts.length === 1 ? 'piece' : 'pieces'}` : 'Loading collection'}
          </p>
          {favorites.size > 0 && <p className="text-[9px] uppercase tracking-[0.16em] text-neutral-500">{favorites.size} saved</p>}
        </div>

        {error && (
          <div role="alert" className="border border-red-900/60 bg-red-950/20 p-5 text-sm text-red-300">
            Could not load the collection: {error}
          </div>
        )}
        {!products && !error && (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {[0, 1, 2, 3].map((item) => (
              <div key={item} className="animate-pulse">
                <div className="aspect-[4/5] bg-white/[0.06]" />
                <div className="mt-4 h-3 w-2/3 bg-white/[0.06]" />
                <div className="mt-2 h-3 w-1/3 bg-white/[0.06]" />
              </div>
            ))}
          </div>
        )}
        {products && visibleProducts.length > 0 && (
          <motion.div layout className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 sm:gap-y-10 md:grid-cols-3 lg:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {visibleProducts.map((product, index) => (
                <motion.article
                  layout
                  key={product.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.28, delay: Math.min(index * 0.035, 0.2) }}
                  className="group min-w-0"
                >
                  <div className="relative overflow-hidden bg-[#171717]">
                    <Link to={`/product/${product.slug}`} aria-label={`View ${product.name}`}>
                      <div className="aspect-[4/5] overflow-hidden">
                        {product.primary_image ? (
                          <img
                            src={product.primary_image}
                            alt={product.name}
                            loading="lazy"
                            className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.06]"
                          />
                        ) : (
                          <div className="grid h-full place-items-center text-[9px] uppercase tracking-[0.2em] text-neutral-600">Leony Jaya</div>
                        )}
                      </div>
                    </Link>
                    <span className="absolute left-3 top-3 bg-ink/80 px-2.5 py-1.5 text-[8px] font-semibold uppercase tracking-[0.16em] backdrop-blur">
                      {product.stock > 0 ? 'Core collection' : 'Sold out'}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleFavorite(product.id)}
                      aria-label={favorites.has(product.id) ? `Remove ${product.name} from saved items` : `Save ${product.name}`}
                      aria-pressed={favorites.has(product.id)}
                      className={`absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-black/45 text-lg backdrop-blur transition hover:scale-110 hover:border-white ${
                        favorites.has(product.id) ? 'text-rose-300' : 'text-white'
                      }`}
                    >
                      {favorites.has(product.id) ? '♥' : '♡'}
                    </button>
                    <Link
                      to={`/product/${product.slug}`}
                      className="absolute bottom-3 left-3 right-3 translate-y-2 bg-white/95 px-3 py-3 text-center text-[9px] font-bold uppercase tracking-[0.17em] text-ink opacity-0 transition duration-300 hover:bg-white group-hover:translate-y-0 group-hover:opacity-100 focus:translate-y-0 focus:opacity-100"
                    >
                      Choose your size
                    </Link>
                  </div>
                  <div className="flex items-start justify-between gap-2 pt-3">
                    <div className="min-w-0">
                      <Link to={`/product/${product.slug}`} className="block font-display text-sm font-medium uppercase leading-snug tracking-wide transition hover:text-neutral-300 sm:text-base">
                        {product.name}
                      </Link>
                      <p className="mt-1.5 text-xs font-medium" style={{ color: product.article_color }}>{rupiah(product.price)}</p>
                    </div>
                    <span className="mt-1 h-3 w-3 shrink-0 rounded-full border border-white/30" style={{ backgroundColor: product.article_color }} aria-label="Product accent colour" />
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-2.5">
                    <span className="text-[8px] uppercase tracking-[0.14em] text-neutral-600">
                      {product.stock > 0 ? `${product.stock} available` : 'Unavailable'}
                    </span>
                    <button
                      type="button"
                      disabled={product.stock <= 0}
                      onClick={() => quickAdd(product)}
                      className="text-[8px] font-semibold uppercase tracking-[0.14em] text-neutral-300 transition hover:text-white disabled:cursor-not-allowed disabled:text-neutral-700"
                    >
                      + Quick add
                    </button>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
        {products && visibleProducts.length === 0 && (
          <div className="border border-white/10 px-5 py-16 text-center">
            <p className="font-display text-2xl uppercase">Nothing found</p>
            <p className="mt-2 text-xs text-neutral-500">Try another search or reset the filters.</p>
            <button
              type="button"
              onClick={() => { setQuery(''); setFilter('all'); }}
              className="mt-5 border border-white/25 px-4 py-3 text-[9px] uppercase tracking-[0.16em] transition hover:border-white"
            >
              Clear filters
            </button>
          </div>
        )}
      </section>

      <AnimatePresence>
        {toast && (
          <motion.div
            role="status"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="fixed bottom-5 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center justify-between gap-4 border border-white/15 bg-[#171717] px-4 py-4 shadow-2xl"
          >
            <span className="text-xs">{toast}</span>
            <Link to="/cart" className="shrink-0 text-[9px] font-bold uppercase tracking-[0.15em] underline underline-offset-4">View bag</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
