"use client";

import { useState } from "react";
import FilmGrain from "@/components/ui/FilmGrain";
import MaskedHero from "@/components/sections/MaskedHero";
import FlipGallery from "@/components/sections/FlipGallery";

export default function Home() {
  // Lifted state: Both the Hero Mask and the Gallery now share this!
  const [activeLayout, setActiveLayout] = useState("layout-1-gallery");

  return (
    <>
      <FilmGrain />
      {/* 100vh strict lock. No scrolling permitted. */}
      <main className="fixed inset-0 w-full h-screen overflow-hidden bg-white dark:bg-black text-zinc-900 dark:text-zinc-100">
        {/* Pass the layout state down to both components */}
        <MaskedHero activeLayout={activeLayout} />
        <FlipGallery
          activeLayout={activeLayout}
          setActiveLayout={setActiveLayout}
        />
      </main>
    </>
  );
}
