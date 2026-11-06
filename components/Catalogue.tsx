"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { useProducts } from "@/lib/products";
import { ProductCard } from "./ProductCard";
import { EmptyState, SkeletonGrid } from "./EmptyState";
import { MaskLines, Reveal } from "./Reveal";
import { formatIndex } from "@/lib/format";

export function Catalogue({
  limit,
  showFilters = true,
  showHeading = true,
}: {
  limit?: number;
  showFilters?: boolean;
  showHeading?: boolean;
}) {
  const { products, loading, error, refresh } = useProducts();
  const [category, setCategory] = useState<string>("all");

  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((product) => {
      if (product.category) set.add(product.category.toUpperCase());
    });
    return Array.from(set);
  }, [products]);

  const visible = useMemo(() => {
    const filtered =
      category === "all"
        ? products
        : products.filter(
            (product) => (product.category || "").toUpperCase() === category
          );
    return limit ? filtered.slice(0, limit) : filtered;
  }, [products, category, limit]);

  return (
    <section id="vault" className="relative bg-paper py-20 md:py-28">
      <div className="shell">
        {showHeading ? (
          <div className="grid grid-cols-1 gap-8 border-b border-ink/15 pb-10 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7">
              <Reveal>
                <p className="eyebrow">Section 01 / The vault</p>
              </Reveal>
              <h2 className="display mt-5 text-[13vw] leading-[0.84] text-ink sm:text-[9.5vw] lg:text-[7.2vw]">
                <MaskLines lines={["Curated", "goods"]} />
              </h2>
            </div>
            <div className="md:col-span-4 md:col-start-9">
              <Reveal delay={0.15}>
                <p className="max-w-[34ch] font-sans text-[13px] leading-relaxed text-ink/60">
                  Every piece is sourced, measured and shot in Lagos. Single
                  units only. When a garment is sold, it leaves the archive.
                </p>
              </Reveal>
              <Reveal delay={0.25}>
                <div className="mt-6 flex items-center gap-4 font-sans text-[10px] uppercase tracking-[0.3em] text-ash">
                  <span className="h-px w-10 bg-ink/25" />
                  <span>
                    {products.length
                      ? `${String(products.length).padStart(2, "0")} pieces live`
                      : "Awaiting release"}
                  </span>
                </div>
              </Reveal>
            </div>
          </div>
        ) : null}

        {showFilters && products.length > 0 ? (
          <div className="mt-8 flex flex-wrap items-center gap-2">
            <span className="mr-2 font-sans text-[9px] uppercase tracking-[0.3em] text-ash">
              Filter
            </span>
            {["all", ...categories].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                data-cursor="hover"
                className={`border px-3 py-2 font-sans text-[9px] uppercase tracking-[0.24em] transition-colors duration-500 ease-vault ${
                  category === item
                    ? "border-ink bg-ink text-paper"
                    : "border-ink/20 text-ink/60 hover:border-ink hover:text-ink"
                }`}
              >
                {item === "all" ? "Everything" : item}
              </button>
            ))}
          </div>
        ) : null}

        <div className="mt-10 md:mt-14">
          {loading ? (
            <SkeletonGrid count={limit ?? 6} />
          ) : error ? (
            <div className="border border-ink/15 bg-bone/40 px-6 py-14 text-center">
              <p className="eyebrow">Connection issue</p>
              <p className="mx-auto mt-4 max-w-[46ch] font-serif text-2xl leading-tight tracking-editorial text-ink">
                {error}
              </p>
              <button
                type="button"
                onClick={refresh}
                data-cursor="hover"
                className="btn-editorial mt-8"
              >
                Retry
                <RefreshCw className="h-3.5 w-3.5" strokeWidth={1.25} />
              </button>
            </div>
          ) : visible.length === 0 ? (
            <EmptyState
              showAction={category === "all"}
              hint={
                category !== "all"
                  ? "Nothing in this category right now. The next release is being catalogued."
                  : undefined
              }
            />
          ) : (
            <>
              <div className="grid grid-cols-1 gap-x-5 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
                {visible.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                  />
                ))}
              </div>

              {limit && products.length > limit ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="mt-16 flex items-center justify-between border-t border-ink/15 pt-6"
                >
                  <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-ash">
                    {formatIndex(Math.min(limit, products.length) - 1)} of{" "}
                    {String(products.length).padStart(3, "0")}
                  </span>
                  <Link
                    href="/catalogue"
                    data-cursor="hover"
                    className="link-underline font-sans text-[10px] uppercase tracking-[0.3em] text-ink"
                  >
                    Full catalogue
                  </Link>
                </motion.div>
              ) : null}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
