"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { CustomEase } from "gsap/CustomEase";

// Register GSAP Plugins
gsap.registerPlugin(Flip, CustomEase);

// Generate array of 14 images based on your asset paths
const images = Array.from(
  { length: 14 },
  (_, i) => `/assets/images/img${i + 1}.jpg`,
);

export default function FlipGallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  // Track our current layout mode
  const [activeLayout, setActiveLayout] = useState("layout-1-gallery");

  // 1. Initialize our custom "hop" ease once
  useGSAP(
    () => {
      CustomEase.create(
        "hop",
        "M0,0 C0.028,0.528 0.129,0.74 0.27,0.852 0.415,0.967 0.499,1 1,1",
      );
    },
    { scope: containerRef },
  );

  // 2. The Flip Magic
  useGSAP(
    () => {
      if (!galleryRef.current) return;

      // Grab all our image wrappers
      const items = gsap.utils.toArray(".gallery-img") as HTMLElement[];

      // Capture the current positions BEFORE the layout class changes them
      const state = Flip.getState(items);

      // Because this hook runs *after* activeLayout changes and React re-renders,
      // the DOM elements are now in their new layout positions.
      // We tell Flip to animate them FROM their old saved state to their new current state.

      let staggerValue = 0.025;
      // Remove stagger if moving TO layout 2 (based on your original script logic)
      if (activeLayout === "layout-2-gallery") {
        staggerValue = 0;
      }

      Flip.from(state, {
        duration: 1.5,
        ease: "hop",
        stagger: staggerValue,
        absolute: true, // Required so they don't jump around during the transition
        scale: true,
      });
    },
    { dependencies: [activeLayout], scope: containerRef },
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-screen pt-24 bg-zinc-100 dark:bg-zinc-950 transition-colors duration-500"
    >
      {/* Navigation (Mimicking your HTML Nav) */}
      <nav className="absolute top-0 left-0 w-full p-6 flex justify-between z-50 text-zinc-900 dark:text-zinc-100 mix-blend-difference">
        <div className="uppercase text-sm font-bold tracking-widest">
          Codegrid
        </div>
        <div className="flex space-x-12">
          {["layout-1-gallery", "layout-2-gallery", "layout-3-gallery"].map(
            (layout, i) => (
              <button
                key={layout}
                onClick={() => setActiveLayout(layout)}
                className={`uppercase text-sm font-bold tracking-widest transition-opacity duration-300 ${
                  activeLayout === layout
                    ? "opacity-100 underline underline-offset-4"
                    : "opacity-40 hover:opacity-80"
                }`}
              >
                0{i + 1}
              </button>
            ),
          )}
        </div>
        <div className="uppercase text-sm font-bold tracking-widest">Menu</div>
      </nav>

      {/* Gallery Layout Container */}
      <div className="w-full h-full relative">
        <div
          ref={galleryRef}
          className={`gallery ${activeLayout} w-full h-[80vh]`}
        >
          {images.map((src, index) => (
            <div
              key={src}
              // We pass the index ID to match your CSS coordinates (e.g., #img1, #img2)
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
