import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata = { title: "Privacy Policy | Leony Jaya" };

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 w-full max-w-3xl">
        <h1 className="font-display text-4xl font-bold tracking-tight">PRIVACY POLICY</h1>
        <p className="text-sm text-muted-foreground mt-2">Last updated: 30 Aug 2026</p>
        <div className="mt-8 prose prose-invert prose-sm max-w-none space-y-4 text-muted-foreground">
          <p>Kami mengumpulkan email, alamat, dan data order untuk fulfillment via Midtrans/Xendit & RajaOngkir/Biteship. Tidak menjual data.</p>
          <h3 className="font-medium text-foreground">Cookies</h3>
          <p>Gunakan untuk cart, session, analytics anonymized. Lihat <a href="/cookie-policy" className="text-primary hover:underline">Cookie Policy</a>.</p>
          <h3 className="font-medium text-foreground">Hak Anda</h3>
          <p>Request hapus data via hello@leonyjaya.com — diproses 14 hari.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}