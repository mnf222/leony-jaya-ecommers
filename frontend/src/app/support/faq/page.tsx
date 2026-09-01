import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata = { title: "FAQ | Leony Jaya" };

const faqs = [
  { q: "Apakah raw denim menyusut?", a: "Ya, unsanforized 14-18oz akan menyusut ~1 inch waist & 2-3cm inseam setelah soak pertama. Kami rekomendasikan true waist." },
  { q: "Berapa lama pengiriman?", a: "Reguler Jawa 2-3 hari, luar Jawa 3-5 hari. Internasional 5-10 hari via DHL." },
  { q: "Bisa hemming?", a: "Ya, free hemming dengan chain stitch. Catat inseam di notes checkout." },
  { q: "Payment apa saja?", a: "VA BCA/Mandiri/BRI, QRIS, GoPay, ShopeePay, Credit Card & PayLater via Midtrans/Xendit." },
  { q: "Drop jam berapa?", a: "Biasanya Jumat 19:00 WIB. Early access untuk Inner Circle 18:00 WIB." },
];

export default function FaqPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 w-full">
        <h1 className="font-display text-4xl font-bold tracking-tight">FAQ</h1>
        <p className="text-muted-foreground mt-2">Pertanyaan umum seputar denim, sizing, dan order.</p>

        <div className="mt-8 space-y-4">
          {faqs.map((f) => (
            <details key={f.q} className="rounded-xl border border-border bg-card p-6 group">
              <summary className="font-medium cursor-pointer list-none flex justify-between items-center">
                {f.q}
                <span className="text-muted-foreground group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-sm text-muted-foreground mt-3">{f.a}</p>
            </details>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}