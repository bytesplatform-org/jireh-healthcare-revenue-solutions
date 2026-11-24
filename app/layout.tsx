import type { Metadata, Viewport } from "next";
import { Instrument_Sans, Newsreader, Urbanist } from "next/font/google";
import { SITE } from "@/lib/content";
import { Loader } from "./_components/loader";
import { Nav } from "./_components/nav";
import { RouteGate } from "./_components/route-gate";
import { SmoothScroll } from "./_components/motion/smooth-scroll";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  display: "swap",
});

/** The concept theme's grotesk (loader + home page). */
const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
  display: "swap",
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `Home Health Billing & Revenue Cycle Management | ${SITE.name}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: ["home health billing", "revenue cycle management", "Medicare claims", "Medicaid verification", "Virginia ID/DD Waiver billing"],
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: SITE.name,
    description: SITE.description,
    images: [{ url: "/images/og.jpg", width: 1200, height: 630, alt: "Jireh Healthcare Revenue Solutions" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/images/og.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#f5f2ec",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${instrumentSans.variable} ${newsreader.variable} ${urbanist.variable} antialiased`}
    >
      <head>
        {/*
          Before first paint: mark JS as available, lock scrolling while the loader
          covers the page (released by the loader; failsafe after 11s), stop the
          browser restoring the previous scroll position, and, if a page transition
          ended in a full reload, paint the loader at the charge it had reached.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){var d=document.documentElement;d.classList.add('js','is-loading');setTimeout(function(){d.classList.remove('is-loading')},11000);if('scrollRestoration' in history)history.scrollRestoration='manual';try{var r=JSON.parse(sessionStorage.getItem('jh:transition')||'null');if(r&&Date.now()-r.at<8000){d.classList.add('jh-resume');d.style.setProperty('--jh-p',String(r.p))}}catch(e){}})();",
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[70] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:text-indigo"
        >
          Skip to content
        </a>
        <SmoothScroll />
        <RouteGate>
          <Nav />
        </RouteGate>
        {children}
        <Loader />
      </body>
    </html>
  );
}
