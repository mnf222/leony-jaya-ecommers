import { useEffect, useState } from 'react';
import { Link, NavLink, Route, Routes } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Product from './pages/Product.jsx';
import Cart from './pages/Cart.jsx';
import Login from './pages/Login.jsx';
import { useAuth, useCart } from './store';
import { requireSupabase, supabase } from './supabase';
import { translateError } from './utils';

function Navbar() {
  const count = useCart((s) => s.items.reduce((n, i) => n + i.quantity, 0));
  const user = useAuth((s) => s.user);
  const logout = useAuth((s) => s.logout);
  const [error, setError] = useState('');

  const handleLogout = async () => {
    try {
      const { error: signOutError } = await requireSupabase().auth.signOut();
      if (signOutError) throw signOutError;
      logout();
    } catch (signOutError) {
      setError(translateError(signOutError.message));
    }
  };

  return (
    <>
      <div className="bg-white px-4 py-2 text-center text-[9px] font-semibold uppercase tracking-[0.24em] text-ink sm:text-[10px]">
        Thoughtful denim. Made to be worn on repeat.
      </div>
      <header className="sticky top-0 z-30 border-b border-white/10 bg-ink/90 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link to="/" className="group flex items-center gap-3" aria-label="Leony Jaya home">
            <span className="grid h-9 w-9 place-items-center border border-white/30 font-display text-lg transition group-hover:border-white">
              L
            </span>
            <span>
              <span className="block font-display text-sm font-bold uppercase tracking-[0.19em]">Leony Jaya</span>
              <span className="mt-0.5 block text-[8px] uppercase tracking-[0.28em] text-neutral-500">Denim department</span>
            </span>
          </Link>
          <div className="hidden items-center gap-8 text-[10px] font-semibold uppercase tracking-[0.2em] md:flex">
            <NavLink to="/" end className={({ isActive }) => `transition hover:text-white ${isActive ? 'text-white' : 'text-neutral-500'}`}>
              Collection
            </NavLink>
            <a href="/#story" className="text-neutral-500 transition hover:text-white">Our point of view</a>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            {user ? (
              <button onClick={handleLogout} className="hidden text-[10px] uppercase tracking-[0.16em] text-neutral-400 transition hover:text-white sm:block">
                Sign out
              </button>
            ) : (
              <Link to="/login" className="hidden text-[10px] uppercase tracking-[0.16em] text-neutral-400 transition hover:text-white sm:block">Account</Link>
            )}
            <Link to="/cart" className="group flex items-center gap-2 border border-white/20 px-3 py-2 text-[10px] uppercase tracking-[0.15em] transition hover:border-white">
              <span>Bag</span>
              <span className="grid h-5 min-w-5 place-items-center rounded-full bg-white px-1 text-[9px] font-bold text-ink transition group-hover:bg-neutral-200">{count}</span>
            </Link>
          </div>
        </nav>
        {error && <p className="mx-auto max-w-7xl px-5 pb-3 text-xs text-red-400">{error}</p>}
      </header>
    </>
  );
}

