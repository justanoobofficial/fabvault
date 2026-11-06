"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Asterisk } from "lucide-react";
import { MaskLines } from "./Reveal";

const ease = [0.16, 1, 0.3, 1] as const;

export function EmptyState({
  message,
  hint = "Nothing is listed at this moment. The next release is being photographed, measured and priced. First access goes to the list at the bottom of the page.",
  showAction = true,
}: {
  message?: string;
  hint?: string;
  showAction?: boolean;
}) {
  return (
    <div className="relative border border-ink/12 bg-paper px-6 py-20 sm:px-10 md:py-28">
      <motion.div
        aria-hidden
        animate={{ rotate: 360 }}
        transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
        className="pointer-events-none absolute right-6 top-6 text-ink/15"
      >
        <Asterisk className="h-16 w-16" strokeWidth={0.6} />
      </motion.div>

      <div className="relative mx-auto max-w-3xl text-center">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease }}
          className="eyebrow"
        >
          Vault status / 00 items
        </motion.p>

        <h3 className="display mt-6 text-[13vw] leading-[0.86] text-ink sm:text-[9vw] lg:text-[7vw]">
          <MaskLines
            lines={[message || "The vault", message ? "" : "is empty"].filter(
              Boolean
            )}
            lineClassName="text-ink"
          />
        </h3>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease, delay: 0.2 }}
          className="mx-auto mt-8 max-w-[46ch] font-sans text-[13px] leading-relaxed text-ink/55"
        >
          {hint}
        </motion.p>

        {showAction ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease, delay: 0.32 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <Link href="/catalogue" data-cursor="hover" className="btn-editorial">
              Catalogue
            </Link>
            <a
              href="https://wa.me/2349125310881?text=Hello%20Fab%20Vault%2C%20I%20would%20like%20to%20enquire%20about%20the%20next%20drop."
              target="_blank"
              rel="noreferrer"
              data-cursor="hover"
              className="btn-editorial border-ink/25 text-ink/70 hover:border-ink"
            >
              Enquire
            </a>
          </motion.div>
        ) : null}
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>
          <div className="relative aspect-editorial overflow-hidden bg-bone">
            <motion.div
              aria-hidden
              animate={{ x: ["-120%", "120%"] }}
              transition={{
                duration: 1.9,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.12,
              }}
              className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/50 to-transparent"
            />
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-ink/10 pt-3">
            <div className="h-2 w-32 bg-ink/10" />
            <div className="h-2 w-14 bg-ink/10" />
          </div>
        </div>
      ))}
    </div>
  );
}
