import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata = { title: "Returns & Exchanges | Leony Jaya" };

export default function ReturnsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 w-full">
        <h1 className="font-display text-4xl font-bold tracking-tight">RETURNS & EXCHANGES</h1>
        <p className="text-muted-foreground mt-2">30-day return policy untuk unworn dengan tag terpasang.</p>

        <div className="mt-8 space-y-6">
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-medium">Syarat Return</h3>
            <ol className="list-decimal list-inside mt-3 text-sm text-muted-foreground space-y-1">
              <li>Belum dicuci / di-soak / di-alter</li>
              <li>Tag & packaging lengkap</li>
              <li>Ajukan via /contact dalam 30 hari</li>
            </ol>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-medium">Exchange Ukuran</h3>
            <p className="text-sm text-muted-foreground mt-2">Gratis 1x exchange jika stock tersedia. Raw denim disarankan konsultasi <a href="/size-guide" className="text-primary hover:underline">Size Guide</a> dulu untuk hindari shrink.</p>
          </div>
          <div className="rounded-xl bg-secondary/30 border border-border p-6 text-sm">
            <p className="font-medium">Tidak bisa return:</p>
            <p className="text-muted-foreground">Acid wash / limited numbered pieces (100 pcs) — final sale.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}