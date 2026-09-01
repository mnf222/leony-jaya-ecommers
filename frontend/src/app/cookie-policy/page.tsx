import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata = { title: "Cookie Policy | Leony Jaya" };

export default function CookiePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 w-full max-w-3xl">
        <h1 className="font-display text-4xl font-bold tracking-tight">COOKIE POLICY</h1>
        <p className="text-sm text-muted-foreground mt-2">Kami pakai cookies untuk cart, login, dan analytics.</p>
        <div className="mt-8 space-y-4 text-sm text-muted-foreground">
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-medium text-foreground">Necessary</h3>
            <p>Session, cart lock 10 menit, CSRF — wajib aktif.</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-medium text-foreground">Analytics</h3>
            <p>Anonymous page view untuk improve drop load. Bisa opt-out di browser.</p>
          </div>
          <p>Kelola via browser settings. Lanjut browsing = setuju.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}