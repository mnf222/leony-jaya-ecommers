import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuth = create(
  (set) => ({
    user: null,
    setAuth: (user) => set({ user }),
    logout: () => set({ user: null }),
  })
);

export const useCart = create(
  persist(
    (set) => ({
      items: [],
      add: (p, size) =>
        set((s) => {
          const key = `${p.id}-${size}`;
          const existing = s.items.find((i) => i.key === key);
          if (existing) {
            return {
              items: s.items.map((i) =>
                i.key === key ? { ...i, quantity: Math.min(i.quantity + 1, 20) } : i
              ),
            };
          }
          return {
            items: [
              ...s.items,
              {
                key,
                product_id: p.id,
                slug: p.slug,
                name: p.name,
                price: p.price,
                image: p.primary_image,
                color: p.article_color,
                size,
                quantity: 1,
              },
            ],
          };
        }),
      updateQuantity: (key, quantity) =>
        set((s) => ({
          items: quantity < 1
            ? s.items.filter((item) => item.key !== key)
            : s.items.map((item) => item.key === key
              ? { ...item, quantity: Math.min(quantity, 20) }
              : item),
        })),
      remove: (key) => set((s) => ({ items: s.items.filter((i) => i.key !== key) })),
      clear: () => set({ items: [] }),
    }),
    { name: 'lj-cart' }
  )
);
