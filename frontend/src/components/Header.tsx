"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart-context";

export function Header() {
  const { getTotalItems, toggleCart } = useCart();
  const count = getTotalItems();

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between" aria-label="Main navigation">
        <Link href="/" className="font-display text-xl font-bold tracking-tight">
          LEONY JAYA
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link href="/shop" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Shop
          </Link>
          <Link href="/drops" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Drops
          </Link>
          <Link href="/lookbook" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Lookbook
          </Link>
          <Link href="/size-guide" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Size Guide
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/account" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Account
          </Link>
          <button onClick={toggleCart} className="relative p-1" aria-label={`Cart with ${count} items`}>
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
                {count}
              </span>
            )}
            {count === 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
                0
              </span>
            )}
          </button>
        </div>
      </nav>
    </header>
  );
}