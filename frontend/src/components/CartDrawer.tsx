"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export function CartDrawer() {
  const { state, removeItem, updateQuantity, getSubtotal, getTotalItems, closeCart } = useCart();

  if (!state.isOpen) return null;

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={closeCart}
          aria-hidden="true"
        />
      </AnimatePresence>

      <AnimatePresence>
        <motion.aside
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed right-0 top-0 h-full w-full max-w-sm md:max-w-md z-50 bg-card border-l border-border flex flex-col"
          role="dialog"
          aria-label="Shopping cart"
        >
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="font-display text-lg font-bold">Cart ({getTotalItems()})</h2>
            <button onClick={closeCart} className="p-2 hover:bg-secondary rounded-md transition-colors" aria-label="Close cart">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {state.items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                <ShoppingBag className="h-12 w-12 mb-4 opacity-50" />
                <p className="font-medium">Your cart is empty</p>
                <p className="text-sm mt-1">Add some denim to get started</p>
                <Link href="/shop" className="mt-4 text-primary hover:underline">
                  Continue Shopping
                </Link>
              </div>
            ) : (
              <ul className="space-y-4" role="list">
                {state.items.map((item) => (
                  <li key={item.variant_id} className="flex gap-3">
                    <div className="relative h-20 w-16 flex-shrink-0 overflow-hidden rounded-md bg-secondary">
                      <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                        <ShoppingBag className="h-6 w-6" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link href={`/shop/${item.variant?.product?.slug}`} className="block">
                        <h4 className="font-medium truncate">{item.variant?.product?.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {item.variant?.size}{item.variant?.color && ` / ${item.variant.color}`}
                        </p>
                        <p className="font-medium mt-1">{formatPrice(item.variant?.price ?? item.variant?.product?.base_price ?? 0)}</p>
                      </Link>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-border rounded-md">
                          <button
                            onClick={() => updateQuantity(item.variant_id, item.quantity - 1)}
                            className="p-2 hover:bg-secondary transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="px-3 text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.variant_id, item.quantity + 1)}
                            className="p-2 hover:bg-secondary transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.variant_id)}
                          className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {state.items.length > 0 && (
            <div className="border-t border-border p-4 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatPrice(getSubtotal())}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium">{getSubtotal() >= 20000 ? "Free" : "Calculated at checkout"}</span>
              </div>
              <div className="flex justify-between text-base font-bold border-t border-border pt-4">
                <span>Total</span>
                <span>{formatPrice(getSubtotal())}</span>
              </div>
              <Link href="/checkout" className="block">
                <Button className="w-full" size="lg" onClick={closeCart}>
                  Proceed to Checkout
                </Button>
              </Link>
              <Link href="/shop" className="block text-center">
                <Button variant="outline" className="w-full">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          )}
        </motion.aside>
      </AnimatePresence>
    </>
  );
}