import { useCallback, useEffect, useState } from 'react';
import { adminListOrders, adminUpdateOrder, getProofUrl } from '../supabase';
import { rupiah, translateError } from '../utils';
import { ghostBtn, inputClass, primaryBtn } from './ui';

const FILTERS = ['all', 'pending', 'paid', 'shipped', 'completed', 'cancelled'];

function nextStatuses(order) {
  if (order.status === 'pending') {
    return order.payment_method === 'cod' ? ['shipped', 'cancelled'] : ['paid', 'cancelled'];
  }
  if (order.status === 'paid') return ['shipped', 'cancelled'];
  if (order.status === 'shipped') return ['completed'];
  return [];
}

const ACTION_LABEL = {
  paid: 'Confirm payment',
  shipped: 'Mark as shipped',
  completed: 'Mark completed',
  cancelled: 'Cancel & restock',
};

function OrderRow({ order, onChanged, onError }) {
  const [busy, setBusy] = useState(false);
  const [resi, setResi] = useState(order.resi_number || '');

  const change = async (status) => {
    if (status === 'shipped' && !resi.trim()) return onError('Enter the tracking number before marking as shipped.');
    if (status === 'cancelled' && !window.confirm(`Cancel order #${order.id}? Stock will be returned.`)) return;
    setBusy(true);
    try {
      const changes = { status };
      if (status === 'shipped' || resi.trim() !== (order.resi_number || '')) changes.resi_number = resi.trim() || null;
      await adminUpdateOrder(order.id, changes);
      await onChanged();
    } catch (e) {
      onError(translateError(e.message));
    } finally {
      setBusy(false);
    }
  };

  const openProof = async () => {
    try {
      window.open(await getProofUrl(order.payment_proof_path), '_blank', 'noopener');
    } catch (e) {
      onError(translateError(e.message));
    }
  };

  const actions = nextStatuses(order);

  return (
    <li className="border border-white/10 bg-[#111] p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-display text-sm font-semibold uppercase tracking-wider">
            Order #{order.id} · <span className="text-neutral-400">{order.status}</span>
          </p>
          <p className="mt-1 text-[10px] text-neutral-500">
            {new Date(order.created_at).toLocaleString('id-ID')} · {order.payment_method}
          </p>
        </div>
        <p className="text-lg font-semibold">{rupiah(order.total_price)}</p>
      </div>

      <ul className="mt-3 text-xs text-neutral-300">
        {order.order_items.map((i) => (
          <li key={i.id}>{i.quantity} × {i.products?.name ?? `Product #${i.product_id}`} <span className="text-neutral-500">(size {i.size})</span></li>
        ))}
      </ul>

      <p className="mt-3 text-[11px] leading-5 text-neutral-400">
        {order.shipping_name ? <>{order.shipping_name} · {order.shipping_phone}<br />{order.shipping_address}</> : 'No shipping details (placed before shipping was required).'}
      </p>

      {order.payment_method !== 'cod' && (
        <p className="mt-3 text-xs">
          {order.payment_proof_path
            ? <button onClick={openProof} className="underline underline-offset-4 hover:text-white">View payment proof</button>
            : <span className="text-neutral-500">No payment proof uploaded yet.</span>}
        </p>
      )}

      {actions.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-white/10 pt-4">
          {(order.status === 'paid' || (order.status === 'pending' && order.payment_method === 'cod')) && (
            <input value={resi} onChange={(e) => setResi(e.target.value)} placeholder="Tracking number (resi)" maxLength={100} className={`${inputClass} max-w-[14rem]`} />
          )}
          {actions.map((s) => (
            <button key={s} disabled={busy} onClick={() => change(s)} className={s === 'cancelled' ? ghostBtn : primaryBtn}>
              {ACTION_LABEL[s]}
            </button>
          ))}
        </div>
      )}
      {order.status === 'shipped' && order.resi_number && (
        <p className="mt-3 text-xs text-neutral-400">Tracking: {order.resi_number}</p>
      )}
    </li>
  );
}

export default function OrdersTab() {
  const [orders, setOrders] = useState(null);
  const [filter, setFilter] = useState('pending');
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      setOrders(await adminListOrders());
      setError('');
    } catch (e) {
      setError(translateError(e.message));
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const visible = (orders ?? []).filter((o) => filter === 'all' || o.status === filter);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
            className={`border px-3 py-2 text-[9px] uppercase tracking-[0.16em] transition ${filter === f ? 'border-white text-white' : 'border-white/15 text-neutral-500 hover:text-white'}`}
          >
            {f}{orders && f !== 'all' ? ` (${orders.filter((o) => o.status === f).length})` : ''}
          </button>
        ))}
        <button onClick={load} className="ml-auto text-[10px] uppercase tracking-[0.14em] text-neutral-500 underline underline-offset-4 hover:text-white">Refresh</button>
      </div>
      {error && <p role="alert" className="mt-4 text-sm text-red-400">{error}</p>}
      {!orders && !error && <p className="mt-6 text-neutral-500">Loading…</p>}
      {orders && visible.length === 0 && <p className="mt-6 text-neutral-500">No orders in this view.</p>}
      <ul className="mt-6 space-y-4">
        {visible.map((o) => <OrderRow key={o.id} order={o} onChanged={load} onError={setError} />)}
      </ul>
    </div>
  );
}
