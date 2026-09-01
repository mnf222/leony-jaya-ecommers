import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import { Timer, Flame, ArrowRight } from "lucide-react";

export const metadata = { title: "Drops | Leony Jaya" };

const drops = [
  { id: 1, title: '21oz "Iron Wall" Selvedge', date: "13 Sep 2026", status: "Upcoming", weight: "21oz", price: "$449" },
  { id: 2, title: '14oz Japanese Selvedge', date: "31 Jul 2026", status: "Available", weight: "14oz", price: "$289" },
  { id: 3, title: "Acid Wash Oversized", date: "23 Aug 2026", status: "Low Stock", weight: "13oz", price: "$399" },
];

export default function DropsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-3 mb-2">
            <Flame className="h-6 w-6 text-primary" />
            <span className="text-sm font-medium tracking-widest text-primary">LIMITED RELEASE</span>
          </div>
          <h1 className="font-display text-4xl font-bold tracking-tight">DROPS</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">Setiap drop adalah rilis terbatas. 50-100 pcs worldwide. Sekali habis, tidak restock. Ikuti countdown dan secure ukuranmu.</p>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {drops.map((d) => (
              <div key={d.id} className="rounded-xl border border-border bg-card p-6 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${d.status === "Upcoming" ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" : d.status === "Low Stock" ? "bg-red-500/20 text-red-400 border border-red-500/30" : "bg-green-500/20 text-green-400 border border-green-500/30"}`}>{d.status}</span>
                  <span className="text-xs text-muted-foreground">{d.weight}</span>
                </div>
                <h3 className="font-medium text-lg">{d.title}</h3>
                <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5"><Timer className="h-4 w-4" /> {d.date}</p>
                <p className="font-display font-bold mt-4 text-xl">{d.price}</p>
                <Link href={d.status === "Upcoming" ? "/drops/upcoming" : "/shop"} className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:gap-3 transition-all">
                  {d.status === "Upcoming" ? "Notify Me" : "Shop Now"} <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-xl bg-secondary/30 border border-border p-8 text-center">
            <h2 className="font-display text-2xl font-bold">Jangan Ketinggalan Drop</h2>
            <p className="text-muted-foreground mt-2">Daftar newsletter untuk early access 1 jam sebelum public.</p>
            <Link href="/#newsletter" className="inline-flex mt-4 px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium">JOIN THE INNER CIRCLE</Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}