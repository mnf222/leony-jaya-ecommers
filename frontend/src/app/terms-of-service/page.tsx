import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata = { title: "Terms of Service | Leony Jaya" };

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 w-full max-w-3xl">
        <h1 className="font-display text-4xl font-bold tracking-tight">TERMS OF SERVICE</h1>
        <p className="text-sm text-muted-foreground mt-2">Dengan checkout, kamu setuju lock stock 10 menit & atomic stock deduction.</p>
        <div className="mt-8 space-y-4 text-sm text-muted-foreground leading-relaxed">
          <p><span className="font-medium text-foreground">1. Limited Drops:</span> 50-100 pcs, final sale untuk numbered acid wash.</p>
          <p><span className="font-medium text-foreground">2. Pricing:</span> Dalam IDR, exclude ongkir. Harga bisa berubah sebelum drop.</p>
          <p><span className="font-medium text-foreground">3. Resale:</span> Dilarang bot / bulk resell untuk menjaga fair drop.</p>
          <p>Pertanyaan? <a href="/contact" className="text-primary hover:underline">Contact Us</a></p>
        </div>
      </main>
      <Footer />
    </div>
  );
}