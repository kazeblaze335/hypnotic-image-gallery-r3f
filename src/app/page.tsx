"use client";

import { useEffect, useRef, useState } from "react";
import Navbar from "@/components/ui/NavBar";
import Footer from "@/components/ui/Footer";
import FilmGrain from "@/components/ui/FilmGrain";

// We will build these two components next!
import MaskedHero from "@/components/sections/MaskedHero";
import FlipGallery from "@/components/sections/FlipGallery";

export default function Home() {
  const [footerHeight, setFooterHeight] = useState(0);
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setFooterHeight(entry.contentRect.height);
      }
    });
    if (footerRef.current) resizeObserver.observe(footerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <FilmGrain />
      <main className="relative bg-zinc-100 dark:bg-zinc-950 min-h-screen text-zinc-900 dark:text-zinc-100 overflow-clip transition-colors duration-500">
        <Navbar />

        {/* Main Content Wrapper */}
        <div
          className="relative z-10 transition-colors duration-500 bg-zinc-100 dark:bg-zinc-950 shadow-[0_-20px_50px_rgba(0,0,0,0.3)]"
          style={{ marginBottom: `${footerHeight}px` }}
        >
          {/* 1. The "WIDE" Text Mask Hero Section */}
          <MaskedHero />

          {/* 2. The interactive GSAP Flip Grid Gallery */}
          <FlipGallery />
        </div>

        {/* Floating Footer Layer */}
        <div
          ref={footerRef}
          className="fixed bottom-0 left-0 w-full z-0 pointer-events-none"
        >
          <div className="pointer-events-auto">
            <Footer />
          </div>

          {/* Back to Top Button */}
          <button
            onClick={scrollToTop}
            className="pointer-events-auto absolute bottom-8 right-8 md:bottom-12 md:right-16 w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-full border border-zinc-300 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100 dark:hover:bg-zinc-100 dark:hover:text-zinc-900 transition-all duration-500 z-50 group"
          >
            <svg
              className="w-5 h-5 md:w-6 md:h-6 transform group-hover:-translate-y-1 transition-transform duration-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 19V5M5 12l7-7 7 7"
              />
            </svg>
          </button>
        </div>
      </main>
    </>
  );
}
