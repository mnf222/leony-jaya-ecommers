"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function WholesalePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 w-full">
        <h1 className="font-display text-4xl font-bold tracking-tight">WHOLESALE</h1>
        <p className="text-muted-foreground mt-2">Stock Leony Jaya di store-mu. MOQ rendah, margin fair.</p>
        <div className="mt-8 rounded-xl border border-border bg-card p-8">
          <h3 className="font-medium">Wholesale Terms</h3>
          <ul className="mt-3 text-sm text-muted-foreground list-disc list-inside space-y-1">
            <li>MOQ 20 pcs / style, pre-order 45 hari</li>
            <li>Wholesale 50% off retail, MAP enforced</li>
            <li>Lookbook & size run support</li>
          </ul>
          <form className="mt-6 grid md:grid-cols-2 gap-4" onSubmit={(e) => e.preventDefault()}>
            <input placeholder="Store name" className="px-4 py-3 rounded-md border border-border bg-background" />
            <input placeholder="Email" type="email" className="px-4 py-3 rounded-md border border-border bg-background" />
            <input placeholder="City / Country" className="md:col-span-2 px-4 py-3 rounded-md border border-border bg-background" />
            <button className="md:col-span-2 py-3 bg-primary text-primary-foreground rounded-md font-medium">REQUEST WHOLESALE KIT</button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}