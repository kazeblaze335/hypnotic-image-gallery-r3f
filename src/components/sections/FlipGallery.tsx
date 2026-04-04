"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Flip } from "gsap/dist/Flip";
import { CustomEase } from "gsap/dist/CustomEase";

gsap.registerPlugin(Flip, CustomEase);

const images = Array.from(
  { length: 14 },
  (_, i) => `/assets/images/image_${String(i + 1).padStart(3, "0")}.webp`,
);

interface FlipGalleryProps {
  activeLayout: string;
  setActiveLayout: (layout: string) => void;
}

export default function FlipGallery({
  activeLayout,
  setActiveLayout,
}: FlipGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const flipStateRef = useRef<Flip.FlipState | null>(null);
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
    setIsMenuOpen(false); // Auto-close menu
  };

  useGSAP(() => {
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
  }, [activeLayout]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full z-10 pointer-events-none"
    >
      {/* Centered Boutique Menu */}
      <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center font-sans pointer-events-none">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="pointer-events-auto bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-3 rounded-full uppercase text-[10px] font-bold tracking-[0.3em] hover:bg-white/20 transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.2)]"
        >
          {isMenuOpen ? "Close" : "Menu"}
        </button>

        <div
          className={`pointer-events-auto mt-4 w-64 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] ${isMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"}`}
        >
          <div className="flex flex-col space-y-6 text-[10px] font-bold tracking-[0.3em] uppercase text-white text-center">
            <div className="text-white/40 pb-4 border-b border-white/10">
              Views
            </div>

            {["layout-1-gallery", "layout-2-gallery", "layout-3-gallery"].map(
              (layout, i) => (
                <button
                  key={layout}
                  onClick={() => handleLayoutChange(layout)}
                  className={`transition-all duration-300 hover:opacity-100 ${activeLayout === layout ? "opacity-100 text-[#CCFF00]" : "opacity-40"}`}
                >
                  Layout 0{i + 1}
                </button>
              ),
            )}

            <div className="text-white/40 pt-4 pb-4 border-b border-t border-white/10 mt-4">
              Studio
            </div>
            <a href="#" className="hover:opacity-60 transition-opacity">
              Journal
            </a>
            <a href="#" className="hover:opacity-60 transition-opacity">
              Contact
            </a>
          </div>
        </div>
      </nav>

      {/* Gallery Grid */}
      <div className="w-full h-full relative pointer-events-auto pt-24">
        <div
          ref={galleryRef}
          className={`gallery ${activeLayout} w-full h-full`}
        >
          {images.map((src, index) => (
            <div
              key={src}
              id={`img${index + 1}`}
              className="gallery-img relative overflow-hidden will-change-transform rounded-sm shadow-2xl"
            >
              <Image
                src={src}
                alt={`Image ${index + 1}`}
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
