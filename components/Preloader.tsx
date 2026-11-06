"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useIntro } from "./providers/IntroProvider";

export function Preloader() {
  const { introDone, completeIntro } = useIntro();
  const rootRef = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(true);

  const release = useCallback(() => {
    // Hand the document back only once the curtain has fully cleared.
    document.documentElement.classList.remove("is-intro");
    document.body.classList.remove("is-locked");
    window.scrollTo(0, 0);
    window.sessionStorage.setItem("fv-intro", "done");
    setVisible(false);
    completeIntro();
  }, [completeIntro]);

  useEffect(() => {
    if (introDone) return;

    // The lock class ships in the server HTML. Re-assert it here in case a
    // soft navigation mounted the preloader again.
    document.documentElement.classList.add("is-intro");
    document.body.classList.add("is-locked");
    window.scrollTo(0, 0);

    const seen = window.sessionStorage.getItem("fv-intro") === "done";
    const pace = seen ? 0.42 : 1;

    const counter = { value: 0 };
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from("[data-pre-word]", {
        yPercent: 120,
        opacity: 0,
        duration: 1.1 * pace,
        stagger: 0.08 * pace,
        ease: "expo.out",
      });

      tl.to(
        counter,
        {
          value: 100,
          duration: 1.9 * pace,
          ease: "power2.inOut",
          onUpdate: () => setCount(Math.round(counter.value)),
        },
        "<"
      );

      tl.to("[data-pre-meta]", { opacity: 1, duration: 0.6 * pace }, "<0.2");
      tl.to(
        "[data-pre-bar]",
        { scaleX: 1, duration: 1.9 * pace, ease: "power2.inOut" },
        "<"
      );
      tl.to({}, { duration: 0.24 });

      tl.to("[data-pre-inner]", {
        yPercent: -110,
        opacity: 0,
        duration: 0.7,
        ease: "power3.inOut",
      });

      tl.to(
        rootRef.current,
        {
          yPercent: -100,
          duration: 1.1,
          ease: "expo.inOut",
          onComplete: release,
        },
        "-=0.25"
      );
    }, rootRef);

    return () => ctx.revert();
  }, [introDone, release]);

  if (!visible) return null;

  return (
    <div
      ref={rootRef}
      aria-hidden
      data-preloader
      className="fixed inset-0 z-[120] flex flex-col justify-between bg-void px-5 py-6 text-paper sm:px-8 lg:px-12"
    >
      <div data-pre-inner className="flex h-full flex-col justify-between">
        <div
          data-pre-meta
          className="flex items-start justify-between font-sans text-[10px] uppercase tracking-[0.32em] text-paper/45 opacity-0"
        >
          <span>Lagos, NG</span>
          <span>Archive 001</span>
        </div>

        <div className="flex flex-col items-start">
          <h1 className="display text-[15vw] leading-[0.8] text-paper sm:text-[13vw] lg:text-[11vw]">
            <span className="mask-line">
              <span data-pre-word>THE FAB</span>
            </span>
            <span className="mask-line">
              <span data-pre-word>VAULT</span>
            </span>
          </h1>
          <div className="mt-8 h-px w-full bg-paper/15">
            <div
              data-pre-bar
              className="h-px w-full origin-left scale-x-0 bg-paper"
            />
          </div>
        </div>

        <div className="flex items-end justify-between">
          <span className="font-sans text-[10px] uppercase tracking-[0.32em] text-paper/45">
            Loading the vault
          </span>
          <span className="font-serif text-4xl tabular-nums tracking-editorial text-paper sm:text-5xl">
            {String(count).padStart(3, "0")}
          </span>
        </div>
      </div>
    </div>
  );
}
