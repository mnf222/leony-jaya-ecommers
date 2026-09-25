"use client";

import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/lib/cart-context";
import { CartDrawer } from "@/components/CartDrawer";
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
    return (
        <SessionProvider>
            <CartProvider>
                {children}
                <CartDrawer />
            </CartProvider>
        </SessionProvider>
    );
}