function CustomerService() {
  const [open, setOpen] = useState(false);
  const message = encodeURIComponent('Hi Leony Jaya, I need help with my order.');

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3 sm:bottom-7 sm:right-7">
      {open && (
        <section
          aria-label="Customer service contact options"
          className="w-[min(20rem,calc(100vw-2.5rem))] border border-white/15 bg-[#151515] p-5 shadow-2xl shadow-black/50"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[8px] uppercase tracking-[0.2em] text-neutral-500">Leony Jaya support</p>
              <h2 className="mt-1 font-display text-lg font-semibold uppercase">How can we help?</h2>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close customer service"
              className="grid h-8 w-8 place-items-center border border-white/15 text-neutral-400 transition hover:border-white hover:text-white"
            >
              ×
            </button>
          </div>
          <p className="mt-2 text-xs leading-5 text-neutral-400">
            Questions about a product or your order? Get in touch with our team.
          </p>
          <a
            href={`https://wa.me/6285922393949?text=${message}`}
            target="_blank"
            rel="noreferrer"
            className="mt-4 flex items-center justify-between bg-white px-4 py-3 text-[9px] font-bold uppercase tracking-[0.15em] text-ink transition hover:bg-neutral-200"
          >
            <span>Chat with us on WhatsApp</span><span aria-hidden="true">↗</span>
          </a>
          <a
            href="mailto:leonyjaya01@gmail.com?subject=Customer%20service"
            className="mt-3 block text-center text-[9px] uppercase tracking-[0.13em] text-neutral-400 underline underline-offset-4 transition hover:text-white"
          >
            Email customer service
          </a>
        </section>
      )}
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-label={open ? 'Close customer service' : 'Open customer service'}
        className="group grid h-14 w-14 place-items-center rounded-full border border-white/20 bg-white text-ink shadow-lg shadow-black/30 transition hover:-translate-y-0.5 hover:scale-105 hover:bg-neutral-200"
      >
        {open ? (
          <span className="text-2xl leading-none" aria-hidden="true">×</span>
        ) : (
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            className="h-6 w-6"
          >
            <path d="M5 18.5 3.75 21l3.6-1.2A9 9 0 1 0 5 18.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8.5 11.8h7M8.5 8.8h4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        )}
      </button>
    </div>
  );
}

export default function App() {
  const setAuth = useAuth((s) => s.setAuth);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    if (!supabase) return undefined;

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user;
      setAuth(user ? {
        ...user,
        name: user.user_metadata?.full_name || user.user_metadata?.name || user.email,
      } : null);
    });

    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        setAuthError(`Could not restore your Supabase session: ${translateError(error.message)}`);
        return;
      }

      const user = data.session?.user;
      setAuth(user ? {
        ...user,
        name: user.user_metadata?.full_name || user.user_metadata?.name || user.email,
      } : null);
    }).catch((error) => setAuthError(`Could not restore your Supabase session: ${translateError(error.message)}`));

    return () => subscription.unsubscribe();
  }, [setAuth]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {authError && <p className="mx-auto max-w-7xl px-5 pt-4 text-sm text-red-400">{authError}</p>}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:slug" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="*"
            element={<p className="p-20 text-center text-neutral-500">Page not found.</p>}
          />
        </Routes>
      </main>
      <footer id="story" className="border-t border-white/10 bg-[#101010]">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-10 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr] lg:px-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <p className="font-display text-lg font-semibold uppercase tracking-[0.18em]">Wear it your way.</p>
            <p className="mt-2 max-w-sm text-xs leading-6 text-neutral-500">Considered fits, honest materials, and denim that gets better with every wear.</p>
            <p className="mt-5 text-[9px] uppercase tracking-[0.16em] text-neutral-500">Based in Bandung Regency, Indonesia</p>
          </div>
          <div>
            <h2 className="font-display text-sm font-semibold uppercase tracking-[0.18em]">Get in touch</h2>
            <div className="mt-4 grid gap-3 text-xs sm:grid-cols-2">
              <a
                href="mailto:leonyjaya01@gmail.com"
                className="group flex items-center justify-between border border-white/10 px-4 py-3 transition hover:border-white/40"
              >
                <span>
                  <span className="block text-[8px] uppercase tracking-[0.15em] text-neutral-600">Email</span>
                  <span className="mt-1 block text-neutral-300 transition group-hover:text-white">leonyjaya01@gmail.com</span>
                </span>
                <span aria-hidden="true" className="text-neutral-600 transition group-hover:translate-x-1 group-hover:text-white">↗</span>
              </a>
              <a
                href="https://wa.me/6285922393949"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between border border-white/10 px-4 py-3 transition hover:border-white/40"
              >
                <span>
                  <span className="block text-[8px] uppercase tracking-[0.15em] text-neutral-600">WhatsApp</span>
                  <span className="mt-1 block text-neutral-300 transition group-hover:text-white">+62 859-2239-3949</span>
                </span>
                <span aria-hidden="true" className="text-neutral-600 transition group-hover:translate-x-1 group-hover:text-white">↗</span>
              </a>
              <a
                href="https://www.instagram.com/leony.jaya/"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between border border-white/10 px-4 py-3 transition hover:border-white/40"
              >
                <span>
                  <span className="block text-[8px] uppercase tracking-[0.15em] text-neutral-600">Instagram</span>
                  <span className="mt-1 block text-neutral-300 transition group-hover:text-white">@leony.jaya</span>
                </span>
                <span aria-hidden="true" className="text-neutral-600 transition group-hover:translate-x-1 group-hover:text-white">↗</span>
              </a>
            </div>
          </div>
          <p className="border-t border-white/10 pt-5 text-[9px] uppercase tracking-[0.22em] text-neutral-600 sm:col-span-2">
            &copy; {new Date().getFullYear()} Leony Jaya Collection · Made for the long run
          </p>
        </div>
      </footer>
      <CustomerService />
    </div>
  );
}
