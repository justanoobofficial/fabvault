"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight, Plus } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatIndex, formatNaira } from "@/lib/format";
import type { Product } from "@/lib/types";

export function ProductCard({
  product,
  index,
}: {
  product: Product;
  index: number;
}) {
  const { addItem } = useCart();
  const [size, setSize] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Clip path reveal on scroll. Runs on the media frame so the tilt
  // transform on the parent stays untouched.
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = cardRef.current?.querySelector("[data-card-media]");
    if (!media) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        media,
        { clipPath: "inset(0% 0% 100% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.3,
          ease: "expo.out",
          scrollTrigger: { trigger: media, start: "top 88%", once: true },
        }
      );
    }, cardRef);

    return () => ctx.revert();
  }, []);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  const springConfig = { stiffness: 140, damping: 18, mass: 0.4 };
  const rotateX = useSpring(
    useTransform(pointerY, [-0.5, 0.5], [7, -7]),
    springConfig
  );
  const rotateY = useSpring(
    useTransform(pointerX, [-0.5, 0.5], [-7, 7]),
    springConfig
  );

  const handleMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const resetTilt = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  const sizes = product.sizes && product.sizes.length ? product.sizes : ["OS"];
  const activeSize = size ?? sizes[0];

  const handleAdd = () => {
    if (product.soldOut) return;
    addItem(product, activeSize);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="group relative"
    >
      <div
        ref={cardRef}
        onMouseMove={handleMove}
        onMouseLeave={resetTilt}
        data-cursor="snap"
        className="tilt-card [perspective:1400px]"
      >
        <motion.div
          style={{ rotateX, rotateY, transformPerspective: 1400 }}
          className="relative"
        >
          <div
            data-card-media
            className="relative aspect-editorial overflow-hidden bg-bone"
          >
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 480px"
                className="object-cover transition-transform duration-[1200ms] ease-vault group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center font-sans text-[10px] uppercase tracking-[0.3em] text-ink/30">
                No image
              </div>
            )}

            <div className="pointer-events-none absolute inset-0 bg-void/0 transition-colors duration-700 ease-vault group-hover:bg-void/35" />

            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <span className="flex translate-y-3 items-center gap-3 border border-paper/50 bg-void/25 px-5 py-3 font-sans text-[9px] uppercase tracking-[0.34em] text-paper opacity-0 backdrop-blur-md transition-all duration-700 ease-vault group-hover:translate-y-0 group-hover:opacity-100">
                View item
                <ArrowUpRight className="h-3 w-3" strokeWidth={1.25} />
              </span>
            </div>

            <span className="absolute left-3 top-3 font-sans text-[9px] uppercase tracking-[0.28em] text-paper/90 mix-blend-difference">
              {formatIndex(index)}
            </span>

            {product.tag ? (
              <span className="absolute right-3 top-3 border border-paper/40 px-2 py-1 font-sans text-[8px] uppercase tracking-[0.24em] text-paper/90 backdrop-blur-sm">
                {product.tag}
              </span>
            ) : null}

            {!product.soldOut ? (
              <button
                type="button"
                onClick={handleAdd}
                aria-label={`Add ${product.name} to bag`}
                data-cursor="hover"
                className="absolute bottom-3 right-3 z-10 flex h-10 w-10 items-center justify-center border border-paper/40 bg-void/35 text-paper backdrop-blur-md transition-all duration-500 ease-vault hover:border-paper hover:bg-paper hover:text-ink md:group-hover:pointer-events-none md:group-hover:translate-y-2 md:group-hover:opacity-0"
              >
                <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
              </button>
            ) : null}

            {product.soldOut ? (
              <div className="absolute inset-0 flex items-center justify-center bg-void/55 backdrop-blur-[2px]">
                <span className="border border-paper/50 px-4 py-2 font-sans text-[9px] uppercase tracking-[0.34em] text-paper">
                  Vaulted
                </span>
              </div>
            ) : (
              <div className="absolute inset-x-0 bottom-0 hidden translate-y-full p-3 transition-transform duration-700 ease-vault group-hover:translate-y-0 md:block">
                <div className="flex flex-col gap-2 bg-ink/45 p-3 backdrop-blur-xl">
                  {sizes.length > 1 ? (
                    <div className="flex flex-wrap items-center gap-1.5">
                      {sizes.map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setSize(option)}
                          data-cursor="hover"
                          aria-label={`Select size ${option}`}
                          className={`border px-2 py-1 font-sans text-[9px] uppercase tracking-[0.16em] transition-colors duration-300 ${
                            activeSize === option
                              ? "border-paper bg-paper text-ink"
                              : "border-paper/40 text-paper/80 hover:border-paper"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  ) : null}

                  <button
                    type="button"
                    onClick={handleAdd}
                    data-cursor="hover"
                    data-cursor-label="Add"
                    className="group/add flex w-full items-center justify-between border border-paper/30 bg-void/30 px-3 py-2.5 font-sans text-[9px] uppercase tracking-[0.28em] text-paper transition-colors duration-300 hover:bg-paper hover:text-ink"
                  >
                    Quick add
                    <Plus
                      className="h-3 w-3 transition-transform duration-300 group-hover/add:rotate-90"
                      strokeWidth={1.5}
                    />
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <div className="mt-4 flex items-start justify-between gap-6 border-t border-ink/12 pt-3">
        <div className="min-w-0">
          <h3 className="truncate font-serif text-[17px] leading-tight tracking-editorial text-ink">
            {product.name}
          </h3>
          <p className="mt-1 font-sans text-[9px] uppercase tracking-[0.28em] text-ash">
            {product.category || "Archive"}
            {sizes.length > 1 ? ` / ${sizes.join(" ")}` : ""}
          </p>
        </div>
        <p className="shrink-0 font-sans text-[11px] tabular-nums tracking-[0.08em] text-ink">
          {formatNaira(product.price)}
        </p>
      </div>
    </motion.article>
  );
}
