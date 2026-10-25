import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { placeOrder } from '../supabase';
import { useAuth, useCart } from '../store';
import { rupiah, translateError } from '../utils';
import PaymentInstructions from '../components/PaymentInstructions';

export default function Cart() {
  const items = useCart((state) => state.items);
  const remove = useCart((state) => state.remove);
  const clear = useCart((state) => state.clear);
  const updateQuantity = useCart((state) => state.updateQuantity);
  const user = useAuth((s) => s.user);
  const navigate = useNavigate();
  const [payment, setPayment] = useState('bank_transfer');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [order, setOrder] = useState(null);
  const [shipping, setShipping] = useState({
    name: user?.user_metadata?.full_name || '',
    phone: '',
    address: '',
  });
  const setField = (field) => (e) => setShipping((s) => ({ ...s, [field]: e.target.value }));

  const total = items.reduce((n, i) => n + i.price * i.quantity, 0);

  const checkout = async () => {
    if (!user) return navigate('/login', { state: { from: '/cart' } });

    const details = {
      name: shipping.name.trim(),
      phone: shipping.phone.trim(),
      address: shipping.address.trim(),
    };
    if (details.name.length < 2) return setError('Please enter your full name.');
    if (!/^\+?[0-9][0-9 -]{7,18}$/.test(details.phone)) return setError('Please enter a valid phone number.');
    if (details.address.length < 10) return setError('Please enter your full shipping address.');

    setBusy(true); setError('');
    try {
      const result = await placeOrder(
        payment,
        items.map((i) => ({ product_id: i.product_id, quantity: i.quantity, size: i.size })),
        details
      );
      setOrder({ ...result, payment_method: payment });
      clear();
    } catch (e) {
      setError(translateError(e.message));
    } finally {
      setBusy(false);
    }
  };

  if (order) {
    return (
      <div className="mx-auto max-w-xl px-5 py-24 text-center">
        <h1 className="text-4xl font-bold">Order placed</h1>
        <p className="mt-4 text-neutral-400">
          Order #{order.id} &middot; {rupiah(order.total_price)} &middot; status: {order.status}
        </p>
        <div className="mx-auto mt-8 max-w-sm border border-white/10 bg-[#111] p-5 text-left">
          <p className="mb-3 text-[9px] uppercase tracking-[0.17em] text-neutral-500">How to pay</p>
          <PaymentInstructions method={order.payment_method} deadline={order.expires_at} />
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link to="/orders" className="inline-block bg-white px-8 py-3 text-xs font-semibold uppercase tracking-widest text-ink hover:bg-neutral-200">
            My orders
          </Link>
          <Link to="/" className="inline-block border border-white px-8 py-3 text-xs uppercase tracking-widest hover:bg-white hover:text-ink">
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="px-5 py-24 text-center">
        <h1 className="text-3xl font-bold">Your cart is empty</h1>
        <Link to="/" className="mt-6 inline-block text-xs uppercase tracking-widest text-neutral-400 hover:text-white">Browse denim &rarr;</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <h1 className="text-4xl font-bold">Cart</h1>
      <ul className="mt-8 divide-y divide-white/10 border-y border-white/10">
        {items.map((i) => (
          <li key={i.key} className="flex items-start gap-3 py-5 sm:gap-5">
            <Link to={i.slug ? `/product/${i.slug}` : '/'} className="h-28 w-20 shrink-0 overflow-hidden border border-white/10 bg-[#171717] sm:h-32 sm:w-24" style={{ borderColor: `${i.color}66` }}>
              {i.image && <img src={i.image} alt="" className="h-full w-full object-cover" />}
            </Link>
            <div className="min-w-0 flex-1">
              <Link to={i.slug ? `/product/${i.slug}` : '/'} className="font-display text-sm font-semibold uppercase transition hover:text-neutral-300">{i.name}</Link>
              <p className="mt-1 text-xs text-neutral-500">Size {i.size}</p>
              <div className="mt-3 inline-flex items-center border border-white/15">
                <button
                  type="button"
                  aria-label={`Decrease quantity of ${i.name}`}
                  onClick={() => updateQuantity(i.key, i.quantity - 1)}
                  className="grid h-8 w-9 place-items-center text-sm text-neutral-400 transition hover:bg-white/10 hover:text-white"
                >−</button>
                <span className="min-w-8 text-center text-xs tabular-nums">{i.quantity}</span>
                <button
                  type="button"
                  aria-label={`Increase quantity of ${i.name}`}
                  disabled={i.quantity >= 20}
                  onClick={() => updateQuantity(i.key, i.quantity + 1)}
                  className="grid h-8 w-9 place-items-center text-sm text-neutral-400 transition hover:bg-white/10 hover:text-white disabled:opacity-30"
                >+</button>
              </div>
              <button onClick={() => remove(i.key)} className="ml-3 text-[9px] uppercase tracking-[0.12em] text-neutral-600 underline underline-offset-4 transition hover:text-white">Remove</button>
            </div>
            <p className="shrink-0 pt-1 text-xs font-semibold sm:text-sm" style={{ color: i.color }}>{rupiah(i.price * i.quantity)}</p>
          </li>
        ))}
      </ul>

      <div className="mt-8 border border-white/10 bg-[#111] p-5 sm:p-7">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-[0.18em] text-neutral-500">Estimated total</span>
          <span className="font-display text-2xl font-semibold">{rupiah(total)}</span>
        </div>
        <p className="mt-2 text-[10px] leading-5 text-neutral-600">Final stock and prices are confirmed securely when your order is placed.</p>

        <p className="mt-7 text-[9px] uppercase tracking-[0.17em] text-neutral-500">Shipping details</p>
        <div className="mt-2 grid gap-3">
          <input value={shipping.name} onChange={setField('name')} placeholder="Full name" autoComplete="name" maxLength={100}
            className="w-full border border-white/15 bg-ink px-4 py-3.5 text-xs outline-none transition focus:border-white" />
          <input value={shipping.phone} onChange={setField('phone')} placeholder="Phone / WhatsApp (e.g. 0812…)" autoComplete="tel" inputMode="tel" maxLength={20}
            className="w-full border border-white/15 bg-ink px-4 py-3.5 text-xs outline-none transition focus:border-white" />
          <textarea value={shipping.address} onChange={setField('address')} placeholder="Full address (street, district, city, province, postal code)" autoComplete="street-address" rows={3} maxLength={500}
            className="w-full resize-none border border-white/15 bg-ink px-4 py-3.5 text-xs outline-none transition focus:border-white" />
        </div>

        <label className="mt-7 block text-[9px] uppercase tracking-[0.17em] text-neutral-500">Payment method</label>
        <select value={payment} onChange={(e) => setPayment(e.target.value)}
          className="mt-2 w-full border border-white/15 bg-ink px-4 py-3.5 text-xs outline-none transition focus:border-white">
          <option value="bank_transfer">Bank transfer</option>
          <option value="qris">QRIS</option>
          <option value="cod">Cash on delivery</option>
        </select>

        <button onClick={checkout} disabled={busy}
          className="group mt-5 flex w-full items-center justify-between bg-white px-5 py-4 font-display text-xs font-semibold uppercase tracking-[0.2em] text-ink transition hover:bg-neutral-200 disabled:cursor-wait disabled:opacity-50">
          <span>{busy ? 'Placing order…' : user ? 'Secure checkout' : 'Login to checkout'}</span>
          <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
        </button>
        {error && <p role="alert" className="mt-3 text-xs text-red-400">{error}</p>}
        <p className="mt-4 text-center text-[8px] uppercase tracking-[0.15em] text-neutral-600">Your order is protected by secure checkout</p>
      </div>
    </div>
  );
}
