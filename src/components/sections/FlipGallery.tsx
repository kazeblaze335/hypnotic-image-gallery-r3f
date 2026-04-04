"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Flip } from "gsap/dist/Flip";
import { CustomEase } from "gsap/dist/CustomEase";
import { useStore } from "@/store/useStore";

gsap.registerPlugin(Flip, CustomEase);

const images = Array.from(
  { length: 14 },
  (_, i) => `/assets/images/image_${String(i + 1).padStart(3, "0")}.webp`,
);

export default function FlipGallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const flipStateRef = useRef<Flip.FlipState | null>(null);

  // Connect to Zustand Store
  const { activeLayout, setActiveLayout } = useStore();

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

    // Fade out DOM images if Layout 3 (WebGL Slider) is active
    gsap.to(".gallery-img", {
      opacity: activeLayout === "layout-3-gallery" ? 0 : 1,
      duration: 0.5,
      ease: "power2.inOut",
    });
  }, [activeLayout]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full z-10 pointer-events-none"
    >
      <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] flex space-x-8 md:space-x-16 font-sans mix-blend-difference pointer-events-none">
        {["layout-1-gallery", "layout-2-gallery", "layout-3-gallery"].map(
          (layout, i) => (
            <button
              key={layout}
              onClick={() => handleLayoutChange(layout)}
              className={`pointer-events-auto uppercase text-[10px] md:text-xs font-bold tracking-[0.3em] transition-all duration-300 ${
                activeLayout === layout
                  ? "text-white opacity-100 underline underline-offset-8 decoration-2"
                  : "text-white opacity-50 hover:opacity-100"
              }`}
            >
              Layout {i + 1}
            </button>
          ),
        )}
      </nav>

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
