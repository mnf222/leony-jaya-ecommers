import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";

export const metadata = { title: "Accessories | Leony Jaya" };

export default function AccessoriesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 w-full">
        <h1 className="font-display text-4xl font-bold tracking-tight">ACCESSORIES</h1>
        <p className="text-muted-foreground mt-2">Belt, cap, dan small leather goods untuk melengkapi denim look.</p>
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          {[
            { name: "Leather Belt - Natural", price: "$89" },
            { name: "Denim Cap - Indigo", price: "$45" },
            { name: "Selvedge Pouch", price: "$59" },
          ].map((a) => (
            <div key={a.name} className="rounded-xl border border-border bg-card p-6">
              <div className="aspect-square rounded-lg bg-secondary border border-border mb-4" />
              <h3 className="font-medium">{a.name}</h3>
              <p className="font-medium mt-1">{a.price}</p>
              <span className="mt-3 inline-block text-xs px-2 py-1 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">Coming Soon</span>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground mt-6">Ingin request accessories? <Link href="/contact" className="text-primary hover:underline">Contact Us</Link></p>
      </main>
      <Footer />
    </div>
  );
}