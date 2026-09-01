"use client";

import { useState } from "react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    // simulate API - replace with real /api/newsletter
    await new Promise((r) => setTimeout(r, 800));
    setStatus("success");
    setEmail("");
    setTimeout(() => setStatus("idle"), 3000);
  }

  return (
    <section className="py-24 bg-background border-y border-border" aria-labelledby="newsletter-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 id="newsletter-heading" className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-4">
          JOIN THE INNER CIRCLE
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto mb-8">
          Get early access to limited drops, exclusive colorways, and behind-the-scenes content.
        </p>
        <form onSubmit={handleSubmit} className="max-w-md mx-auto flex gap-2" noValidate>
          <label htmlFor="newsletter-email" className="sr-only">Email address</label>
          <input
            type="email"
            id="newsletter-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="flex-1 px-4 py-3 rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {status === "loading" ? "..." : "SUBSCRIBE"}
          </button>
        </form>
        {status === "success" && <p className="text-sm text-green-500 mt-3">Thanks for subscribing!</p>}
        {status === "error" && <p className="text-sm text-red-500 mt-3">Something went wrong.</p>}
        <p className="text-xs text-muted-foreground mt-4">By subscribing, you agree to our Privacy Policy. Unsubscribe anytime.</p>
      </div>
    </section>
  );
}