"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useLenisScroll } from "./providers/SmoothScroll";

const links = [
  { label: "The Vault", href: "/#vault" },
  { label: "Catalogue", href: "/catalogue" },
  { label: "Process", href: "/#process" },
];

export function Header({ invert = false }: { invert?: boolean }) {
  const { count, openCart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { scrollTo } = useLenisScroll();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const handleAnchor = (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (!href.startsWith("/#")) return;
    const id = href.replace("/#", "#");
    if (pathname === "/") {
      event.preventDefault();
      scrollTo(id);
    }
  };

  // On the dark hero the header sits in paper tone, then flips once the page
  // scrolls behind a light backdrop.
  const tone = scrolled || !invert ? "text-ink" : "text-paper";
  const logoMark = scrolled || !invert ? "border-ink/25" : "border-paper/40";

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[90] transition-[background-color,backdrop-filter,border-color,color] duration-500 ease-vault ${
          scrolled
            ? "border-b border-ink/10 bg-paper/70 text-ink shadow-[0_1px_0_0_rgba(17,17,17,0.04)] backdrop-blur-2xl backdrop-saturate-150"
            : `border-b border-transparent bg-transparent ${tone}`
        }`}
      >
        <div className="shell flex h-[68px] items-center justify-between md:h-[78px]">
          <Link
            href="/"
            data-cursor="hover"
            aria-label="The Fab Vault home"
            className="group flex items-baseline gap-3"
          >
            <span className="font-serif text-[19px] uppercase tracking-editorial md:text-[21px]">
              The Fab Vault
            </span>
            <span className="hidden font-sans text-[9px] uppercase tracking-[0.3em] opacity-50 sm:block">
              Est. Lagos
            </span>
          </Link>

          <nav className="hidden items-center gap-9 md:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(event) => handleAnchor(event, link.href)}
                data-cursor="hover"
                className="link-underline font-sans text-[10px] uppercase tracking-[0.3em] opacity-70 transition-opacity hover:opacity-100"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={openCart}
              data-cursor="hover"
              data-cursor-label="Bag"
              className="group flex items-center gap-2 font-sans text-[10px] uppercase tracking-[0.3em]"
            >
              <span className="hidden sm:inline">Bag</span>
              <span
                className={`relative flex h-6 min-w-6 items-center justify-center border px-1 font-sans text-[10px] tabular-nums tracking-normal transition-colors duration-300 ${logoMark} ${
                  scrolled || !invert
                    ? "group-hover:border-ink group-hover:bg-ink group-hover:text-paper"
                    : "group-hover:border-paper group-hover:bg-paper group-hover:text-ink"
                }`}
              >
                {String(count).padStart(2, "0")}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="flex h-8 w-8 items-center justify-center md:hidden"
            >
              <Menu className="h-4 w-4" strokeWidth={1.25} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-[110] bg-void/50 backdrop-blur-sm md:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 32, mass: 0.9 }}
              className="fixed inset-y-0 right-0 z-[112] flex w-[86%] max-w-[380px] flex-col bg-ink text-paper md:hidden"
            >
              <div className="flex h-[68px] shrink-0 items-center justify-between border-b border-paper/12 px-5">
                <span className="font-serif text-[17px] uppercase tracking-editorial">
                  The Fab Vault
                </span>
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                  className="flex h-8 w-8 items-center justify-center border border-paper/25 transition-colors hover:bg-paper hover:text-ink"
                >
                  <X className="h-4 w-4" strokeWidth={1.25} />
                </button>
              </div>

              <nav className="flex flex-1 flex-col justify-center px-5">
                {links.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ y: 34, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    transition={{
                      delay: 0.1 + index * 0.07,
                      duration: 0.65,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="border-b border-paper/12"
                  >
                    <Link
                      href={link.href}
                      onClick={(event) => {
                        handleAnchor(event, link.href);
                        setMenuOpen(false);
                      }}
                      className="flex items-baseline justify-between py-5"
                    >
                      <span className="font-serif text-[34px] leading-none tracking-editorial">
                        {link.label}
                      </span>
                      <span className="font-sans text-[9px] tracking-[0.3em] text-paper/35">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.34, duration: 0.6 }}
                className="flex flex-col gap-2 border-t border-paper/12 px-5 py-6 font-sans text-[9px] uppercase tracking-[0.3em] text-paper/35"
              >
                <span>Lagos, Nigeria</span>
                <a href="https://wa.me/2349125310881" className="text-paper/70">
                  +234 912 531 0881
                </a>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
