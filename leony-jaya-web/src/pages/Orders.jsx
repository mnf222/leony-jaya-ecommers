import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { cancelOrder, listMyOrders, uploadPaymentProof } from '../supabase';
import { useAuth } from '../store';
import { rupiah, translateError } from '../utils';
import PaymentInstructions from '../components/PaymentInstructions';

const STATUS_STYLE = {
  pending: 'border-amber-400/40 text-amber-300',
  paid: 'border-sky-400/40 text-sky-300',
  shipped: 'border-indigo-400/40 text-indigo-300',
  completed: 'border-emerald-400/40 text-emerald-300',
  cancelled: 'border-white/15 text-neutral-500',
};

const METHOD_LABEL = { bank_transfer: 'Bank transfer', qris: 'QRIS', cod: 'Cash on delivery' };

function OrderCard({ order, userId, onChanged }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const needsProof = order.status === 'pending' && order.payment_method !== 'cod';

  const run = async (action) => {
    setBusy(true); setError('');
    try {
      await action();
      await onChanged();
    } catch (e) {
      setError(translateError(e.message));
    } finally {
      setBusy(false);
    }
  };

  const onFile = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (file) run(() => uploadPaymentProof(userId, order.id, file));
  };

  return (
    <li className="border border-white/10 bg-[#111] p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-display text-sm font-semibold uppercase tracking-wider">Order #{order.id}</p>
          <p className="mt-1 text-[10px] text-neutral-500">
            {new Date(order.created_at).toLocaleString('id-ID')} · {METHOD_LABEL[order.payment_method] || order.payment_method}
          </p>
        </div>
        <span className={`border px-3 py-1.5 text-[9px] uppercase tracking-[0.16em] ${STATUS_STYLE[order.status] || ''}`}>
          {order.status}
        </span>
      </div>

      <ul className="mt-4 divide-y divide-white/5 text-xs text-neutral-300">
        {order.order_items.map((i) => (
          <li key={i.id} className="flex justify-between gap-3 py-2">
            <span>{i.quantity} × {i.products?.name ?? 'Product'} <span className="text-neutral-500">(size {i.size})</span></span>
            <span className="shrink-0">{rupiah(i.price * i.quantity)}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 flex justify-between text-sm font-semibold">
        <span>Total</span><span>{rupiah(order.total_price)}</span>
      </p>

      {order.shipping_address && (
        <p className="mt-3 text-[11px] leading-5 text-neutral-500">
          Ship to {order.shipping_name} · {order.shipping_phone}<br />{order.shipping_address}
        </p>
      )}
      {order.resi_number && (
        <p className="mt-3 text-xs">Tracking number: <span className="font-semibold">{order.resi_number}</span></p>
      )}

      {needsProof && (
        <div className="mt-4 space-y-4 border-t border-white/10 pt-4">
          {order.payment_proof_path ? (
            <p className="text-xs text-emerald-300">Payment proof received. We will confirm your payment shortly.</p>
          ) : (
            <>
              <PaymentInstructions method={order.payment_method} deadline={order.expires_at} />
              <label className="inline-block cursor-pointer bg-white px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink transition hover:bg-neutral-200">
                {busy ? 'Uploading…' : 'Upload payment proof'}
                <input type="file" accept="image/jpeg,image/png,image/webp" onChange={onFile} disabled={busy} className="hidden" />
              </label>
            </>
          )}
        </div>
      )}

      {order.status === 'pending' && (
        <button
          disabled={busy}
          onClick={() => window.confirm('Cancel this order?') && run(() => cancelOrder(order.id))}
          className="mt-4 block text-[10px] uppercase tracking-[0.14em] text-neutral-500 underline underline-offset-4 transition hover:text-red-400 disabled:opacity-40"
        >
          Cancel order
        </button>
      )}
      {error && <p role="alert" className="mt-3 text-xs text-red-400">{error}</p>}
    </li>
  );
}

export default function Orders() {
  const user = useAuth((s) => s.user);
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!user) return;
    try {
      setOrders(await listMyOrders(user.id));
      setError('');
    } catch (e) {
      setError(translateError(e.message));
    }
  }, [user]);

  useEffect(() => { load(); }, [load]);

  if (!user) {
    return (
      <div className="px-5 py-24 text-center">
        <h1 className="text-3xl font-bold">My orders</h1>
        <Link to="/login" state={{ from: '/orders' }} className="mt-6 inline-block text-xs uppercase tracking-widest text-neutral-400 hover:text-white">
          Sign in to see your orders &rarr;
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <h1 className="text-4xl font-bold">My orders</h1>
      {error && <p role="alert" className="mt-6 text-sm text-red-400">{error}</p>}
      {!orders && !error && <p className="mt-8 text-neutral-500">Loading…</p>}
      {orders?.length === 0 && (
        <p className="mt-8 text-neutral-500">
          No orders yet. <Link to="/" className="underline underline-offset-4 hover:text-white">Browse the collection</Link>
        </p>
      )}
      <ul className="mt-8 space-y-5">
        {orders?.map((o) => <OrderCard key={o.id} order={o} userId={user.id} onChanged={load} />)}
      </ul>
    </div>
  );
}
