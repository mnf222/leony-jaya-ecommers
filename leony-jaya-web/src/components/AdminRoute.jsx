import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getIsAdmin, supabase } from '../supabase';

// UI guard only. The real protection is Row Level Security in the database.
export default function AdminRoute({ children }) {
  const [state, setState] = useState('checking'); // checking | admin | denied | signed-out

  useEffect(() => {
    let active = true;
    (async () => {
      if (!supabase) return active && setState('denied');
      const { data } = await supabase.auth.getSession();
      const userId = data.session?.user?.id;
      if (!userId) return active && setState('signed-out');
      const admin = await getIsAdmin(userId);
      if (active) setState(admin ? 'admin' : 'denied');
    })().catch(() => active && setState('denied'));
    return () => { active = false; };
  }, []);

  if (state === 'admin') return children;
  if (state === 'checking') return <p className="p-20 text-center text-neutral-500">Checking access…</p>;

  return (
    <div className="px-5 py-24 text-center">
      <h1 className="text-3xl font-bold">{state === 'signed-out' ? 'Sign in required' : 'Not authorized'}</h1>
      <p className="mt-3 text-sm text-neutral-500">
        {state === 'signed-out' ? 'Please sign in with an admin account.' : 'This account does not have admin access.'}
      </p>
      <Link
        to={state === 'signed-out' ? '/login' : '/'}
        state={{ from: '/admin' }}
        className="mt-6 inline-block text-xs uppercase tracking-widest text-neutral-400 hover:text-white"
      >
        {state === 'signed-out' ? 'Go to sign in' : 'Back to shop'} &rarr;
      </Link>
    </div>
  );
}
