"use client";

import { useState } from "react";
import Link from "next/link";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ArrowLeft, Database } from "lucide-react";
import seedData from "@/lib/seed-data.json";
import { getDb, isFirebaseConfigured } from "@/lib/firebase";

/**
 * One time seeding utility for the products collection.
 * Unlinked. Reachable only by typing the route. Safe to delete once the
 * archive has real inventory in it.
 */
export default function SeedPage() {
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const run = async () => {
    const db = getDb();
    if (!db) {
      setStatus("Firestore is not configured.");
      return;
    }
    setBusy(true);
    setStatus("Writing 9 pieces...");
    try {
      let index = 0;
      for (const item of seedData) {
        await addDoc(collection(db, "products"), {
          name: item.name,
          price: item.price,
          image: item.image,
          category: item.category,
          sizes: item.sizes,
          tag: item.tag || null,
          soldOut: false,
          // Stagger so the newest release ordering is deterministic.
          createdAt: serverTimestamp(),
          sequence: index++,
        });
      }
      setStatus(`${seedData.length} pieces written to the products collection.`);
    } catch (error) {
      setStatus(
        error instanceof Error ? `Write failed: ${error.message}` : "Write failed."
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="flex min-h-[100svh] items-center justify-center bg-void px-5 py-16 text-paper">
      <div className="w-full max-w-[520px]">
        <Link
          href="/admin-secure-99"
          className="flex items-center gap-3 font-sans text-[9px] uppercase tracking-[0.3em] text-paper/40 hover:text-paper"
        >
          <ArrowLeft className="h-3 w-3" strokeWidth={1.5} />
          Console
        </Link>
        <h1 className="display mt-8 text-[12vw] leading-[0.86] sm:text-[56px]">
          Seed the
          <br />
          archive
        </h1>
        <p className="mt-6 font-sans text-[12px] leading-relaxed text-paper/45">
          Writes the reference release to the products collection. Run once, on a
          fresh project, then delete this route.
        </p>
        <p className="mt-3 font-sans text-[10px] uppercase tracking-[0.24em] text-paper/30">
          Firestore / {isFirebaseConfigured ? "configured" : "not configured"}
        </p>
        <button
          type="button"
          onClick={run}
          disabled={busy}
          className="mt-8 flex w-full items-center justify-between border border-paper bg-paper px-4 py-4 font-sans text-[10px] uppercase tracking-[0.28em] text-ink transition-colors hover:bg-transparent hover:text-paper disabled:opacity-40"
        >
          {busy ? "Working" : "Write 9 pieces"}
          <Database className="h-3.5 w-3.5" strokeWidth={1.5} />
        </button>
        {status ? (
          <p className="mt-4 font-sans text-[10px] uppercase tracking-[0.2em] text-paper/55">
            {status}
          </p>
        ) : null}
      </div>
    </main>
  );
}
