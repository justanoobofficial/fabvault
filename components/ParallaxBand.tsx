"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MaskLines } from "./Reveal";
import { Magnetic } from "./Magnetic";

const BAND_IMAGE =
  "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?q=80&w=2400&auto=format&fit=crop";

export function ParallaxBand() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-band-image]",
        { yPercent: -12 },
        {
          yPercent: 12,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );

      gsap.fromTo(
        "[data-band-line]",
        { width: 0 },
        {
          width: "100%",
          duration: 1.6,
          ease: "power3.inOut",
          scrollTrigger: { trigger: root.current, start: "top 65%" },
        }
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={root}
      className="relative flex min-h-[78vh] items-end overflow-hidden bg-void md:min-h-[86vh]"
    >
      <div data-band-image className="absolute inset-[-14%_0]">
        <Image
          src={BAND_IMAGE}
          alt="Vertical concrete and light study"
          fill
          sizes="100vw"
          className="object-cover grayscale"
        />
      </div>
      <div className="absolute inset-0 bg-void/45" />

      <div className="shell relative z-10 w-full pb-14 pt-24 text-paper md:pb-20">
        <div data-band-line className="h-px bg-paper/35" />
        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-12 md:items-end">
          <blockquote className="display text-[11vw] leading-[0.86] md:col-span-8 md:text-[6vw]">
            <MaskLines
              lines={["Wear it", "like it", "was yours."]}
              lineClassName="text-paper"
            />
          </blockquote>
          <div className="md:col-span-4">
            <p className="max-w-[30ch] font-sans text-[12px] leading-relaxed text-paper/60">
              A single garment can outlive three owners. Our job is to make sure
              the fourth one still wants it.
            </p>
            <Magnetic className="mt-8" strength={0.32}>
              <a
                href="https://wa.me/2349125310881?text=Hello%20Fab%20Vault%2C%20I%20would%20like%20to%20sell%20a%20piece."
                target="_blank"
                rel="noreferrer"
                data-cursor="hover"
                className="btn-editorial btn-editorial-invert"
              >
                Sell to the vault
              </a>
            </Magnetic>
          </div>
        </div>
      </div>
    </div>
  );
}
