"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIntro } from "./IntroProvider";
import { useCart } from "@/lib/cart";

type LenisContextValue = {
  lenis: Lenis | null;
  scrollTo: (target: string | number | HTMLElement) => void;
};

const LenisContext = createContext<LenisContextValue>({
  lenis: null,
  scrollTo: () => {},
});

function lockDocument(locked: boolean) {
  const root = document.documentElement;
  if (locked) {
    root.classList.add("is-intro");
    document.body.classList.add("is-locked");
  } else {
    root.classList.remove("is-intro");
    document.body.classList.remove("is-locked");
  }
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const instance = useRef<Lenis | null>(null);
  const introDone = useIntro().introDone;
  const { isOpen } = useCart();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    gsap.registerPlugin(ScrollTrigger);

    // Always begin at the top. Lenis reads its start position on construct.
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    const lenisInstance = new Lenis({
      lerp: prefersReduced ? 1 : 0.085,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
      smoothWheel: !prefersReduced,
      syncTouch: false,
    });

    // Freeze immediately. Nothing moves until the intro has finished.
    lenisInstance.stop();
    lockDocument(true);

    instance.current = lenisInstance;
    setLenis(lenisInstance);

    lenisInstance.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => {
      lenisInstance.raf(time * 1000);
    };

    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 700);

    return () => {
      window.clearTimeout(refreshTimer);
      gsap.ticker.remove(raf);
      lenisInstance.destroy();
      instance.current = null;
      setLenis(null);
    };
  }, []);

  useEffect(() => {
    if (!lenis) return;

    const shouldLock = !introDone || isOpen;

    if (shouldLock) {
      lenis.stop();
      lockDocument(true);
      return;
    }

    // Unlock: guarantee the document opens at the top, then resume.
    window.scrollTo(0, 0);
    lenis.scrollTo(0, { immediate: true, force: true });
    lenis.start();
    lockDocument(false);
    ScrollTrigger.refresh();
  }, [lenis, introDone, isOpen]);

  const scrollTo = (target: string | number | HTMLElement) => {
    if (instance.current) {
      instance.current.scrollTo(target as never, { offset: 0, duration: 1.4 });
      return;
    }
    if (typeof target === "string") {
      document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
    } else if (typeof target === "number") {
      window.scrollTo({ top: target, behavior: "smooth" });
    } else {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <LenisContext.Provider value={{ lenis, scrollTo }}>
      {children}
    </LenisContext.Provider>
  );
}

export function useLenisScroll() {
  return useContext(LenisContext);
}
