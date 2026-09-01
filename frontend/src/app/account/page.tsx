"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function AccountPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 w-full">
        <h1 className="font-display text-4xl font-bold tracking-tight">ACCOUNT</h1>
        <p className="text-muted-foreground mt-2">Masuk untuk melihat order history, tracking, address book, dan VIP tier.</p>

        <div className="mt-8 grid lg:grid-cols-2 gap-8">
          <div className="rounded-xl border border-border bg-card p-8">
            <h2 className="font-medium text-lg">Login</h2>
            <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <input id="email" type="email" placeholder="you@example.com" className="mt-1 w-full px-4 py-3 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label htmlFor="password" className="text-sm font-medium">Password</label>
                <input id="password" type="password" placeholder="••••••••" className="mt-1 w-full px-4 py-3 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <button type="submit" className="w-full py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90">SIGN IN</button>
              <p className="text-sm text-muted-foreground text-center">Belum punya akun? <a href="#" className="text-primary hover:underline">Daftar</a></p>
            </form>
          </div>

          <div className="rounded-xl border border-border bg-secondary/30 p-8">
            <h3 className="font-medium">VIP Tier Benefits</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex gap-3"><span className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">1</span> Early access drop 1 jam</li>
              <li className="flex gap-3"><span className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">2</span> Loyalty points 10% cashback</li>
              <li className="flex gap-3"><span className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">3</span> Free hemming & repair</li>
            </ul>
            <div className="mt-6 p-4 rounded-md bg-background border border-border">
              <p className="text-sm font-medium">Order Tracking</p>
              <p className="text-xs text-muted-foreground mt-1">Masukkan order number dari email konfirmasi.</p>
              <div className="mt-3 flex gap-2">
                <input placeholder="LJ-2026..." className="flex-1 px-3 py-2 rounded-md border border-border bg-background text-sm" />
                <button className="px-4 py-2 bg-secondary rounded-md text-sm font-medium border border-border">TRACK</button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}