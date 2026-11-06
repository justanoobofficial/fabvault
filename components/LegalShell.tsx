import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export type LegalSection = {
  heading: string;
  paragraphs: string[];
  list?: string[];
};

export function LegalShell({
  index,
  title,
  intro,
  updated,
  sections,
}: {
  index: string;
  title: string;
  intro: string;
  updated: string;
  sections: LegalSection[];
}) {
  return (
    <main className="bg-paper pb-24 pt-[68px] text-ink md:pt-[78px]">
      <div className="shell">
        <div className="flex items-center justify-between border-b border-ink/15 py-6">
          <Link
            href="/"
            data-cursor="hover"
            className="group flex items-center gap-3 font-sans text-[10px] uppercase tracking-[0.3em] text-ink/60 transition-colors hover:text-ink"
          >
            <ArrowLeft
              className="h-3.5 w-3.5 transition-transform duration-500 ease-vault group-hover:-translate-x-1"
              strokeWidth={1.25}
            />
            Return
          </Link>
          <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-ash">
            {index}
          </span>
        </div>

        <header className="grid grid-cols-1 gap-10 py-14 md:grid-cols-12 md:py-20">
          <div className="md:col-span-7">
            <p className="eyebrow">The Fab Vault / Legal</p>
            <h1 className="display mt-6 text-[13vw] leading-[0.84] sm:text-[9vw] lg:text-[6.4vw]">
              {title}
            </h1>
          </div>
          <div className="md:col-span-4 md:col-start-9">
            <p className="font-sans text-[12px] leading-relaxed text-ink/55">
              {intro}
            </p>
            <p className="mt-6 font-sans text-[9px] uppercase tracking-[0.28em] text-ash">
              Last revised / {updated}
            </p>
          </div>
        </header>

        <div className="border-t border-ink/15">
          {sections.map((section, i) => (
            <section
              key={section.heading}
              className="grid grid-cols-1 gap-5 border-b border-ink/10 py-9 md:grid-cols-12"
            >
              <div className="md:col-span-4">
                <span className="font-sans text-[9px] uppercase tracking-[0.3em] text-ash">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="mt-2 font-serif text-xl leading-tight tracking-editorial md:text-2xl">
                  {section.heading}
                </h2>
              </div>
              <div className="md:col-span-7 md:col-start-6">
                {section.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 24)}
                    className="mb-4 font-sans text-[13px] leading-[1.75] text-ink/65 last:mb-0"
                  >
                    {paragraph}
                  </p>
                ))}
                {section.list ? (
                  <ul className="mt-4 space-y-2">
                    {section.list.map((item) => (
                      <li
                        key={item}
                        className="flex gap-3 font-sans text-[12px] leading-relaxed text-ink/60"
                      >
                        <span aria-hidden className="text-ink/30">
                          /
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border border-ink/15 p-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-sans text-[11px] uppercase tracking-[0.24em] text-ink/55">
            Questions / support.fabuyodevs@gmail.com
          </p>
          <a
            href="https://wa.me/2349125310881"
            target="_blank"
            rel="noreferrer"
            data-cursor="hover"
            className="link-underline font-sans text-[10px] uppercase tracking-[0.28em] text-ink"
          >
            WhatsApp the studio
          </a>
        </div>
      </div>
    </main>
  );
}
