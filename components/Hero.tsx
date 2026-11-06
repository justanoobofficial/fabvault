"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown } from "lucide-react";
import { useIntro } from "./providers/IntroProvider";
import { useLenisScroll } from "./providers/SmoothScroll";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1488161628813-04466f872be2?q=80&w=2400&auto=format&fit=crop";

const lines = ["NOTHING", "HERE IS", "NEW."];

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const { introDone } = useIntro();
  const { scrollTo } = useLenisScroll();

  useEffect(() => {
    if (!introDone) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

      // The mask already clips the line; the word travels out of it.
      tl.fromTo(
        "[data-hero-word]",
        { yPercent: 118, skewY: 4 },
        {
          yPercent: 0,
          skewY: 0,
          duration: 1.45,
          stagger: 0.09,
          ease: "expo.out",
        },
        0
      )
        .fromTo(
          "[data-hero-meta]",
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, stagger: 0.07 },
          0.15
        )
        .fromTo(
          "[data-hero-rule]",
          { scaleX: 0 },
          { scaleX: 1, duration: 1.5, ease: "power3.inOut" },
          0.45
        )
        .fromTo(
          "[data-hero-foot]",
          { y: 26, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, stagger: 0.09 },
          0.55
        )
        .fromTo(
          "[data-hero-plate]",
          { scale: 1.22, filter: "grayscale(100%) blur(10px)" },
          {
            scale: 1,
            filter: "grayscale(100%) blur(0px)",
            duration: 2,
            ease: "power2.out",
          },
          0
        )
        .fromTo(
          "[data-hero-veil]",
          { opacity: 0.85 },
          { opacity: 0.45, duration: 1.8 },
          0
        );

      // Parallax: the plate travels faster than the page and eases down
      // slightly in scale, so the type feels pinned in front of it.
      gsap.fromTo(
        "[data-hero-image]",
        { yPercent: -3, scale: 1.07 },
        {
          yPercent: 14,
          scale: 0.97,
          ease: "none",
          immediateRender: false,
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        }
      );

      gsap.to("[data-hero-copy]", {
        yPercent: -14,
        opacity: 0.15,
        filter: "blur(2px)",
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "center center",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to("[data-hero-scrim]", {
        opacity: 1,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, root);

    return () => ctx.revert();
  }, [introDone]);

  return (
    <section
      ref={root}
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-ink pb-8 pt-28 text-paper md:pb-12"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div data-hero-image className="absolute inset-[-8%_0] will-change-transform">
          <div data-hero-plate className="absolute inset-0 will-change-transform">
            <Image
              src={HERO_IMAGE}
              alt="Architectural shadow study, midtown Lagos"
              fill
              priority
              sizes="100vw"
              className="object-cover object-center grayscale"
            />
          </div>
        </div>
        <div
          data-hero-veil
          className="absolute inset-0 bg-gradient-to-b from-void/70 via-void/25 to-void/85"
        />
        <div className="absolute inset-0 bg-void/15" />
        <div
          data-hero-scrim
          className="absolute inset-0 bg-void opacity-0"
        />
      </div>

      <div className="shell relative z-10">
        <div className="flex items-center justify-between border-b border-paper/20 pb-4">
          <span
            data-hero-meta
            className="font-sans text-[10px] uppercase tracking-[0.34em] text-paper/60"
          >
            Archive 001
          </span>
          <span
            data-hero-meta
            className="font-sans text-[10px] uppercase tracking-[0.34em] text-paper/60"
          >
            Curated Goods
          </span>
        </div>

        <div data-hero-copy className="pt-10 md:pt-16">
          <h1 className="display text-[16.5vw] leading-[0.82] text-paper sm:text-[15vw] lg:text-[12.5vw]">
            {lines.map((line) => (
              <span key={line} className="mask-line">
                <span data-hero-word className="block will-change-transform">
                  {line}
                </span>
              </span>
            ))}
          </h1>
        </div>

        <div
          data-hero-rule
          className="my-8 h-px w-full origin-left bg-paper/25 md:my-10"
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-12 sm:items-end">
          <p
            data-hero-foot
            className="max-w-[36ch] font-sans text-[13px] leading-relaxed text-paper/70 sm:col-span-5 md:text-sm"
          >
            One-off garments and objects, sourced by hand and released in small
            numbers. Nothing restocks. Nothing repeats.
          </p>
          <div
            data-hero-foot
            className="flex items-center justify-between gap-6 sm:col-span-4 sm:col-start-6"
          >
            <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-paper/50">
              Lagos, NG
              <br />
              06.45 N / 03.39 E
            </span>
            <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-paper/50">
              Edition
              <br />
              001 / MMXXVI
            </span>
          </div>
          <div
            data-hero-foot
            className="flex items-center justify-end gap-3 sm:col-span-3"
          >
            <button
              type="button"
              onClick={() => scrollTo("#position")}
              data-cursor="hover"
              className="group flex items-center gap-3 font-sans text-[10px] uppercase tracking-[0.3em] text-paper/50 transition-colors hover:text-paper"
            >
              Scroll
              <span className="flex h-10 w-10 items-center justify-center border border-paper/30 transition-colors duration-500 group-hover:border-paper group-hover:bg-paper group-hover:text-ink">
                <ArrowDown
                  className="h-3.5 w-3.5 animate-bounce"
                  strokeWidth={1.25}
                />
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
