"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface HardwareParallaxProps {
  children: React.ReactNode;
  multiplier?: number;
  className?: string;
}

export default function HardwareParallax({
  children,
  multiplier = 15,
  className = "",
}: HardwareParallaxProps) {
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!targetRef.current) return;

      // Calculate pan coordinates based on mouse position relative to the center
      const x = (e.clientX / window.innerWidth - 0.5) * multiplier;
      const y = (e.clientY / window.innerHeight - 0.5) * multiplier;

      gsap.to(targetRef.current, {
        xPercent: x,
        yPercent: y,
        duration: 1.5,
        ease: "power2.out",
        force3D: true, // Forces GPU acceleration
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [multiplier]);

  return (
    <div ref={targetRef} className={`will-change-transform ${className}`}>
      {children}
    </div>
  );
}
