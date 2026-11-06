"use client";

import Link from "next/link";
import { ArrowUpRight, Instagram, Mail } from "lucide-react";
import { ADMIN_EMAIL, WHATSAPP_NUMBER } from "@/lib/firebase";
import { MaskLines, Reveal } from "./Reveal";
import { Magnetic } from "./Magnetic";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-void pt-20 text-paper md:pt-28">
      <div className="shell">
        <div className="grid grid-cols-1 gap-12 border-b border-paper/12 pb-14 md:grid-cols-12">
          <div className="md:col-span-6">
            <Reveal>
              <p className="eyebrow text-paper/40">Newsletter / no noise</p>
            </Reveal>
            <h2 className="display mt-5 text-[11vw] leading-[0.86] sm:text-[7vw] lg:text-[5.2vw]">
              <MaskLines
                lines={["First access,", "nothing else."]}
                lineClassName="text-paper"
              />
            </h2>
            <form
              onSubmit={(event) => event.preventDefault()}
              className="mt-9 flex max-w-[440px] items-stretch border border-paper/25"
            >
              <input
                type="email"
                required
                placeholder="EMAIL ADDRESS"
                aria-label="Email address"
                className="min-w-0 flex-1 bg-transparent px-4 py-4 font-sans text-[10px] uppercase tracking-[0.24em] text-paper placeholder:text-paper/30 focus:outline-none"
              />
              <Magnetic strength={0.4} innerClassName="h-full">
                <button
                  type="submit"
                  data-cursor="hover"
                  aria-label="Subscribe"
                  className="flex h-full w-14 items-center justify-center border-l border-paper/25 transition-colors duration-500 hover:bg-paper hover:text-ink"
                >
                  <ArrowUpRight className="h-4 w-4" strokeWidth={1.25} />
                </button>
              </Magnetic>
            </form>
          </div>

          <div className="grid grid-cols-2 gap-8 md:col-span-5 md:col-start-8">
            <div>
              <p className="eyebrow text-paper/35">Index</p>
              <ul className="mt-5 space-y-3">
                {[
                  { label: "Catalogue", href: "/catalogue" },
                  { label: "The Vault", href: "/#vault" },
                  { label: "Process", href: "/#process" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      data-cursor="hover"
                      className="link-underline font-sans text-[11px] uppercase tracking-[0.22em] text-paper/70 transition-colors hover:text-paper"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="eyebrow text-paper/35">Legal</p>
              <ul className="mt-5 space-y-3">
                {[
                  { label: "Privacy policy", href: "/privacy-policy" },
                  {
                    label: "Terms and conditions",
                    href: "/terms-and-conditions",
                  },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      data-cursor="hover"
                      className="link-underline font-sans text-[11px] uppercase tracking-[0.22em] text-paper/70 transition-colors hover:text-paper"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 py-10 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <p className="eyebrow text-paper/35">Contact</p>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noreferrer"
              className="mt-3 flex items-center gap-2 font-sans text-[11px] uppercase tracking-[0.2em] text-paper/75 hover:text-paper"
            >
              <Mail className="h-3.5 w-3.5" strokeWidth={1.25} />
              +234 912 531 0881
            </a>
          </div>
          <div>
            <p className="eyebrow text-paper/35">Studio</p>
            <p className="mt-3 font-sans text-[11px] uppercase leading-relaxed tracking-[0.2em] text-paper/75">
              Lagos, Nigeria
              <br />
              By appointment
            </p>
          </div>
          <div>
            <p className="eyebrow text-paper/35">Social</p>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="mt-3 flex items-center gap-2 font-sans text-[11px] uppercase tracking-[0.2em] text-paper/75 hover:text-paper"
            >
              <Instagram className="h-3.5 w-3.5" strokeWidth={1.25} />
              Instagram
            </a>
          </div>
          <div>
            <p className="eyebrow text-paper/35">Admin</p>
            <a
              href={`mailto:${ADMIN_EMAIL}`}
              className="mt-3 break-all font-sans text-[11px] tracking-[0.12em] text-paper/75 hover:text-paper"
            >
              {ADMIN_EMAIL}
            </a>
          </div>
        </div>
      </div>

      <div className="select-none overflow-hidden">
        <p className="display whitespace-nowrap px-4 text-[17vw] leading-[0.78] text-paper/10 md:text-[14vw]">
          THE FAB VAULT
        </p>
      </div>

      <div className="shell flex flex-col items-start justify-between gap-3 border-t border-paper/10 py-6 sm:flex-row sm:items-center">
        <span className="font-sans text-[9px] uppercase tracking-[0.28em] text-paper/35">
          Copyright {year} The Fab Vault. All rights reserved.
        </span>
        <span className="font-sans text-[9px] uppercase tracking-[0.28em] text-paper/25">
          Built in Lagos
        </span>
      </div>
    </footer>
  );
}
