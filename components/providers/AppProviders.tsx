"use client";

import dynamic from "next/dynamic";
import { IntroProvider } from "./IntroProvider";
import { SmoothScroll } from "./SmoothScroll";
import { CartProvider } from "@/lib/cart";

// react-paystack loads the Paystack inline SDK, which touches `document` on
// import. The drawer is therefore client only.
const CartDrawer = dynamic(
  () => import("@/components/cart/CartDrawer").then((mod) => mod.CartDrawer),
  { ssr: false }
);

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <IntroProvider>
      <CartProvider>
        <SmoothScroll>{children}</SmoothScroll>
        <CartDrawer />
      </CartProvider>
    </IntroProvider>
  );
}
