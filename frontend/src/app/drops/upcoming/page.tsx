"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { api, Product } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { Clock } from "lucide-react";

export default function UpcomingDropsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get<{ data: Product[] }>("/products/upcoming");
        setProducts(res.data ?? []);
      } catch { setProducts([]); } finally { setLoading(false); }
    }
    load();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 w-full">
        <h1 className="font-display text-4xl font-bold tracking-tight">UPCOMING DROPS</h1>
        <p className="text-muted-foreground mt-2">Rilis terbatas terjadwal. Set reminder — stock tidak restock.</p>
        {loading ? <p className="mt-8 text-muted-foreground">Loading...</p> : products.length === 0 ? (
          <div className="mt-8 rounded-xl border border-border bg-card p-8 text-center">
            <Clock className="h-10 w-10 mx-auto opacity-20" />
            <p className="mt-3 font-medium">No upcoming drops saat ini</p>
            <p className="text-sm text-muted-foreground">Cek kembali minggu depan atau subscribe newsletter.</p>
            <Link href="/drops" className="inline-flex mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium">VIEW ALL DROPS</Link>
          </div>
        ) : (
          <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <div key={p.id} className="rounded-xl border border-border bg-card p-6">
                <span className="text-xs px-2 py-1 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">DROP {new Date(p.release_date ?? "").toLocaleDateString()}</span>
                <h3 className="font-medium mt-3 text-lg">{p.title}</h3>
                <p className="text-sm text-muted-foreground">{p.wash_details} • {p.denim_weight}</p>
                <p className="font-bold mt-2">{formatPrice(Number(p.base_price))}</p>
                <p className="text-xs text-muted-foreground mt-2">{p.variants?.length ?? 0} sizes • Total stock {p.variants?.reduce((s, v) => s + v.stock, 0) ?? 0}</p>
                <button className="mt-4 w-full py-2 rounded-md border border-border bg-secondary text-sm font-medium">NOTIFY ME</button>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}