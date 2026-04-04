"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { CustomEase } from "gsap/dist/CustomEase";
import { useStore } from "@/store/useStore";
import HardwareParallax from "@/components/motion/HardwareParallax";

gsap.registerPlugin(CustomEase);

export default function MaskedHero() {
  const containerRef = useRef<HTMLElement>(null);

  // Connect to Zustand Store
  const activeLayout = useStore((state) => state.activeLayout);

  useGSAP(() => {
    CustomEase.create(
      "hop",
      "M0,0 C0.028,0.528 0.129,0.74 0.27,0.852 0.415,0.967 0.499,1 1,1",
    );
    const isVertical = activeLayout === "layout-2-gallery";
    const isSlider = activeLayout === "layout-3-gallery";

    const targets = [
      {
        x: isVertical ? "15%" : isSlider ? "35%" : "22%",
        y: isVertical ? "20%" : isSlider ? "15%" : "50%",
      }, // W
      {
        x: isVertical ? "15%" : isSlider ? "45%" : "42%",
        y: isVertical ? "40%" : isSlider ? "15%" : "50%",
      }, // I
      {
        x: isVertical ? "15%" : isSlider ? "55%" : "58%",
        y: isVertical ? "60%" : isSlider ? "15%" : "50%",
      }, // D
      {
        x: isVertical ? "15%" : isSlider ? "65%" : "78%",
        y: isVertical ? "80%" : isSlider ? "15%" : "50%",
      }, // E
    ];

    const letters = gsap.utils.toArray(".mask-letter");

    letters.forEach((letter: any, i) => {
      gsap.to(letter, {
        attr: { x: targets[i].x, y: targets[i].y },
        fontSize: isVertical
          ? "clamp(4rem, 10vw, 15rem)"
          : isSlider
            ? "clamp(2rem, 6vw, 8rem)"
            : "clamp(6rem, 22vw, 30rem)",
        duration: 1.5,
        ease: "hop",
        delay: isVertical ? i * 0.05 : 0,
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
        {/* Implement Reusable Hardware Parallax */}
        <HardwareParallax
          multiplier={15}
          className="absolute w-[110%] h-[110%] -top-[5%] -left-[5%]"
        >
          <Image
            src="/assets/images/image_004.webp"
            alt="Wide Mask"
            fill
            priority
            className="object-cover"
          />
        </HardwareParallax>
      </div>
    </section>
  );
}
