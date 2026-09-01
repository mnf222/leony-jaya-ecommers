import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata = { title: "Careers | Leony Jaya" };

export default function CareersPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 w-full">
        <h1 className="font-display text-4xl font-bold tracking-tight">CAREERS</h1>
        <p className="text-muted-foreground mt-2">Bergabung dengan tim craft & commerce denim.</p>
        <div className="mt-8 space-y-4">
          {[
            { role: "Denim Pattern Maker", loc: "Bandung" },
            { role: "E-commerce Ops", loc: "Remote" },
            { role: "Content / Lookbook Photographer", loc: "Bandung" },
          ].map((j) => (
            <div key={j.role} className="flex justify-between items-center rounded-xl border border-border bg-card p-6">
              <div><p className="font-medium">{j.role}</p><p className="text-sm text-muted-foreground">{j.loc}</p></div>
              <a href="/contact" className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium">APPLY</a>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground mt-6">Kirim portofolio ke careers@leonyjaya.com</p>
      </main>
      <Footer />
    </div>
  );
}