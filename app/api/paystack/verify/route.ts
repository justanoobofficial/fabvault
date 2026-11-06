import { NextRequest, NextResponse } from "next/server";
import { createFirestoreDocument, getFirestoreDocument } from "@/lib/firebase-admin";

export const runtime = "nodejs";

type CheckoutItem = { id: string; size?: string; quantity: number };

export async function POST(request: NextRequest) {
  try {
    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) return NextResponse.json({ error: "Payments are not configured." }, { status: 503 });

    const body = await request.json();
    const reference = String(body.reference || "");
    const email = String(body.email || "").trim().toLowerCase();
    const customer = String(body.customer || "").trim();
    const items = body.items as CheckoutItem[];

    if (!/^FV-[A-Z0-9-]{5,70}$/.test(reference) || !/^\S+@\S+\.\S+$/.test(email) ||
        !Array.isArray(items) || items.length < 1 || items.length > 20 ||
        items.some((item) => !item || typeof item.id !== "string" ||
          !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 5)) {
      return NextResponse.json({ error: "Invalid checkout details." }, { status: 400 });
    }

    const orderPath = `orders/${reference}`;
    const existing = await getFirestoreDocument(orderPath);
    if (existing?.status === "paid") return NextResponse.json({ success: true, reference });

    let total = 0;
    const orderItems = [];
    for (const item of items) {
      const product = await getFirestoreDocument(`products/${item.id}`);
      if (!product || product.soldOut) {
        return NextResponse.json({ error: "A product is no longer available." }, { status: 409 });
      }
      const price = Number(product.price);
      if (!Number.isFinite(price) || price <= 0) {
        return NextResponse.json({ error: "Invalid product price." }, { status: 409 });
      }
      total += price * item.quantity;
      orderItems.push({
        id: item.id,
        name: String(product.name || "Piece"),
        price,
        image: String(product.image || ""),
        size: String(item.size || "OS"),
        quantity: item.quantity,
      });
    }

    const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${secret}` },
      cache: "no-store",
    });
    const result = await response.json();
    const payment = result?.data;
    if (!response.ok || !result?.status || payment?.status !== "success" ||
        payment?.currency !== "NGN" || Number(payment?.amount) !== Math.round(total * 100) ||
        String(payment?.customer?.email || "").toLowerCase() !== email) {
      return NextResponse.json({ error: "Payment could not be verified. Contact support before retrying." }, { status: 402 });
    }

    await createFirestoreDocument(orderPath, {
      reference,
      email,
      customer: customer || null,
      items: orderItems,
      subtotal: total,
      currency: "NGN",
      channel: "paystack",
      status: "paid",
      createdAt: Date.now(),
      paystackTransactionId: String(payment.id || ""),
    });

    return NextResponse.json({ success: true, reference });
  } catch (error) {
    console.error("Paystack verification failed", error);
    return NextResponse.json({ error: "Unable to verify payment right now." }, { status: 500 });
  }
}
