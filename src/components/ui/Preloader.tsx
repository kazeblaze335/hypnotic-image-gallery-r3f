"use client";

import { useEffect, useState, useRef } from "react";
import { useProgress } from "@react-three/drei";
import gsap from "gsap";
import { useStore } from "@/store/useStore";

export default function Preloader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const setIsLoading = useStore((state) => state.setIsLoading);
  const { progress } = useProgress();
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    let currentProgress = displayProgress;

    const updateProgress = () => {
      currentProgress += (progress - currentProgress) * 0.1;

      if (progress >= 100 && currentProgress >= 99.5) {
        setDisplayProgress(100);

        const tl = gsap.timeline({
          onComplete: () => {
            setIsLoading(false);
          },
        });

        tl.to(contentRef.current, {
          y: -30,
          opacity: 0,
          duration: 0.8,
          ease: "power3.inOut",
        }).to(
          containerRef.current,
          {
            yPercent: -100,
            duration: 1.2,
            ease: "expo.inOut",
          },
          "-=0.4",
        );
      } else {
        setDisplayProgress(Math.min(Math.round(currentProgress), 99));
        requestAnimationFrame(updateProgress);
      }
    };

    const animation = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(animation);
  }, [progress, displayProgress, setIsLoading]);

  return (
    <div
      ref={containerRef}
      // FIX: Removed bg-[#0a0a0a] and text-white.
      // Replaced with adaptive Tailwind classes to match your main app perfectly!
      className="fixed top-0 left-0 w-full h-[100dvh] m-0 p-0 z-[999] flex flex-col items-center justify-center bg-white dark:bg-black text-zinc-900 dark:text-zinc-100 font-sans pointer-events-auto"
    >
      <div
        ref={contentRef}
        className="flex flex-col items-center justify-center w-full px-8"
      >
        {/* PP Neue Montreal Number */}
        <div className="text-5xl md:text-7xl font-medium tracking-tight flex items-baseline mb-6 md:mb-8">
          {displayProgress.toString().padStart(3, "0")}
          <span className="text-2xl md:text-3xl ml-1 opacity-40">%</span>
        </div>

        {/* Razor-thin center-expanding progress bar */}
        {/* FIX: Adapted line colors for light/dark mode */}
        <div className="w-full max-w-xs md:max-w-md h-[1px] bg-zinc-200 dark:bg-white/10 relative overflow-hidden">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 h-full bg-zinc-900 dark:bg-white transition-all duration-75 ease-linear"
            style={{ width: `${displayProgress}%` }}
          />
        </div>

        {/* Minimalist Subtitle */}
        <div className="uppercase text-[9px] md:text-[10px] font-bold tracking-[0.4em] opacity-40 mt-6 md:mt-8">
          Initializing
        </div>
      </div>
    </div>
  );
}
