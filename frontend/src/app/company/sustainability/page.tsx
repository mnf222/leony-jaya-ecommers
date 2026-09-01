import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata = { title: "Sustainability | Leony Jaya" };

export default function SustainabilityPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 w-full">
        <h1 className="font-display text-4xl font-bold tracking-tight">SUSTAINABILITY</h1>
        <p className="text-muted-foreground mt-2">Denim berat, buatan untuk dekade — bukan musim.</p>
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          {[
            { t: "Water", d: "Indigo dye 30% less water via rope dye. Jeans kami dicuci sekali, bukan berkali." },
            { t: "Repair", d: "Free chain-stitch hemming & darning seumur hidup untuk setiap Leony Jaya." },
            { t: "No Restock", d: "Produksi terbatas 50-100 pcs menghindari overproduction & deadstock." },
          ].map((x) => (
            <div key={x.t} className="rounded-xl border border-border bg-card p-6">
              <h3 className="font-medium">{x.t}</h3>
              <p className="text-sm text-muted-foreground mt-2">{x.d}</p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}