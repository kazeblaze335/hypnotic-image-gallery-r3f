"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function MaskedHero() {
  const containerRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Hardware-accelerated parallax using force3D
      // We scale the image slightly larger than the container so it has room to pan
      gsap.fromTo(
        imageRef.current,
        { yPercent: -15 },
        {
          yPercent: 15,
          ease: "none",
          force3D: true, // Forces GPU layer rendering
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    },
    { scope: containerRef },
  );

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden flex items-center justify-center bg-zinc-100 dark:bg-zinc-950"
    >
      {/* 1. The Parallax Image Background */}
      {/* We make it 120% height to ensure it doesn't show edges during the parallax scroll */}
      <div
        ref={imageRef}
        className="absolute w-full h-[120%] will-change-transform"
      >
        <Image
          // Assuming you moved the assets folder into Next's public directory: /public/assets/
          src="/assets/images/img4.jpg"
          alt="Wide Fashion Mask"
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* 2. The Text Knockout Layer */}
      {/* LIGHT MODE: bg-zinc-100 with mix-blend-screen. White blocks the image, black text becomes transparent.
        DARK MODE: bg-zinc-950 with mix-blend-multiply. Black blocks the image, white text becomes transparent.
      */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none bg-zinc-100 text-black mix-blend-screen dark:bg-zinc-950 dark:text-white dark:mix-blend-multiply transition-colors duration-500">
        <h1
          className="font-black leading-[0.75] tracking-tighter text-center"
          style={{ fontSize: "clamp(8rem, 28vw, 30rem)" }}
        >
          WIDE
        </h1>

        {/* Optional Subtitle to match the agency feel */}
        <p className="mt-8 text-sm md:text-lg font-medium tracking-[0.3em] uppercase">
          A Hypnotic Exploration
        </p>
      </div>
    </section>
  );
}
