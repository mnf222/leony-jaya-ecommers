"use client";

import { createContext, useContext, useReducer, ReactNode, useEffect } from "react";
import { CartItem, ProductVariant } from "@/lib/api";

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: { variant: ProductVariant; quantity: number } }
  | { type: "REMOVE_ITEM"; payload: { variantId: number } }
  | { type: "UPDATE_QUANTITY"; payload: { variantId: number; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_CART" }
  | { type: "OPEN_CART" }
  | { type: "CLOSE_CART" }
  | { type: "HYDRATE"; payload: CartItem[] };

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  addItem: (variant: ProductVariant, quantity?: number) => void;
  removeItem: (variantId: number) => void;
  updateQuantity: (variantId: number, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
} | null>(null);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const { variant, quantity } = action.payload;
      const existingIndex = state.items.findIndex((item) => item.variant_id === variant.id);
      if (existingIndex >= 0) {
        const newItems = [...state.items];
        newItems[existingIndex].quantity += quantity;
        return { ...state, items: newItems, isOpen: true };
      }
      return { ...state, items: [...state.items, { variant_id: variant.id, quantity, variant }], isOpen: true };
    }
    case "REMOVE_ITEM":
      return { ...state, items: state.items.filter((item) => item.variant_id !== action.payload.variantId) };
    case "UPDATE_QUANTITY": {
      if (action.payload.quantity <= 0) {
        return { ...state, items: state.items.filter((item) => item.variant_id !== action.payload.variantId) };
      }
      return {
        ...state,
        items: state.items.map((item) =>
          item.variant_id === action.payload.variantId ? { ...item, quantity: action.payload.quantity } : item
        ),
      };
    }
    case "CLEAR_CART":
      return { ...state, items: [] };
    case "TOGGLE_CART":
      return { ...state, isOpen: !state.isOpen };
    case "OPEN_CART":
      return { ...state, isOpen: true };
    case "CLOSE_CART":
      return { ...state, isOpen: false };
    case "HYDRATE":
      return { ...state, items: action.payload };
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false });

  useEffect(() => {
    const saved = localStorage.getItem("leony-jaya-cart");
    if (saved) {
      try {
        dispatch({ type: "HYDRATE", payload: JSON.parse(saved) });
      } catch {
        localStorage.removeItem("leony-jaya-cart");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("leony-jaya-cart", JSON.stringify(state.items));
  }, [state.items]);

  const addItem = (variant: ProductVariant, quantity = 1) => {
    dispatch({ type: "ADD_ITEM", payload: { variant, quantity } });
  };

  const removeItem = (variantId: number) => {
    dispatch({ type: "REMOVE_ITEM", payload: { variantId } });
  };

  const updateQuantity = (variantId: number, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { variantId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const openCart = () => {
    dispatch({ type: "OPEN_CART" });
  };

  const closeCart = () => {
    dispatch({ type: "CLOSE_CART" });
  };

  const toggleCart = () => {
    dispatch({ type: "TOGGLE_CART" });
  };

  const getTotalItems = () => state.items.reduce((sum, item) => sum + item.quantity, 0);

  const getSubtotal = () =>
    state.items.reduce((sum, item) => {
      const price = item.variant?.price ?? item.variant?.product?.base_price ?? 0;
      return sum + price * item.quantity;
    }, 0);

  return (
    <CartContext.Provider
      value={{
        state,
        dispatch,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        openCart,
        closeCart,
        toggleCart,
        getTotalItems,
        getSubtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}