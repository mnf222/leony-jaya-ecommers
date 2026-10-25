import { useState } from 'react';
import ProductsTab from '../admin/ProductsTab';
import OrdersTab from '../admin/OrdersTab';

const TABS = [
  { id: 'orders', label: 'Orders' },
  { id: 'products', label: 'Products' },
];

export default function Admin() {
  const [tab, setTab] = useState('orders');

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <h1 className="text-4xl font-bold">Admin</h1>
      <div className="mt-6 flex gap-6 border-b border-white/10">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            aria-pressed={tab === t.id}
            className={`-mb-px border-b-2 pb-3 text-xs font-semibold uppercase tracking-[0.18em] transition ${
              tab === t.id ? 'border-white text-white' : 'border-transparent text-neutral-500 hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="mt-8">{tab === 'orders' ? <OrdersTab /> : <ProductsTab />}</div>
    </div>
  );
}
