"use client";

import FilmGrain from "@/components/ui/FilmGrain";
import MaskedHero from "@/components/sections/MaskedHero";
import FlipGallery from "@/components/sections/FlipGallery";

export default function Home() {
  return (
    <>
      <FilmGrain />
      {/* 100vh strict lock. No scrolling permitted. */}
      <main className="fixed inset-0 w-full h-screen overflow-hidden bg-white dark:bg-black text-zinc-900 dark:text-zinc-100">
        <MaskedHero />
        <FlipGallery />
      </main>
    </>
  );
}
