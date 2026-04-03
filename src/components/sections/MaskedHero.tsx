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
      gsap.fromTo(
        imageRef.current,
        { yPercent: -15 },
        {
          yPercent: 15,
          ease: "none",
          force3D: true,
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
      className="absolute inset-0 w-full h-full overflow-hidden flex items-center justify-center z-0 pointer-events-none"
    >
      {/* ADDED overflow="visible" to prevent harsh edge clipping */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        overflow="visible"
      >
        <defs>
          <clipPath id="text-mask">
            <text
              x="50%"
              y="50%"
              dominantBaseline="middle"
              textAnchor="middle"
              className="font-black tracking-tighter"
              // REDUCED from 28vw to 22vw so the word fits on screen safely
              style={{ fontSize: "clamp(6rem, 22vw, 30rem)" }}
            >
              WIDE
            </text>
          </clipPath>
        </defs>
      </svg>

      <div
        className="absolute inset-0 w-full h-full"
        style={{
          clipPath: "url(#text-mask)",
          WebkitClipPath: "url(#text-mask)",
        }}
      >
        <div
          ref={imageRef}
          className="absolute w-full h-[130%] -top-[15%] will-change-transform"
        >
          <Image
            src="/assets/images/image_004.webp"
            alt="Wide Fashion Mask"
            fill
            priority
            className="object-cover"
          />
        </div>
      </div>

      <p className="absolute bottom-12 text-sm md:text-lg font-medium tracking-[0.3em] uppercase text-[#0a0a0a] dark:text-zinc-100">
        A Hypnotic Exploration
      </p>
    </section>
  );
}
