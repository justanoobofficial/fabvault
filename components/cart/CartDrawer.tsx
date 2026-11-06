"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { addDoc, collection } from "firebase/firestore";
import { Minus, Plus, X, ArrowUpRight, Check } from "lucide-react";
import { usePaystackPayment } from "react-paystack";
import { useCart, toOrderItems } from "@/lib/cart";
import { Magnetic } from "@/components/Magnetic";
import { getDb, paystackPublicKey, WHATSAPP_NUMBER } from "@/lib/firebase";
import { formatNaira } from "@/lib/format";

const ease = [0.16, 1, 0.3, 1] as const;

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    subtotal,
    count,
    removeItem,
    setQuantity,
    clearCart,
  } = useCart();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">(
    "idle"
  );
  const [feedback, setFeedback] = useState<string | null>(null);

  const reference = `FV-${Date.now().toString(36).toUpperCase()}`;

  const config = {
    reference,
    email: email || "guest@thefabvault.com",
    amount: Math.round(subtotal * 100),
    currency: "NGN",
    publicKey: paystackPublicKey,
    metadata: {
      custom_fields: [
        {
          display_name: "Customer",
          variable_name: "customer_name",
          value: name || "Guest",
        },
        {
          display_name: "Bag",
          variable_name: "bag",
          value: items
            .map((line) => `${line.name} (${line.size}) x${line.quantity}`)
            .join(" | "),
        },
      ],
    },
  };

  const persistOrder = async (
    channel: string,
    status: string,
    response?: Record<string, unknown>
  ) => {
    const db = getDb();
    if (!db) return;
    await addDoc(collection(db, "orders"), {
      reference:
        channel === "paystack"
          ? String(response?.reference || reference)
          : `${reference}-WA`,
      email: email || "not-provided@whatsapp.local",
      customer: name || "WhatsApp customer",
      items: toOrderItems(items),
      subtotal,
      currency: "NGN",
      channel,
      status,
      createdAt: Date.now(),
    });
  };

  const initializePayment = usePaystackPayment(config);

  const onSuccess = async (response?: Record<string, unknown>) => {
    setStatus("saving");
    try {
      const verifiedReference = String(response?.reference || reference);
      const verification = await fetch("/api/paystack/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference: verifiedReference, email, customer: name, items: toOrderItems(items) }),
      });
      const result = await verification.json();
      if (!verification.ok || !result.success) throw new Error(result.error || "Payment verification failed.");
      clearCart();
      setStatus("done");
      setFeedback("Payment confirmed. Your piece is reserved.");
    } catch (error) {
      setStatus("error");
      setFeedback(
        error instanceof Error
          ? error.message
          : "Payment succeeded but the order record failed to save."
      );
    }
  };

  const onClose = () => {
    setStatus("idle");
    setFeedback("Payment window closed. Bag is unchanged.");
  };

  const handlePaystack = () => {
    if (!items.length) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      setFeedback("Enter a valid email for the receipt.");
      return;
    }
    setStatus("idle");
    setFeedback(null);
    initializePayment({ onSuccess, onClose });
  };

  const handleWhatsApp = async () => {
    if (!items.length) return;
    const lines = items.map(
      (line) =>
        `- ${line.name} / size ${line.size} / qty ${line.quantity} / ${formatNaira(
          line.price * line.quantity
        )}`
    );
    const message = [
      "THE FAB VAULT / Order request",
      `Reference: ${reference}-WA`,
      "",
      ...lines,
      "",
      `Subtotal: ${formatNaira(subtotal)}`,
      name ? `Name: ${name}` : "",
      "Sent from thefabvault storefront",
    ]
      .filter(Boolean)
      .join("\n");

    try {
      await persistOrder("whatsapp", "pending");
    } catch {
      // A missing Firestore rule should never block the WhatsApp handoff.
    }

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.div
            key="scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={closeCart}
            className="fixed inset-0 z-[100] bg-void/55 backdrop-blur-[2px]"
          />

          <motion.aside
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 32, mass: 0.9 }}
            className="fixed inset-y-0 right-0 z-[105] flex w-full max-w-[460px] flex-col bg-ink text-paper"
          >
            <header className="flex items-center justify-between border-b border-paper/12 px-5 py-5 sm:px-7">
              <div className="flex items-baseline gap-3">
                <h2 className="font-serif text-lg uppercase tracking-editorial">
                  Your bag
                </h2>
                <span className="font-sans text-[10px] tabular-nums tracking-[0.24em] text-paper/40">
                  {String(count).padStart(2, "0")}
                </span>
              </div>
              <button
                type="button"
                onClick={closeCart}
                aria-label="Close bag"
                data-cursor="hover"
                className="flex h-8 w-8 items-center justify-center border border-paper/20 transition-colors hover:border-paper hover:bg-paper hover:text-ink"
              >
                <X className="h-4 w-4" strokeWidth={1.25} />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-5 sm:px-7">
              {status === "done" ? (
                <div className="flex h-full flex-col items-center justify-center py-16 text-center">
                  <span className="flex h-14 w-14 items-center justify-center border border-paper/30">
                    <Check className="h-5 w-5" strokeWidth={1.25} />
                  </span>
                  <h3 className="display mt-8 text-4xl leading-[0.9]">
                    Order
                    <br />
                    logged
                  </h3>
                  <p className="mt-4 max-w-[32ch] font-sans text-[12px] leading-relaxed text-paper/50">
                    {feedback} A receipt and dispatch note will follow by email.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setStatus("idle");
                      setFeedback(null);
                      closeCart();
                    }}
                    className="btn-editorial btn-editorial-invert mt-10"
                  >
                    Continue
                  </button>
                </div>
              ) : items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center py-20 text-center">
                  <p className="eyebrow text-paper/35">Bag status / empty</p>
                  <h3 className="display mt-6 text-[13vw] leading-[0.9] sm:text-[52px]">
                    Nothing
                    <br />
                    yet
                  </h3>
                  <p className="mt-4 max-w-[28ch] font-sans text-[12px] leading-relaxed text-paper/45">
                    The vault is small by design. Start with the current release
                    and move quickly.
                  </p>
                  <button
                    type="button"
                    onClick={closeCart}
                    className="btn-editorial btn-editorial-invert mt-9"
                  >
                    Browse the vault
                  </button>
                </div>
              ) : (
                <ul className="divide-y divide-paper/10">
                  {items.map((line) => (
                    <li key={line.key} className="flex gap-4 py-5">
                      <div className="relative h-24 w-[72px] shrink-0 overflow-hidden bg-paper/10">
                        {line.image ? (
                          <Image
                            src={line.image}
                            alt={line.name}
                            fill
                            sizes="72px"
                            className="object-cover grayscale"
                          />
                        ) : null}
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-3">
                            <h4 className="truncate font-serif text-[15px] tracking-editorial">
                              {line.name}
                            </h4>
                            <button
                              type="button"
                              onClick={() => removeItem(line.key)}
                              aria-label={`Remove ${line.name}`}
                              className="text-paper/35 transition-colors hover:text-paper"
                            >
                              <X className="h-3.5 w-3.5" strokeWidth={1.5} />
                            </button>
                          </div>
                          <p className="mt-1 font-sans text-[9px] uppercase tracking-[0.26em] text-paper/40">
                            Size {line.size}
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center border border-paper/20">
                            <button
                              type="button"
                              onClick={() =>
                                line.quantity === 1
                                  ? removeItem(line.key)
                                  : setQuantity(line.key, line.quantity - 1)
                              }
                              aria-label="Decrease quantity"
                              className="flex h-7 w-7 items-center justify-center text-paper/60 transition-colors hover:bg-paper hover:text-ink"
                            >
                              <Minus className="h-3 w-3" strokeWidth={1.5} />
                            </button>
                            <span className="w-7 text-center font-sans text-[11px] tabular-nums">
                              {line.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                setQuantity(line.key, line.quantity + 1)
                              }
                              aria-label="Increase quantity"
                              className="flex h-7 w-7 items-center justify-center text-paper/60 transition-colors hover:bg-paper hover:text-ink"
                            >
                              <Plus className="h-3 w-3" strokeWidth={1.5} />
                            </button>
                          </div>
                          <span className="font-sans text-[11px] tabular-nums tracking-[0.06em] text-paper/80">
                            {formatNaira(line.price * line.quantity)}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && status !== "done" ? (
              <footer className="border-t border-paper/12 px-5 py-5 sm:px-7">
                <div className="flex items-end justify-between">
                  <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-paper/45">
                    Subtotal
                  </span>
                  <span className="font-serif text-2xl tabular-nums tracking-editorial">
                    {formatNaira(subtotal)}
                  </span>
                </div>
                <p className="mt-2 font-sans text-[10px] leading-relaxed tracking-[0.06em] text-paper/35">
                  Shipping quoted after confirmation. Lagos delivery in 1 to 3
                  days.
                </p>

                <div className="mt-5 grid grid-cols-2 gap-2">
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="FULL NAME"
                    aria-label="Full name"
                    className="col-span-2 border border-paper/20 bg-transparent px-3 py-3 font-sans text-[11px] uppercase tracking-[0.18em] text-paper placeholder:text-paper/30 focus:border-paper focus:outline-none"
                  />
                  <input
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      if (status === "error") {
                        setStatus("idle");
                        setFeedback(null);
                      }
                    }}
                    type="email"
                    placeholder="EMAIL FOR RECEIPT"
                    aria-label="Email"
                    className="col-span-2 border border-paper/20 bg-transparent px-3 py-3 font-sans text-[11px] uppercase tracking-[0.18em] text-paper placeholder:text-paper/30 focus:border-paper focus:outline-none"
                  />
                </div>

                {feedback ? (
                  <p className="mt-3 font-sans text-[10px] leading-relaxed tracking-[0.08em] text-paper/55">
                    {feedback}
                  </p>
                ) : null}

                <div className="mt-4 flex flex-col gap-1">
                  <Magnetic className="w-full" strength={0.18}>
                    <button
                      type="button"
                      onClick={handlePaystack}
                      disabled={status === "saving" || !paystackPublicKey}
                      data-cursor="hover"
                      className="flex w-full items-center justify-between border border-paper bg-paper px-4 py-4 font-sans text-[10px] uppercase tracking-[0.28em] text-ink transition-colors duration-500 hover:bg-transparent hover:text-paper disabled:opacity-50"
                    >
                      {status === "saving" ? "Verifying payment" : paystackPublicKey ? "Pay with Paystack" : "Paystack unavailable"}
                      <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.25} />
                    </button>
                  </Magnetic>
                  <Magnetic className="w-full" strength={0.18}>
                    <button
                      type="button"
                      onClick={handleWhatsApp}
                      data-cursor="hover"
                      className="flex w-full items-center justify-between border border-paper/30 px-4 py-4 font-sans text-[10px] uppercase tracking-[0.28em] text-paper transition-colors duration-500 hover:border-paper hover:bg-paper hover:text-ink"
                    >
                      Order on WhatsApp
                      <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.25} />
                    </button>
                  </Magnetic>
                </div>
                <p className="mt-4 text-center font-sans text-[9px] uppercase tracking-[0.22em] text-paper/25">
                  {paystackPublicKey ? "Secure checkout / Paystack" : "Card checkout is being configured"}
                </p>
              </footer>
            ) : null}
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
