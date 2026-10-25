import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { requireSupabase } from '../supabase';
import { useAuth } from '../store';
import { translateError } from '../utils';

export default function Login() {
  const setAuth = useAuth((s) => s.setAuth);
  const navigate = useNavigate();
  const { state } = useLocation();
  const [register, setRegister] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', password_confirmation: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setError('');
    try {
      if (register && form.password !== form.password_confirmation) {
        throw new Error('Passwords do not match.');
      }

      const auth = requireSupabase().auth;
      const result = register
        ? await auth.signUp({
            email: form.email,
            password: form.password,
            options: { data: { full_name: form.name, phone: form.phone || null } },
          })
        : await auth.signInWithPassword({ email: form.email, password: form.password });

      if (result.error) throw result.error;

      if (!result.data.session) {
        setMessage('Check your email to confirm your account, then log in.');
        return;
      }

      const user = result.data.user;
      setAuth({
        ...user,
        name: user.user_metadata?.full_name || user.user_metadata?.name || user.email,
      });
      navigate(state?.from || '/');
    } catch (err) {
      setError(translateError(err.message));
    } finally {
      setBusy(false);
    }
  };

  const input = 'w-full border border-white/15 bg-[#101010] px-4 py-3.5 text-sm outline-none transition placeholder:text-neutral-600 focus:border-white/70';

  return (
    <div className="mx-auto grid min-h-[calc(100vh-180px)] max-w-6xl items-center gap-10 px-5 py-12 lg:grid-cols-[1fr_0.85fr] lg:px-8">
      <div className="hidden border-l border-white/15 py-10 pl-10 lg:block">
        <p className="text-[9px] uppercase tracking-[0.28em] text-neutral-500">The everyday, considered</p>
        <h1 className="mt-6 max-w-lg font-display text-6xl font-semibold uppercase leading-[0.95]">
          Good denim<br />goes a long way.
        </h1>
        <p className="mt-5 max-w-sm text-sm leading-7 text-neutral-500">
          Sign in to pick up where you left off, keep your bag close, and make your next pair yours.
        </p>
        <div className="mt-10 flex gap-2">
          {['Considered fit', 'Made for repeat wear', 'Ready for real life'].map((item) => (
            <span key={item} className="border border-white/10 px-3 py-2 text-[8px] uppercase tracking-[0.1em] text-neutral-500">{item}</span>
          ))}
        </div>
      </div>

      <form onSubmit={submit} className="mx-auto w-full max-w-md border border-white/10 bg-[#111] p-6 sm:p-9">
        <p className="text-[9px] uppercase tracking-[0.23em] text-neutral-500">Your Leony Jaya account</p>
        <h2 className="mt-3 font-display text-3xl font-semibold uppercase">{register ? 'Create account' : 'Welcome back'}</h2>
        <p className="mt-2 text-xs leading-5 text-neutral-500">
          {register ? 'A few details and you’re in.' : 'Sign in to continue to your collection.'}
        </p>
        {message && <p role="status" className="mt-5 border border-emerald-900/60 bg-emerald-950/20 p-3 text-xs leading-5 text-emerald-300">{message}</p>}
        {error && <p role="alert" className="mt-5 border border-red-900/60 bg-red-950/20 p-3 text-xs leading-5 text-red-300">{error}</p>}

        <div className="mt-6 space-y-3">
          {register && (
            <input autoComplete="name" className={input} placeholder="Full name" value={form.name} onChange={set('name')} required />
          )}
          <input autoComplete="email" className={input} type="email" placeholder="Email address" value={form.email} onChange={set('email')} required />
          {register && (
            <input autoComplete="tel" className={input} type="tel" placeholder="Phone (optional)" value={form.phone} onChange={set('phone')} />
          )}
          <div className="relative">
            <input
              autoComplete={register ? 'new-password' : 'current-password'}
              className={`${input} pr-20`}
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={form.password}
              onChange={set('password')}
              required
              minLength={8}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-3 text-[9px] uppercase tracking-[0.12em] text-neutral-500 transition hover:text-white">
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {register && (
            <input
              autoComplete="new-password"
              className={input}
              type={showPassword ? 'text' : 'password'}
              placeholder="Confirm password"
              value={form.password_confirmation}
              onChange={set('password_confirmation')}
              required
              minLength={8}
            />
          )}
        </div>

        <button disabled={busy} className="group mt-5 flex w-full items-center justify-between bg-white px-5 py-4 font-display text-xs font-semibold uppercase tracking-[0.2em] text-ink transition hover:bg-neutral-200 disabled:cursor-wait disabled:opacity-50">
          <span>{busy ? 'Please wait…' : register ? 'Create account' : 'Sign in'}</span>
          <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
        </button>
        <button type="button" onClick={() => { setRegister(!register); setError(''); setMessage(''); }}
          className="mt-5 w-full text-center text-[9px] uppercase tracking-[0.13em] text-neutral-500 transition hover:text-white">
          {register ? 'Already have an account? Sign in' : 'New around here? Create an account'}
        </button>
        <p className="mt-6 border-t border-white/10 pt-4 text-center text-[8px] uppercase tracking-[0.12em] text-neutral-600">
          Your account is protected by Supabase authentication
        </p>
      </form>
    </div>
  );
}
