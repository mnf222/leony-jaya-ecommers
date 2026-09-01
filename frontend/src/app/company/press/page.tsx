import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata = { title: "Press | Leony Jaya" };

export default function PressPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 w-full">
        <h1 className="font-display text-4xl font-bold tracking-tight">PRESS</h1>
        <p className="text-muted-foreground mt-2">Media kit & liputan Leony Jaya.</p>
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <a href="#" className="rounded-xl border border-border bg-card p-6 hover:bg-card/80">
            <p className="text-sm text-primary">HYPEBEAST • 2026</p>
            <p className="font-medium mt-2">“Iron Wall 21oz — heavyweight yang patut ditunggu”</p>
          </a>
          <a href="#" className="rounded-xl border border-border bg-card p-6 hover:bg-card/80">
            <p className="text-sm text-primary">Highsnobiety • 2026</p>
            <p className="font-medium mt-2">“Leony Jaya brings Okayama craft to SEA”</p>
          </a>
        </div>
        <div className="mt-8 rounded-xl bg-secondary/30 border border-border p-6">
          <h3 className="font-medium">Media Kit</h3>
          <p className="text-sm text-muted-foreground mt-1">Logo, lookbook hi-res, press release: <a href="mailto:press@leonyjaya.com" className="text-primary hover:underline">press@leonyjaya.com</a></p>
        </div>
      </main>
      <Footer />
    </div>
  );
}