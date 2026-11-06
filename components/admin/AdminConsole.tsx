"use client";

import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import Image from "next/image";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import {
  ArrowUpRight,
  Lock,
  LogOut,
  Package,
  Plus,
  Receipt,
  Trash2,
} from "lucide-react";
import { getDb, getFirebaseAuth, isFirebaseConfigured, ADMIN_EMAIL } from "@/lib/firebase";
import { formatDate, formatNaira } from "@/lib/format";
import type { Order, Product } from "@/lib/types";

type Tab = "inventory" | "orders";

type RawOrder = Order & { customer?: string | null };

export function AdminConsole() {
  const [unlocked, setUnlocked] = useState(false);
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("inventory");

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) return;
    return onAuthStateChanged(auth, (user) => {
      setUnlocked(Boolean(user && user.email === ADMIN_EMAIL && user.emailVerified));
    });
  }, []);

  const submitPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    const auth = getFirebaseAuth();
    if (!auth) { setError("Firebase Authentication is not configured."); return; }
    if (email.trim().toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      setError("Access denied. Use the authorised admin email.");
      return;
    }
    try {
      const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
      if (!credential.user.emailVerified) {
        await signOut(auth);
        setError("Verify the admin email before signing in.");
        return;
      }
      setError(null);
    } catch {
      setError("Access denied. Check your credentials and verified admin email.");
    }
  };

  if (!unlocked) {
    return (
      <div className="flex min-h-[100svh] items-center justify-center bg-void px-5 py-16 text-paper">
        <div className="w-full max-w-[420px]">
          <div className="flex items-center gap-3">
            <Lock className="h-4 w-4 text-paper/50" strokeWidth={1.25} />
            <span className="font-sans text-[9px] uppercase tracking-[0.32em] text-paper/45">
              Restricted console
            </span>
          </div>
          <h1 className="display mt-8 text-[15vw] leading-[0.86] sm:text-[64px]">
            The
            <br />
            Vault
            <br />
            Key
          </h1>
          <form onSubmit={submitPassword} className="mt-10">
            <label
              htmlFor="admin-email"
              className="font-sans text-[9px] uppercase tracking-[0.28em] text-paper/40"
            >
              Admin email
            </label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="username"
              className="mt-3 w-full border border-paper/25 bg-transparent px-4 py-4 font-sans text-sm text-paper focus:border-paper focus:outline-none"
            />
            <label htmlFor="admin-password" className="mt-5 block font-sans text-[9px] uppercase tracking-[0.28em] text-paper/40">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              className="mt-3 w-full border border-paper/25 bg-transparent px-4 py-4 font-sans text-sm tracking-[0.3em] text-paper focus:border-paper focus:outline-none"
            />
            {error ? (
              <p className="mt-3 font-sans text-[10px] uppercase tracking-[0.24em] text-paper/60">
                {error}
              </p>
            ) : null}
            <button
              type="submit"
              className="mt-6 flex w-full items-center justify-between border border-paper bg-paper px-4 py-4 font-sans text-[10px] uppercase tracking-[0.28em] text-ink transition-colors hover:bg-transparent hover:text-paper"
            >
              Enter console
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.25} />
            </button>
          </form>
          <p className="mt-14 border-t border-paper/12 pt-6 font-sans text-[10px] uppercase tracking-[0.24em] text-paper/30">
            Admin: {ADMIN_EMAIL}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100svh] bg-void text-paper">
      <header className="sticky top-0 z-20 border-b border-paper/12 bg-void/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-5 py-4 sm:px-8">
          <div className="flex items-baseline gap-4">
            <span className="font-serif text-lg uppercase tracking-editorial">
              Fab Vault Console
            </span>
            <span className="hidden font-sans text-[9px] uppercase tracking-[0.28em] text-paper/35 sm:inline">
              Internal
            </span>
          </div>
          <button
            type="button"
            onClick={async () => {
              const auth = getFirebaseAuth();
              if (auth) await signOut(auth);
              setUnlocked(false);
              setPassword("");
            }}
            className="flex items-center gap-2 border border-paper/25 px-3 py-2 font-sans text-[9px] uppercase tracking-[0.24em] text-paper/70 transition-colors hover:border-paper hover:text-paper"
          >
            <LogOut className="h-3 w-3" strokeWidth={1.5} />
            Lock
          </button>
        </div>
        <div className="mx-auto flex w-full max-w-[1440px] gap-1 px-5 pb-3 sm:px-8">
          {(
            [
              { id: "inventory" as Tab, label: "Inventory", icon: Package },
              { id: "orders" as Tab, label: "Orders", icon: Receipt },
            ]
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`flex items-center gap-2 px-4 py-2 font-sans text-[9px] uppercase tracking-[0.26em] transition-colors ${
                tab === item.id
                  ? "bg-paper text-ink"
                  : "border border-paper/20 text-paper/60 hover:text-paper"
              }`}
            >
              <item.icon className="h-3 w-3" strokeWidth={1.5} />
              {item.label}
            </button>
          ))}
        </div>
      </header>

      {!isFirebaseConfigured ? (
        <div className="mx-auto w-full max-w-[1440px] px-5 py-10 sm:px-8">
          <div className="border border-paper/25 p-6">
            <p className="font-sans text-[10px] uppercase tracking-[0.28em] text-paper/60">
              Firestore is not configured
            </p>
            <p className="mt-3 max-w-[60ch] font-sans text-[12px] leading-relaxed text-paper/45">
              Add the NEXT_PUBLIC_FIREBASE_* variables to .env.local and restart
              the server. The console will read and write the products and orders
              collections once credentials are present.
            </p>
          </div>
        </div>
      ) : null}

      <div className="mx-auto w-full max-w-[1440px] px-5 py-8 sm:px-8">
        {tab === "inventory" ? <InventoryTab /> : <OrdersTab />}
      </div>

      <footer className="border-t border-paper/12 px-5 py-6 sm:px-8">
        <p className="font-sans text-[10px] uppercase tracking-[0.24em] text-paper/35">
          Admin: {ADMIN_EMAIL}
        </p>
      </footer>
    </div>
  );
}

