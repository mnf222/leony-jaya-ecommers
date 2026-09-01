import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Newsletter } from "@/components/Newsletter";

export const metadata = { title: "Our Story | Leony Jaya" };

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="font-display text-4xl font-bold tracking-tight">OUR STORY</h1>
          <p className="text-muted-foreground mt-2 max-w-3xl">Leony Jaya lahir dari obsesi pada denim yang menua bersamamu. Kami sourcing dari Okayama & Kojima, shuttle loom vintage, indigo heritage.</p>

          <div className="mt-8 grid lg:grid-cols-2 gap-8">
            <div className="aspect-[4/3] rounded-xl bg-secondary border border-border denim-texture" />
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>Setiap potongan di Jahit dengan double-needle, copper rivet, dan leather patch yang akan patina. Distressing & wash kami kerjakan by hand — tidak ada dua pasang yang identik.</p>
              <p>Model D2C & limited drop memastikan kualitas tanpa markup retail. Kami tidak restock — ketika habis, cerita fade-mu yang melanjutkan.</p>
              <p className="font-medium text-foreground">Denim That Ages With You.</p>
            </div>
          </div>
        </section>
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}