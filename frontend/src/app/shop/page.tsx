"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingBag, Filter, Search } from "lucide-react";
import { api, Product, PaginatedResponse } from "@/lib/api";
import { formatPrice } from "@/lib/utils";

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (category) params.set("category", category);
        const query = params.toString() ? `?${params.toString()}` : "";
        const res = await api.get<PaginatedResponse<Product>>(`/products${query}`);
        setProducts(res.data ?? []);
        setError(null);
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Failed to load products. Is backend running on :8000?";
        setError(message);
      } finally {
        setLoading(false);
      }
    }
    // debounce search
    const t = setTimeout(fetchProducts, 300);
    return () => clearTimeout(t);
  }, [search, category]);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="font-display text-xl font-bold">LEONY JAYA</Link>
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">← Back Home</Link>
        </nav>
      </header>

      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight">SHOP ALL</h1>
            <p className="text-muted-foreground text-sm mt-1">{loading ? "Loading..." : `${products.length} products`}</p>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search denim..."
                className="pl-9 pr-4 py-2 rounded-md border border-border bg-background text-sm w-64 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="px-3 py-2 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Categories</option>
              <option value="raw-denim">Raw Denim</option>
              <option value="distressed-jeans">Distressed Jeans</option>
              <option value="denim-jackets">Denim Jackets</option>
              <option value="denim-shirts">Denim Shirts</option>
              <option value="accessories">Accessories</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-md bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
            {error} <br />
            <span className="text-muted-foreground">Make sure backend is running: <code>php artisan serve --port=8000</code></span>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] rounded-lg bg-secondary animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Filter className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p>No products found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <Link key={p.id} href={`/shop/${p.slug}`} className="group block">
                <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-secondary">
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                    <ShoppingBag className="h-8 w-8 opacity-20" />
                  </div>
                  <div className="absolute top-3 left-3 flex gap-1">
                    <span className="px-2 py-0.5 text-xs font-bold rounded bg-primary text-primary-foreground">
                      {p.denim_weight || p.wash_details || "DENIM"}
                    </span>
                  </div>
                  <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-xs font-medium">Stock: {p.variants?.reduce((s, v) => s + v.stock, 0) ?? 0} • {p.variants?.length ?? 0} sizes</span>
                  </div>
                </div>
                <div className="mt-3">
                  <h3 className="font-medium group-hover:text-primary transition-colors line-clamp-1">{p.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-1">{p.wash_details} • {p.denim_weight}</p>
                  <p className="font-medium mt-1">{formatPrice(Number(p.base_price))}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}