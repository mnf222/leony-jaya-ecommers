"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import { api, Product, PaginatedResponse } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import { ShoppingBag } from "lucide-react";

export default function JacketsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get<PaginatedResponse<Product>>("/products?category=denim-jackets");
        setProducts(res.data ?? []);
      } catch { setProducts([]); } finally { setLoading(false); }
    }
    load();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 w-full">
        <h1 className="font-display text-4xl font-bold tracking-tight">JACKETS</h1>
        <p className="text-muted-foreground mt-2">Type I, II, III trucker & sherpa-lined — layering abadi.</p>
        {loading ? <p className="mt-8 text-muted-foreground">Loading...</p> : products.length === 0 ? <p className="mt-8 text-muted-foreground">No jackets found.</p> : (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <Link key={p.id} href="/shop" className="group block">
                <div className="aspect-4/5 rounded-lg bg-secondary border border-border flex items-center justify-center"><ShoppingBag className="h-8 w-8 opacity-20" /></div>
                <h3 className="mt-3 font-medium group-hover:text-primary">{p.title}</h3>
                <p className="text-sm text-muted-foreground">{p.wash_details}</p>
                <p className="font-medium mt-1">{formatPrice(Number(p.base_price))}</p>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}