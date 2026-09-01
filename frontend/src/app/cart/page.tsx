"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/utils";
import { ShoppingBag, Trash2, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function CartPage() {
  const { state, removeItem, updateQuantity, getSubtotal } = useCart();
  const subtotal = getSubtotal();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 w-full">
        <h1 className="font-display text-4xl font-bold tracking-tight">CART</h1>
        <p className="text-muted-foreground mt-2">Review keranjangmu. Stock di-lock 10 menit saat checkout.</p>

        {state.items.length === 0 ? (
          <div className="mt-12 text-center py-20 border border-dashed border-border rounded-xl">
            <ShoppingBag className="h-12 w-12 mx-auto opacity-20" />
            <p className="mt-4 font-medium">Keranjang kosong</p>
            <Link href="/shop" className="inline-flex mt-4 px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium">SHOP COLLECTION</Link>
          </div>
        ) : (
          <div className="mt-8 grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {state.items.map((item) => (
                <div key={item.variant_id} className="flex gap-4 p-4 rounded-xl border border-border bg-card">
                  <div className="h-24 w-20 rounded-md bg-secondary flex items-center justify-center"><ShoppingBag className="h-6 w-6 opacity-20" /></div>
                  <div className="flex-1">
                    <h3 className="font-medium">{item.variant?.product?.title ?? "Product"}</h3>
                    <p className="text-sm text-muted-foreground">{item.variant?.size} {item.variant?.color && `/ ${item.variant.color}`} • SKU {item.variant?.sku}</p>
                    <p className="font-medium mt-1">{formatPrice(item.variant?.price ?? item.variant?.product?.base_price ?? 0)}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <div className="flex items-center border border-border rounded-md">
                        <button onClick={() => updateQuantity(item.variant_id, item.quantity - 1)} className="p-2 hover:bg-secondary"><Minus className="h-4 w-4" /></button>
                        <span className="px-3 text-sm font-medium">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.variant_id, item.quantity + 1)} className="p-2 hover:bg-secondary"><Plus className="h-4 w-4" /></button>
                      </div>
                      <button onClick={() => removeItem(item.variant_id)} className="p-2 text-muted-foreground hover:text-red-400"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-border bg-card p-6 h-fit">
              <h3 className="font-medium">Order Summary</h3>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{subtotal >= 20000 ? "Free" : "Calculated at checkout"}</span></div>
                <div className="flex justify-between font-bold border-t border-border pt-3 mt-3"><span>Total</span><span>{formatPrice(subtotal)}</span></div>
              </div>
              <Link href="/contact" className="block mt-6"><Button className="w-full" size="lg">PROCEED TO CHECKOUT</Button></Link>
              <p className="text-xs text-muted-foreground mt-3 text-center">Secure checkout via Midtrans / Xendit</p>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}