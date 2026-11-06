"use client";

import { useCallback, useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  type DocumentData,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import { getDb, isFirebaseConfigured } from "./firebase";
import type { Product } from "./types";

function toMillis(value: unknown): number | undefined {
  if (!value) return undefined;
  if (typeof value === "number") return value;
  if (typeof value === "object" && value !== null) {
    const maybe = value as { seconds?: number; toMillis?: () => number };
    if (typeof maybe.toMillis === "function") return maybe.toMillis();
    if (typeof maybe.seconds === "number") return maybe.seconds * 1000;
  }
  return undefined;
}

function normaliseProduct(
  doc: QueryDocumentSnapshot<DocumentData>
): Product {
  const data = doc.data() as Record<string, unknown>;
  const sizes = Array.isArray(data.sizes)
    ? (data.sizes as unknown[]).map((s) => String(s)).filter(Boolean)
    : typeof data.sizes === "string"
      ? String(data.sizes)
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

  return {
    id: doc.id,
    name: String(data.name ?? "UNTITLED PIECE"),
    price: Number(data.price ?? 0),
    image: String(data.image ?? ""),
    category: data.category ? String(data.category) : undefined,
    tag: data.tag ? String(data.tag) : undefined,
    sizes,
    soldOut: Boolean(data.soldOut),
    createdAt: toMillis(data.createdAt),
  };
}

export type ProductsState = {
  products: Product[];
  loading: boolean;
  error: string | null;
  configured: boolean;
  refresh: () => void;
};

export function useProducts(): ProductsState {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [configured, setConfigured] = useState(isFirebaseConfigured);
  const [nonce, setNonce] = useState(0);

  const refresh = useCallback(() => setNonce((n) => n + 1), []);

  useEffect(() => {
    const db = getDb();

    if (!db) {
      // No credentials: render the branded empty state rather than a failure.
      setConfigured(false);
      setProducts([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    const unsubscribe = onSnapshot(
      collection(db, "products"),
      (snapshot) => {
        const next = snapshot.docs.map(normaliseProduct);
        next.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
        setProducts(next);
        setError(null);
        setLoading(false);
      },
      (err) => {
        setError(err.message || "Unable to reach the vault");
        setProducts([]);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [nonce]);

  return { products, loading, error, configured, refresh };
}
