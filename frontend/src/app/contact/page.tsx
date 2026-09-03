"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 w-full">
        <h1 className="font-display text-4xl font-bold tracking-tight">CONTACT US</h1>
        <p className="text-muted-foreground mt-2">Butuh bantuan sizing, order, atau wholesale? Hubungi kami.</p>

        <div className="mt-8 grid lg:grid-cols-2 gap-8">
          <form className="rounded-xl border border-border bg-card p-8 space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="text-sm font-medium">Name</label>
              <input placeholder="Nama lengkap" className="mt-1 w-full px-4 py-3 rounded-md border border-border bg-background" />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <input type="email" placeholder="you@example.com" className="mt-1 w-full px-4 py-3 rounded-md border border-border bg-background" />
            </div>
            <div>
              <label className="text-sm font-medium">Message</label>
              <textarea rows={4} placeholder="Tanya sizing, resi, dll..." className="mt-1 w-full px-4 py-3 rounded-md border border-border bg-background" />
            </div>
            <button type="submit" className="w-full py-3 bg-primary text-primary-foreground rounded-md font-medium">SEND MESSAGE</button>
          </form>

          <div className="space-y-6">
            <div className="rounded-xl bg-secondary/30 border border-border p-6">
              <h3 className="font-medium">WhatsApp</h3>
              <p className="text-sm text-muted-foreground mt-1">+62 859-2239-3949 (09:00-18:00 WIB)</p>
            </div>
            <div className="rounded-xl bg-secondary/30 border border-border p-6">
              <h3 className="font-medium">Email</h3>
              <p className="text-sm text-muted-foreground mt-1">hello@leonyjaya.com • support@leonyjaya.com</p>
            </div>
            <div className="rounded-xl bg-secondary/30 border border-border p-6">
              <h3 className="font-medium">Studio</h3>
              <p className="text-sm text-muted-foreground mt-1"> Kp.Bojonglaja Rt/Rw 02/16, Bandung — by appointment only</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}