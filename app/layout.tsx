import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { AppProviders } from "@/components/providers/AppProviders";
import { Preloader } from "@/components/Preloader";
import { Cursor } from "@/components/Cursor";

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "The Fab Vault | Premium Thrift",
  description:
    "Archive 001. One-off garments sourced by hand in Lagos. Curated goods, single units, no restocks.",
  applicationName: "The Fab Vault",
  keywords: [
    "premium thrift",
    "vintage archive",
    "Lagos thrift",
    "curated goods",
    "The Fab Vault",
  ],
  authors: [{ name: "The Fab Vault" }],
  openGraph: {
    title: "The Fab Vault | Premium Thrift",
    description:
      "Archive 001. One-off garments sourced by hand in Lagos. Nothing restocks. Nothing repeats.",
    siteName: "The Fab Vault",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Fab Vault | Premium Thrift",
    description:
      "Archive 001. One-off garments sourced by hand in Lagos. Nothing restocks. Nothing repeats.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#111111",
  width: "device-width",
  initialScale: 1,
};

/**
 * Runs before first paint. Locks the document and kills browser scroll
 * restoration so the intro always starts at the very top of the page.
 * The attribute is removed by the preloader once it has finished.
 */
const introLockScript = `
(function () {
  try {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    document.addEventListener("DOMContentLoaded", function () {
      window.scrollTo(0, 0);
    });
    window.addEventListener("load", function () {
      if (document.documentElement.classList.contains("is-intro")) {
        window.scrollTo(0, 0);
      }
    });
  } catch (error) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // is-intro ships in the server HTML so the document is locked on the very
  // first paint, before any JavaScript runs. The preloader removes it.
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} is-intro`}
    >
      <body className="grain bg-paper font-sans text-ink antialiased">
        <noscript>
          <style>{`html.is-intro{overflow:auto!important}html.is-intro body{overflow:auto!important;height:auto!important}[data-preloader]{display:none!important}`}</style>
        </noscript>
        <Script id="intro-lock" strategy="beforeInteractive">
          {introLockScript}
        </Script>
        <AppProviders>
          <Preloader />
          <Cursor />
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
