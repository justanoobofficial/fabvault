import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { Catalogue } from "@/components/Catalogue";
import { ParallaxBand } from "@/components/ParallaxBand";
import { Manifesto } from "@/components/Manifesto";
import { Footer } from "@/components/Footer";
import { MaskLines, Reveal } from "@/components/Reveal";
import { ClipReveal } from "@/components/ClipReveal";
import { Magnetic } from "@/components/Magnetic";

const SPLIT_IMAGE =
  "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?q=80&w=1600&auto=format&fit=crop";

const facts = [
  {
    label: "Sourcing",
    value: "Twice weekly",
    body: "Racks opened in Lagos, Accra and London. Pieces are chosen in person.",
  },
  {
    label: "Grading",
    value: "Inspected",
    body: "Every garment is checked for flaws, cleaned and measured before listing.",
  },
  {
    label: "Release",
    value: "Single units",
    body: "One size, one piece. Once it is gone the listing is archived.",
  },
];

export default function HomePage() {
  return (
    <>
      <Header invert />
      <main>
        <Hero />
        <Marquee />

        <section id="position" className="relative bg-paper py-20 md:py-28">
          <div className="shell grid grid-cols-1 gap-12 md:grid-cols-12">
            <div className="md:col-span-5">
              <Reveal>
                <p className="eyebrow">Section 00 / Position</p>
              </Reveal>
              <h2 className="display mt-6 text-[12vw] leading-[0.86] text-ink sm:text-[8vw] lg:text-[5.6vw]">
                <MaskLines
                  lines={["A vault,", "not a shop."]}
                  lineClassName="text-ink"
                />
              </h2>
              <Reveal delay={0.15}>
                <p className="mt-8 max-w-[38ch] font-sans text-[13px] leading-relaxed text-ink/60">
                  The Fab Vault is a private archive of second-life garments,
                  opened to the public in controlled releases. We buy well, we
                  keep little, and we price every piece on condition rather than
                  on hype.
                </p>
              </Reveal>
              <Reveal delay={0.25}>
                <div className="mt-6 flex items-center gap-3 font-sans text-[10px] uppercase tracking-[0.3em] text-ink/45">
                  <span className="h-px w-8 bg-ink/30" />
                  <span>Est. 2024 / Lagos</span>
                </div>
              </Reveal>
            </div>

            <div className="md:col-span-6 md:col-start-7">
              <ClipReveal direction="up" className="w-full" scale={1.18}>
                <div className="group relative aspect-[4/5] w-full overflow-hidden bg-bone">
                  <Image
                    src={SPLIT_IMAGE}
                    alt="Editorial street image, camel coat under stone arches"
                    fill
                    sizes="(max-width: 768px) 100vw, 48vw"
                    className="object-cover grayscale transition-all duration-[1400ms] ease-vault group-hover:scale-105 group-hover:grayscale-0"
                  />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4">
                    <span className="font-sans text-[9px] uppercase tracking-[0.28em] text-paper/80 mix-blend-difference">
                      Plate 001
                    </span>
                    <span className="font-sans text-[9px] uppercase tracking-[0.28em] text-paper/80 mix-blend-difference">
                      Lagos / NG
                    </span>
                  </div>
                </div>
              </ClipReveal>
              <Reveal delay={0.1}>
                <div className="mt-5 grid grid-cols-1 divide-y divide-ink/12 border-t border-ink/12 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                  {facts.map((fact) => (
                    <div key={fact.label} className="px-0 py-5 sm:px-4 sm:first:pl-0">
                      <p className="font-sans text-[9px] uppercase tracking-[0.28em] text-ash">
                        {fact.label}
                      </p>
                      <p className="mt-2 font-serif text-lg tracking-editorial text-ink">
                        {fact.value}
                      </p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <Marquee reverse serif />

        <Catalogue limit={6} />
        <ParallaxBand />
        <Manifesto />

        <section className="bg-paper py-20 md:py-28">
          <div className="shell">
            <div className="flex flex-col gap-6 border-b border-ink/15 pb-8 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <Reveal>
                  <p className="eyebrow">Section 03 / Enquiries</p>
                </Reveal>
                <h2 className="display mt-4 text-[11vw] leading-[0.86] text-ink sm:text-[7vw] lg:text-[5vw]">
                  <MaskLines lines={["Talk to", "the vault"]} />
                </h2>
              </div>
              <Link
                href="/catalogue"
                data-cursor="hover"
                data-magnetic="0.2"
                className="group inline-flex items-center gap-4 self-start border-b border-ink pb-2 font-sans text-[10px] uppercase tracking-[0.3em] text-ink sm:self-auto"
              >
                View all pieces
                <ArrowUpRight
                  className="h-4 w-4 transition-transform duration-500 ease-vault group-hover:-translate-y-1 group-hover:translate-x-1"
                  strokeWidth={1.25}
                />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-10 pt-10 md:grid-cols-12">
              <div className="md:col-span-5">
                <p className="max-w-[36ch] font-sans text-[13px] leading-relaxed text-ink/60">
                  Sizing, condition reports and video of any piece are available
                  on request. Send a message and a human replies, usually within
                  the hour.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:col-span-6 md:col-start-7">
                <Magnetic className="w-full" strength={0.28}>
                  <a
                    href="https://wa.me/2349125310881?text=Hello%20Fab%20Vault%2C%20I%20have%20a%20question%20about%20a%20piece."
                    target="_blank"
                    rel="noreferrer"
                    data-cursor="hover"
                    className="group flex w-full items-center justify-between border border-ink px-5 py-6 transition-colors duration-500 ease-vault hover:bg-ink hover:text-paper"
                  >
                    <span className="font-sans text-[10px] uppercase tracking-[0.28em]">
                      WhatsApp
                    </span>
                    <ArrowUpRight
                      className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1"
                      strokeWidth={1.25}
                    />
                  </a>
                </Magnetic>
                <Magnetic className="w-full" strength={0.28}>
                  <a
                    href="mailto:support.fabuyodevs@gmail.com"
                    data-cursor="hover"
                    className="group flex w-full items-center justify-between border border-ink/25 px-5 py-6 transition-colors duration-500 ease-vault hover:border-ink"
                  >
                    <span className="font-sans text-[10px] uppercase tracking-[0.28em]">
                      Email
                    </span>
                    <ArrowUpRight
                      className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1"
                      strokeWidth={1.25}
                    />
                  </a>
                </Magnetic>
              </div>
            </div>
          </div>
        </section>
        <Marquee double />
      </main>
      <Footer />
    </>
  );
}
