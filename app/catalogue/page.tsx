import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Catalogue } from "@/components/Catalogue";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Catalogue | The Fab Vault",
  description:
    "Every piece currently held in The Fab Vault. Single units, documented and priced on condition.",
};

export default function CataloguePage() {
  return (
    <>
      <Header />
      <main className="pt-[68px] md:pt-[78px]">
        <section className="bg-paper pb-4 pt-14 md:pt-20">
          <div className="shell">
            <p className="eyebrow">Index / Full archive</p>
            <h1 className="display mt-5 text-[16vw] leading-[0.82] text-ink sm:text-[12vw] lg:text-[9vw]">
              The
              <br />
              Catalogue
            </h1>
            <div className="mt-8 grid grid-cols-1 gap-6 border-t border-ink/15 pt-6 md:grid-cols-12">
              <p className="max-w-[42ch] font-sans text-[13px] leading-relaxed text-ink/60 md:col-span-6">
                Pieces are listed as they are catalogued and removed the moment
                they sell. Filter by category, or read top to bottom. The newest
                release always sits first.
              </p>
              <div className="flex items-end justify-start gap-10 md:col-span-5 md:col-start-8 md:justify-end">
                <span className="font-sans text-[9px] uppercase leading-relaxed tracking-[0.28em] text-ash">
                  Sourced
                  <br />
                  Lagos, NG
                </span>
                <span className="font-sans text-[9px] uppercase leading-relaxed tracking-[0.28em] text-ash">
                  Release
                  <br />
                  001
                </span>
              </div>
            </div>
          </div>
        </section>
        <Catalogue showHeading={false} />
      </main>
      <Footer />
    </>
  );
}