function InventoryTab() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    price: "",
    image: "",
    category: "",
    sizes: "",
    tag: "",
  });
  const [busy, setBusy] = useState(false);
  const [imageBusy, setImageBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => {
    const db = getDb();
    if (!db) {
      setLoading(false);
      return;
    }
    const unsubscribe = onSnapshot(
      collection(db, "products"),
      (snapshot) => {
        const next = snapshot.docs.map((entry) => {
          const data = entry.data() as Record<string, unknown>;
          return {
            id: entry.id,
            name: String(data.name ?? ""),
            price: Number(data.price ?? 0),
            image: String(data.image ?? ""),
            category: data.category ? String(data.category) : undefined,
            tag: data.tag ? String(data.tag) : undefined,
            soldOut: Boolean(data.soldOut),
            createdAt:
              typeof (data.createdAt as { seconds?: number })?.seconds === "number"
                ? (data.createdAt as { seconds: number }).seconds * 1000
                : undefined,
          } satisfies Product;
        });
        next.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
        setProducts(next);
        setLoading(false);
      },
      () => setLoading(false)
    );
    return () => unsubscribe();
  }, []);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const db = getDb();
    if (!db) {
      setNote("Firestore is not configured.");
      return;
    }
    if (!form.name.trim() || !form.price || !form.image.trim()) {
      setNote("Name, price and image URL are required.");
      return;
    }
    setBusy(true);
    setNote(null);
    try {
      await addDoc(collection(db, "products"), {
        name: form.name.trim().toUpperCase(),
        price: Number(form.price),
        image: form.image.trim(),
        category: form.category.trim().toUpperCase() || "ARCHIVE",
        sizes: form.sizes
          .split(",")
          .map((size) => size.trim().toUpperCase())
          .filter(Boolean),
        tag: form.tag.trim().toUpperCase() || null,
        soldOut: false,
        createdAt: serverTimestamp(),
      });
      setForm({ name: "", price: "", image: "", category: "", sizes: "", tag: "" });
      setNote("Piece added to the vault.");
    } catch (err) {
      setNote(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    const db = getDb();
    if (!db) return;
    await deleteDoc(doc(db, "products", id));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"];
    if (!allowedTypes.includes(file.type) || file.size > 10 * 1024 * 1024) {
      setNote("Choose a JPG, PNG, WebP or AVIF image under 10 MB.");
      event.target.value = "";
      return;
    }
    const user = getFirebaseAuth()?.currentUser;
    if (!user) {
      setNote("Sign in again before uploading.");
      event.target.value = "";
      return;
    }
    setImageBusy(true);
    setNote(null);
    try {
      const idToken = await user.getIdToken();
      const authResponse = await fetch("/api/cloudinary-signature", {
        method: "POST",
        headers: { Authorization: `Bearer ${idToken}` },
      });
      const auth = await authResponse.json();
      if (!authResponse.ok) throw new Error(auth.error || "Cloudinary is not configured.");

      const data = new FormData();
      data.append("file", file);
      data.append("api_key", auth.apiKey);
      data.append("timestamp", String(auth.timestamp));
      data.append("folder", auth.folder);
      data.append("signature", auth.signature);

      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${auth.cloudName}/image/upload`,
        { method: "POST", body: data }
      );
      const uploaded = await uploadResponse.json();
      if (!uploadResponse.ok || typeof uploaded.secure_url !== "string") {
        throw new Error(uploaded.error?.message || "Cloudinary image upload failed.");
      }
      setForm((current) => ({ ...current, image: uploaded.secure_url }));
      setNote("Image uploaded. Preview ready; its link will save with the product.");
    } catch (error) {
      setNote(error instanceof Error ? error.message : "Image upload failed.");
    } finally {
      setImageBusy(false);
      event.target.value = "";
    }
  };

  const previewImage = form.image.trim();

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
      <section className="lg:col-span-5">
        <div className="border border-paper/15 p-5">
          <div className="flex items-center justify-between border-b border-paper/12 pb-4">
            <h2 className="font-serif text-xl tracking-editorial">New piece</h2>
            <span className="font-sans text-[9px] uppercase tracking-[0.26em] text-paper/35">
              Products
            </span>
          </div>

          <form onSubmit={submit} className="mt-5 flex flex-col gap-3">
            <Field label="Name">
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="1990S LEATHER BIKER"
                className="admin-input"
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Price (NGN)">
                <input
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  inputMode="numeric"
                  placeholder="45000"
                  className="admin-input"
                />
              </Field>
              <Field label="Category">
                <input
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  placeholder="OUTERWEAR"
                  className="admin-input"
                />
              </Field>
            </div>
            <Field label="Product image">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                onChange={handleImageUpload}
                disabled={imageBusy}
                className="block w-full font-sans text-[10px] text-paper/60 file:mr-3 file:border file:border-paper/30 file:bg-transparent file:px-3 file:py-2 file:font-sans file:text-[9px] file:uppercase file:tracking-[0.2em] file:text-paper"
              />
              <span className="font-sans text-[9px] uppercase tracking-[0.18em] text-paper/35">
                JPG, PNG, WebP or AVIF · 10 MB max
              </span>
              {imageBusy ? <span className="font-sans text-[9px] uppercase tracking-[0.2em] text-paper/40">Uploading image...</span> : null}
              {form.image ? (
                <button
                  type="button"
                  onClick={() => setForm((current) => ({ ...current, image: "" }))}
                  className="self-start border border-paper/20 px-3 py-2 font-sans text-[9px] uppercase tracking-[0.2em] text-paper/55 transition-colors hover:border-paper hover:text-paper"
                >
                  Remove image
                </button>
              ) : null}
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Sizes">
                <input
                  value={form.sizes}
                  onChange={(e) => setForm({ ...form, sizes: e.target.value })}
                  placeholder="M, L"
                  className="admin-input"
                />
              </Field>
              <Field label="Tag">
                <input
                  value={form.tag}
                  onChange={(e) => setForm({ ...form, tag: e.target.value })}
                  placeholder="DEADSTOCK"
                  className="admin-input"
                />
              </Field>
            </div>

            {previewImage ? (
              <div className="relative mt-1 aspect-editorial w-full overflow-hidden bg-paper/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewImage}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
              </div>
            ) : null}

            <button
              type="submit"
              disabled={busy}
              className="mt-2 flex items-center justify-between border border-paper bg-paper px-4 py-4 font-sans text-[10px] uppercase tracking-[0.28em] text-ink transition-colors hover:bg-transparent hover:text-paper disabled:opacity-40"
            >
              {busy ? "Uploading" : "Add to vault"}
              <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
            </button>
            {note ? (
              <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-paper/55">
                {note}
              </p>
            ) : null}
          </form>
        </div>
      </section>

      <section className="lg:col-span-7">
        <div className="flex items-center justify-between border-b border-paper/12 pb-4">
          <h2 className="font-serif text-xl tracking-editorial">Inventory</h2>
          <span className="font-sans text-[9px] uppercase tracking-[0.26em] text-paper/35">
            {String(products.length).padStart(2, "0")} items
          </span>
        </div>

        {loading ? (
          <p className="py-10 font-sans text-[10px] uppercase tracking-[0.26em] text-paper/35">
            Reading collection
          </p>
        ) : products.length === 0 ? (
          <p className="py-10 font-sans text-[12px] leading-relaxed text-paper/40">
            No products in Firestore yet. Add the first piece using the form.
          </p>
        ) : (
          <ul className="divide-y divide-paper/10">
            {products.map((product) => (
              <li key={product.id} className="flex items-center gap-4 py-4">
                <div className="relative h-20 w-16 shrink-0 overflow-hidden bg-paper/10">
                  {product.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-sans text-[11px] uppercase tracking-[0.18em]">
                    {product.name}
                  </p>
                  <p className="mt-1 font-sans text-[10px] tracking-[0.14em] text-paper/40">
                    {formatNaira(product.price)}
                    {product.category ? ` / ${product.category}` : ""}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => remove(product.id)}
                  aria-label={`Delete ${product.name}`}
                  className="flex h-8 w-8 items-center justify-center border border-paper/20 text-paper/50 transition-colors hover:border-paper hover:text-paper"
                >
                  <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function OrdersTab() {
  const [orders, setOrders] = useState<RawOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "paystack" | "whatsapp">("all");

  useEffect(() => {
    const db = getDb();
    if (!db) {
      setLoading(false);
      return;
    }
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setOrders(
          snapshot.docs.map((entry) => {
            const data = entry.data() as Record<string, unknown>;
            return {
              id: entry.id,
              reference: data.reference ? String(data.reference) : undefined,
              email: data.email ? String(data.email) : undefined,
              customer: data.customer ? String(data.customer) : undefined,
              items: Array.isArray(data.items)
                ? (data.items as RawOrder["items"])
                : [],
              subtotal: Number(data.subtotal ?? 0),
              channel: data.channel ? String(data.channel) : undefined,
              status: data.status ? String(data.status) : undefined,
              createdAt:
                typeof data.createdAt === "number"
                  ? data.createdAt
                  : undefined,
            };
          })
        );
        setLoading(false);
      },
      () => setLoading(false)
    );
    return () => unsubscribe();
  }, []);

  const visible = useMemo(
    () =>
      filter === "all"
        ? orders
        : orders.filter((order) => order.channel === filter),
    [orders, filter]
  );

  const revenue = useMemo(
    () =>
      orders
        .filter((order) => order.status === "paid")
        .reduce((total, order) => total + order.subtotal, 0),
    [orders]
  );

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-paper/12 pb-4">
        <div className="flex items-baseline gap-4">
          <h2 className="font-serif text-xl tracking-editorial">Orders</h2>
          <span className="font-sans text-[9px] uppercase tracking-[0.26em] text-paper/35">
            {String(orders.length).padStart(2, "0")} records
          </span>
        </div>
        <div className="flex items-center gap-2">
          {(["all", "paystack", "whatsapp"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setFilter(option)}
              className={`border px-3 py-2 font-sans text-[9px] uppercase tracking-[0.22em] transition-colors ${
                filter === option
                  ? "border-paper bg-paper text-ink"
                  : "border-paper/20 text-paper/55 hover:text-paper"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 py-6 sm:grid-cols-3">
        <div className="border border-paper/15 p-4">
          <p className="font-sans text-[9px] uppercase tracking-[0.24em] text-paper/35">
            Paid volume
          </p>
          <p className="mt-2 font-serif text-2xl tracking-editorial">
            {formatNaira(revenue)}
          </p>
        </div>
        <div className="border border-paper/15 p-4">
          <p className="font-sans text-[9px] uppercase tracking-[0.24em] text-paper/35">
            Pending
          </p>
          <p className="mt-2 font-serif text-2xl tracking-editorial">
            {String(
              orders.filter((order) => order.status !== "paid").length
            ).padStart(2, "0")}
          </p>
        </div>
        <div className="col-span-2 border border-paper/15 p-4 sm:col-span-1">
          <p className="font-sans text-[9px] uppercase tracking-[0.24em] text-paper/35">
            Latest
          </p>
          <p className="mt-2 font-serif text-lg tracking-editorial">
            {orders[0] ? formatDate(orders[0].createdAt) : "None"}
          </p>
        </div>
      </div>

      {loading ? (
        <p className="font-sans text-[10px] uppercase tracking-[0.26em] text-paper/35">
          Reading orders
        </p>
      ) : visible.length === 0 ? (
        <p className="border border-paper/15 px-5 py-10 font-sans text-[12px] leading-relaxed text-paper/40">
          No orders recorded on this channel yet.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {visible.map((order) => (
            <li key={order.id} className="border border-paper/15">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-paper/10 px-4 py-3">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-paper/85">
                    {order.reference || order.id.slice(0, 10)}
                  </span>
                  <span
                    className={`px-2 py-1 font-sans text-[8px] uppercase tracking-[0.22em] ${
                      order.status === "paid"
                        ? "bg-paper text-ink"
                        : "border border-paper/30 text-paper/60"
                    }`}
                  >
                    {order.status || "pending"}
                  </span>
                  <span className="font-sans text-[8px] uppercase tracking-[0.22em] text-paper/35">
                    {order.channel || "direct"}
                  </span>
                </div>
                <span className="font-sans text-[11px] tabular-nums tracking-[0.08em] text-paper/80">
                  {formatNaira(order.subtotal)}
                </span>
              </div>
              <div className="grid grid-cols-1 gap-4 px-4 py-4 sm:grid-cols-3">
                <div>
                  <p className="font-sans text-[8px] uppercase tracking-[0.24em] text-paper/30">
                    Buyer
                  </p>
                  <p className="mt-1 break-all font-sans text-[11px] text-paper/70">
                    {order.customer || "Guest"}
                  </p>
                  <p className="break-all font-sans text-[11px] text-paper/45">
                    {order.email || "No email"}
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <p className="font-sans text-[8px] uppercase tracking-[0.24em] text-paper/30">
                    Pieces
                  </p>
                  <ul className="mt-1 space-y-1">
                    {(order.items || []).map((item, index) => (
                      <li
                        key={`${order.id}-${index}`}
                        className="font-sans text-[11px] text-paper/60"
                      >
                        {item.name}
                        {item.size ? ` / ${item.size}` : ""} x{item.quantity}
                        <span className="text-paper/35">
                          {" "}
                          / {formatNaira(item.price * item.quantity)}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-2 font-sans text-[9px] uppercase tracking-[0.2em] text-paper/25">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="font-sans text-[9px] uppercase tracking-[0.24em] text-paper/40">
        {label}
      </span>
      {children}
    </label>
  );
}
