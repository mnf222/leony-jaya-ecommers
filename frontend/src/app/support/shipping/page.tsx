import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata = { title: "Shipping Info | Leony Jaya" };

export default function ShippingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 w-full">
        <h1 className="font-display text-4xl font-bold tracking-tight">SHIPPING INFO</h1>
        <p className="text-muted-foreground mt-2">Pengiriman via JNE, J&T, SiCepat, POS. Kalkulasi berat otomatis, estimasi real-time.</p>

        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-medium">Domestik</h3>
            <ul className="mt-3 text-sm text-muted-foreground space-y-2">
              <li>• Free shipping &gt; Rp 2.000.000 (20000 cents) • Reguler 2-4 hari, Express 1-2 hari</li>
              <li>• Berat denim: jeans ~800g, jacket ~1200g</li>
              <li>• Resi otomatis, tracking real-time di /account</li>
            </ul>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-medium">Internasional</h3>
            <ul className="mt-3 text-sm text-muted-foreground space-y-2">
              <li>• DHL / FedEx, 5-10 hari</li>
              <li>• Bea cukai ditanggung penerima</li>
              <li>• Wholesale hubungi /company/wholesale</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 rounded-xl bg-secondary/30 border border-border p-6 text-sm">
          <p><span className="font-medium">Cut-off:</span> Order sebelum 15:00 WIB dikirim hari yang sama (Senin-Jumat).</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}