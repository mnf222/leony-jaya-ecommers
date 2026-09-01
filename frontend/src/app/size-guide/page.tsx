import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata = { title: "Size Guide | Leony Jaya" };

export default function SizeGuidePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 w-full">
        <h1 className="font-display text-4xl font-bold tracking-tight">SIZE GUIDE</h1>
        <p className="text-muted-foreground mt-2">Panduan ukuran untuk Slim Fit, Relaxed Fit, Oversized, dan Denim Jackets. Semua ukuran dalam cm. Raw denim akan menyusut 1-2cm setelah soak.</p>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="px-6 py-4 border-b border-border font-medium">Jeans - Slim Fit (14oz/18oz)</div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-secondary/50 text-muted-foreground">
                  <tr><th className="px-4 py-3 text-left">Size</th><th className="px-4 py-3">Waist</th><th className="px-4 py-3">Inseam</th><th className="px-4 py-3">Thigh</th><th className="px-4 py-3">Hem</th></tr>
                </thead>
                <tbody>
                  {[
                    ["28", "71", "86", "56", "38"],
                    ["30", "76", "86", "58", "39"],
                    ["32", "81", "86", "60", "40"],
                    ["34", "86", "86", "62", "41"],
                    ["36", "91", "86", "64", "42"],
                  ].map((r) => (
                    <tr key={r[0]} className="border-t border-border"><td className="px-4 py-3 font-medium">{r[0]}</td><td className="px-4 py-3 text-center">{r[1]}</td><td className="px-4 py-3 text-center">{r[2]}</td><td className="px-4 py-3 text-center">{r[3]}</td><td className="px-4 py-3 text-center">{r[4]}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="px-6 py-4 border-b border-border font-medium">Denim Jackets - Type II / III</div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-secondary/50 text-muted-foreground">
                  <tr><th className="px-4 py-3 text-left">Size</th><th className="px-4 py-3">Chest</th><th className="px-4 py-3">Length</th><th className="px-4 py-3">Sleeve</th></tr>
                </thead>
                <tbody>
                  {[
                    ["S", "104", "62", "64"],
                    ["M", "109", "64", "65"],
                    ["L", "114", "66", "66"],
                    ["XL", "119", "68", "67"],
                  ].map((r) => (
                    <tr key={r[0]} className="border-t border-border"><td className="px-4 py-3 font-medium">{r[0]}</td><td className="px-4 py-3 text-center">{r[1]}</td><td className="px-4 py-3 text-center">{r[2]}</td><td className="px-4 py-3 text-center">{r[3]}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-xl bg-secondary/30 border border-border p-6">
          <h3 className="font-medium">Tips Fit</h3>
          <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1">
            <li>Raw denim: ambil true waist, akan stretch 1 inch setelah 2 minggu pakai.</li>
            <li>Oversized: size down 1 untuk fit regular.</li>
            <li>Ragu? Chat via <a href="/contact" className="text-primary hover:underline">Contact Us</a>.</li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
}