import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";

export const metadata = { title: "All Products | Leony Jaya" };

export default function ShopAllPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 w-full">
        <h1 className="font-display text-4xl font-bold tracking-tight">ALL PRODUCTS</h1>
        <p className="text-muted-foreground mt-2">Semua koleksi denim premium — raw, distressed, jackets, shirts & accessories.</p>
        <div className="mt-8">
          <Link href="/shop" className="inline-flex px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90">
            BROWSE FULL CATALOG →
          </Link>
          <p className="text-sm text-muted-foreground mt-4">Atau pilih kategori: <Link href="/shop/jeans" className="text-primary hover:underline">Jeans</Link> · <Link href="/shop/jackets" className="text-primary hover:underline">Jackets</Link> · <Link href="/shop/accessories" className="text-primary hover:underline">Accessories</Link></p>
        </div>
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Raw Denim", href: "/shop/jeans" },
            { label: "Distressed", href: "/shop/jeans" },
            { label: "Jackets", href: "/shop/jackets" },
            { label: "Accessories", href: "/shop/accessories" },
          ].map((c) => (
            <Link key={c.label} href={c.href} className="aspect-square rounded-xl bg-secondary border border-border flex items-center justify-center font-medium hover:bg-secondary/80 transition-colors">
              {c.label}
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}