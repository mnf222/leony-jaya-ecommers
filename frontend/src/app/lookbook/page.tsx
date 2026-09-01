import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata = { title: "Lookbook | Leony Jaya" };

const looks = [
  { id: 1, title: "RAW DENIM UNIFORM", desc: "14oz selvedge + Type III jacket" },
  { id: 2, title: "DISTRESSED STREET", desc: "Vintage wash + oversized tee" },
  { id: 3, title: "HEAVYWEIGHT WINTER", desc: "Sherpa Type II + 18oz jeans" },
  { id: 4, title: "WORKWEAR CHAMBRAY", desc: "5oz chambray + 12oz stretch" },
  { id: 5, title: "ACID ATTITUDE", desc: "Acid wash full set" },
  { id: 6, title: "INDIGO FADE STORY", desc: "6 months fade evolution" },
];

export default function LookbookPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 w-full">
        <h1 className="font-display text-4xl font-bold tracking-tight">LOOKBOOK</h1>
        <p className="text-muted-foreground mt-2">Galeri koleksi gaya — shoppable. Klik look untuk belanja outfit lengkap.</p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {looks.map((l) => (
            <article key={l.id} className="group relative aspect-[4/5] rounded-xl overflow-hidden bg-secondary border border-border">
              <div className="absolute inset-0 denim-texture opacity-30" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-0 p-6">
                <h3 className="font-display font-bold text-white">{l.title}</h3>
                <p className="text-sm text-white/70">{l.desc}</p>
                <span className="mt-3 inline-flex text-xs font-medium text-white border border-white/30 rounded-full px-3 py-1 group-hover:bg-white group-hover:text-black transition-colors">SHOP LOOK</span>
              </div>
            </article>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}