"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
// Using the /dist/ path to avoid TypeScript casing errors
import { Flip } from "gsap/dist/Flip";
import { CustomEase } from "gsap/dist/CustomEase";

gsap.registerPlugin(Flip, CustomEase);

const images = Array.from(
  { length: 14 },
  (_, i) => `/assets/images/image_${String(i + 1).padStart(3, "0")}.webp`,
);

export default function FlipGallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const flipStateRef = useRef<Flip.FlipState | null>(null);

  const [activeLayout, setActiveLayout] = useState("layout-1-gallery");
  // NEW: State to manage the dropdown menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useGSAP(
    () => {
      CustomEase.create(
        "hop",
        "M0,0 C0.028,0.528 0.129,0.74 0.27,0.852 0.415,0.967 0.499,1 1,1",
      );
    },
    { scope: containerRef },
  );

  const handleLayoutChange = (layout: string) => {
    if (layout === activeLayout) return;
    flipStateRef.current = Flip.getState(".gallery-img");
    setActiveLayout(layout);
  };

  useGSAP(
    () => {
      if (!galleryRef.current || !flipStateRef.current) return;

      let staggerValue = activeLayout === "layout-2-gallery" ? 0 : 0.025;

      Flip.from(flipStateRef.current, {
        duration: 1.5,
        ease: "hop",
        stagger: staggerValue,
        absolute: true,
        scale: true,
      });

      flipStateRef.current = null;
    },
    { dependencies: [activeLayout], scope: containerRef },
  );

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full z-10 pointer-events-none"
    >
      {/* Navigation Layer - Rich Black, Monospace */}
      <nav className="fixed top-0 left-0 w-full p-8 flex justify-between z-[100] text-[#0a0a0a] dark:text-zinc-100 font-mono pointer-events-none">
        <div className="uppercase text-sm font-bold tracking-widest pointer-events-auto">
          Codegrid
        </div>

        <div className="flex space-x-12 pointer-events-auto">
          {["layout-1-gallery", "layout-2-gallery", "layout-3-gallery"].map(
            (layout, i) => (
              <button
                key={layout}
                onClick={() => handleLayoutChange(layout)}
                className={`uppercase text-sm font-bold tracking-widest transition-opacity duration-300 hover:opacity-80 ${
                  activeLayout === layout
                    ? "opacity-100 underline underline-offset-4"
                    : "opacity-40"
                }`}
              >
                0{i + 1}
              </button>
            ),
          )}
        </div>

        {/* NEW: Interactive Boutique Menu */}
        <div className="relative pointer-events-auto">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="uppercase text-sm font-bold tracking-widest hover:opacity-80 transition-opacity"
          >
            {isMenuOpen ? "Close" : "Menu"}
          </button>

          {/* The Dropdown Container */}
          <div
            className={`absolute top-full right-0 mt-6 w-48 bg-[#0a0a0a] dark:bg-white text-white dark:text-[#0a0a0a] p-6 shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] ${
              isMenuOpen
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-4 pointer-events-none"
            }`}
          >
            <ul className="flex flex-col space-y-4 text-xs tracking-widest uppercase">
              <li>
                <a href="#" className="hover:opacity-60 transition-opacity">
                  Works
                </a>
              </li>
              <li>
                <a href="#" className="hover:opacity-60 transition-opacity">
                  Studio
                </a>
              </li>
              <li>
                <a href="#" className="hover:opacity-60 transition-opacity">
                  Journal
                </a>
              </li>
              <li>
                <a href="#" className="hover:opacity-60 transition-opacity">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Gallery Layout Container */}
      <div className="w-full h-full relative pointer-events-auto pt-24">
        <div
          ref={galleryRef}
          className={`gallery ${activeLayout} w-full h-full`}
        >
          {images.map((src, index) => (
            <div
              key={src}
              id={`img${index + 1}`}
              className="gallery-img relative overflow-hidden will-change-transform rounded-sm shadow-xl"
            >
              <Image
                src={src}
                alt={`Gallery Image ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={index < 6}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
