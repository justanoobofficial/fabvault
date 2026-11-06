"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const statement =
  "We do not chase trends. We keep a small, deliberate archive of garments that deserve a second life, priced honestly and documented completely.";

export function Manifesto() {
  const root = useRef<HTMLElement>(null);
  const copy = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const words = copy.current?.querySelectorAll("[data-word]");
      if (!words || !words.length) return;

      gsap.fromTo(
        words,
        { opacity: 0.12 },
        {
          opacity: 1,
          stagger: 0.4,
          ease: "none",
          scrollTrigger: {
            trigger: copy.current,
            start: "top 78%",
            end: "bottom 55%",
            scrub: 0.6,
          },
        }
      );

      gsap.fromTo(
        "[data-manifesto-marker]",
        { yPercent: 40, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.2,
          ease: "expo.out",
          scrollTrigger: {
            trigger: root.current,
            start: "top 70%",
          },
        }
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      id="process"
      className="relative overflow-hidden bg-ink py-24 text-paper md:py-36"
    >
      <div className="shell">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-3">
            <p data-manifesto-marker className="eyebrow text-paper/45">
              Section 02
              <br />
              Position
            </p>
            <div className="mt-6 h-px w-14 bg-paper/30" />
            <p className="mt-6 max-w-[24ch] font-sans text-[11px] uppercase leading-relaxed tracking-[0.24em] text-paper/40">
              Sourced by hand
              <br />
              Inspected twice
              <br />
              Released once
            </p>
          </div>

          <div className="md:col-span-9">
            <p
              ref={copy}
              className="font-serif text-[8.5vw] font-medium leading-[0.98] tracking-tightest text-paper sm:text-[6vw] lg:text-[4.4vw]"
            >
              {statement.split(" ").map((word, index) => (
                <span key={`${word}-${index}`} data-word className="inline-block">
                  {word}&nbsp;
                </span>
              ))}
            </p>

            <div className="mt-14 grid grid-cols-1 gap-10 border-t border-paper/15 pt-10 sm:grid-cols-3">
              {[
                {
                  step: "01",
                  title: "Source",
                  body: "Racks, warehouses and private collections across West Africa and Europe.",
                },
                {
                  step: "02",
                  title: "Restore",
                  body: "Repairs, laundering and measurements handled before anything is listed.",
                },
                {
                  step: "03",
                  title: "Release",
                  body: "Photographed once, listed once. Sold pieces are removed from the vault.",
                },
              ].map((item) => (
                <div key={item.step}>
                  <span className="font-sans text-[9px] uppercase tracking-[0.3em] text-paper/35">
                    {item.step}
                  </span>
                  <h3 className="mt-4 font-serif text-2xl tracking-editorial text-paper">
                    {item.title}
                  </h3>
                  <p className="mt-3 font-sans text-[12px] leading-relaxed text-paper/50">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
