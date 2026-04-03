import type { Metadata } from "next";
import "./globals.css";
import SmoothScrollProvider from "@/providers/SmoothScrollProvider";
import { ViewTransitions } from "next-view-transitions";
import localFont from "next/font/local";

import Preloader from "@/components/ui/Preloader";
import GlobalCanvas from "@/components/webgl/GlobalCanvas";

// Loading PP Neue Montreal as per the HTML reference
const neueMontreal = localFont({
  src: "../../public/fonts/PPNeueMontreal-Bold.otf",
  variable: "--font-neue",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hypnotic Image Gallery",
  description: "A silky smooth GSAP Flip gallery and masking experiment.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ViewTransitions>
      <html lang="en" className="dark">
        <body
          className={`bg-zinc-950 text-zinc-100 antialiased selection:bg-[#CCFF00] selection:text-zinc-950 ${neueMontreal.variable} font-sans`}
        >
          <Preloader />

          {/* Keeping R3F Canvas active for future WebGL layers */}
          <GlobalCanvas />

          <SmoothScrollProvider>{children}</SmoothScrollProvider>
        </body>
      </html>
    </ViewTransitions>
  );
}
