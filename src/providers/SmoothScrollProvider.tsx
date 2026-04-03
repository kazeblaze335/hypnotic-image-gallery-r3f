"use client";

import { useEffect, useRef } from "react";
import Lenis from "@studio-freight/lenis";
import { useStore } from "@/store/useStore";

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);
  const setScrollProgress = useStore((state) => state.setScrollProgress);

  // 1. Pull the global loading state!
  const isLoading = useStore((state) => state.isLoading);

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    lenisRef.current = lenis;

    lenis.on("scroll", (e: any) => {
      setScrollProgress(e.progress);
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      cancelAnimationFrame(rafId);
    };
  }, [setScrollProgress]);

  // 2. The Lock Mechanism: Stop the scroll if the site is loading!
  useEffect(() => {
    if (!lenisRef.current) return;

    if (isLoading) {
      lenisRef.current.stop();
    } else {
      lenisRef.current.start();
    }
  }, [isLoading]);

  return <>{children}</>;
}
