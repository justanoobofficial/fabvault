import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex min-h-[80svh] items-center bg-paper pt-[68px] md:pt-[78px]">
        <div className="shell grid grid-cols-1 gap-10 py-20 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <p className="eyebrow">Error / 404</p>
            <h1 className="display mt-6 text-[17vw] leading-[0.82] text-ink sm:text-[12vw] lg:text-[9vw]">
              Nothing
              <br />
              here.
            </h1>
          </div>
          <div className="md:col-span-3 md:col-start-10">
            <p className="max-w-[30ch] font-sans text-[13px] leading-relaxed text-ink/60">
              This page has been archived, sold, or never existed. The vault is
              open on the other side.
            </p>
            <Link href="/" data-cursor="hover" className="btn-editorial mt-8">
              Return home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
