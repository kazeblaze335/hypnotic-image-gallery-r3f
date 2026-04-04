"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { CustomEase } from "gsap/dist/CustomEase";

gsap.registerPlugin(CustomEase);

export default function MaskedHero({ activeLayout }: { activeLayout: string }) {
  const containerRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  // 1. Setup the Mouse Parallax (Since we have no scrolling anymore)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 15; // Pan range
      const y = (e.clientY / window.innerHeight - 0.5) * 15;

      gsap.to(imageRef.current, {
        xPercent: x,
        yPercent: y,
        duration: 1.5,
        ease: "power2.out",
        force3D: true,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // 2. Animate the SVG Letters based on the layout state
  useGSAP(() => {
    CustomEase.create(
      "hop",
      "M0,0 C0.028,0.528 0.129,0.74 0.27,0.852 0.415,0.967 0.499,1 1,1",
    );
    const isVertical = activeLayout === "layout-2-gallery";

    // Define target coordinates for each letter
    const targets = [
      { x: isVertical ? "15%" : "22%", y: isVertical ? "20%" : "50%" }, // W
      { x: isVertical ? "15%" : "42%", y: isVertical ? "40%" : "50%" }, // I
      { x: isVertical ? "15%" : "58%", y: isVertical ? "60%" : "50%" }, // D
      { x: isVertical ? "15%" : "78%", y: isVertical ? "80%" : "50%" }, // E
    ];

    const letters = gsap.utils.toArray(".mask-letter");

    letters.forEach((letter: any, i) => {
      gsap.to(letter, {
        attr: { x: targets[i].x, y: targets[i].y },
        // Shrink the font size slightly when vertically stacked
        fontSize: isVertical
          ? "clamp(4rem, 10vw, 15rem)"
          : "clamp(6rem, 22vw, 30rem)",
        duration: 1.5,
        ease: "hop",
        delay: isVertical ? i * 0.05 : 0, // Slight stagger effect
      });
    });
  }, [activeLayout]);

  return (
    <section
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden flex items-center justify-center z-0 pointer-events-none"
    >
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        overflow="visible"
      >
        <defs>
          <clipPath id="text-mask">
            {/* Split letters so they can be independently animated */}
            <text
              className="mask-letter font-black tracking-tighter"
              dy=".35em"
              textAnchor="middle"
              x="22%"
              y="50%"
            >
              W
            </text>
            <text
              className="mask-letter font-black tracking-tighter"
              dy=".35em"
              textAnchor="middle"
              x="42%"
              y="50%"
            >
              I
            </text>
            <text
              className="mask-letter font-black tracking-tighter"
              dy=".35em"
              textAnchor="middle"
              x="58%"
              y="50%"
            >
              D
            </text>
            <text
              className="mask-letter font-black tracking-tighter"
              dy=".35em"
              textAnchor="middle"
              x="78%"
              y="50%"
            >
              E
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
          className="absolute w-[110%] h-[110%] -top-[5%] -left-[5%] will-change-transform"
        >
          <Image
            src="/assets/images/image_014.webp"
            alt="Wide Mask"
            fill
            priority
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
