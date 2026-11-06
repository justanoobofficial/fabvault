"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { OrderItem, Product } from "./types";

type CartLine = {
  key: string;
  id: string;
  name: string;
  price: number;
  image?: string;
  size?: string;
  quantity: number;
};

type CartContextValue = {
  items: CartLine[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  lastAdded: string | null;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (product: Product, size?: string) => void;
  removeItem: (key: string) => void;
  setQuantity: (key: string, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "fab-vault-bag-v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [lastAdded, setLastAdded] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartLine[];
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch {
      // ignore malformed storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore quota errors
    }
  }, [items, hydrated]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((v) => !v), []);

  const addItem = useCallback((product: Product, size?: string) => {
    const resolvedSize = size || product.sizes?.[0] || "OS";
    const key = `${product.id}__${resolvedSize}`;
    setItems((current) => {
      const existing = current.find((line) => line.key === key);
      if (existing) {
        return current.map((line) =>
          line.key === key ? { ...line, quantity: line.quantity + 1 } : line
        );
      }
      return [
        ...current,
        {
          key,
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          size: resolvedSize,
          quantity: 1,
        },
      ];
    });
    setLastAdded(key);
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((key: string) => {
    setItems((current) => current.filter((line) => line.key !== key));
  }, []);

  const setQuantity = useCallback((key: string, quantity: number) => {
    setItems((current) =>
      current
        .map((line) =>
          line.key === key ? { ...line, quantity: Math.max(1, quantity) } : line
        )
        .filter((line) => line.quantity > 0)
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const count = useMemo(
    () => items.reduce((total, line) => total + line.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((total, line) => total + line.price * line.quantity, 0),
    [items]
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count,
      subtotal,
      isOpen,
      lastAdded,
      openCart,
      closeCart,
      toggleCart,
      addItem,
      removeItem,
      setQuantity,
      clearCart,
    }),
    [
      items,
      count,
      subtotal,
      isOpen,
      lastAdded,
      openCart,
      closeCart,
      toggleCart,
      addItem,
      removeItem,
      setQuantity,
      clearCart,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}

export function toOrderItems(items: CartLine[]): OrderItem[] {
  return items.map((line) => ({
    id: line.id,
    name: line.name,
    price: line.price,
    image: line.image,
    size: line.size,
    quantity: line.quantity,
  }));
}
