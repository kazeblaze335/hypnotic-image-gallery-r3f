"use client";
import { useStore } from "@/store/useStore";

const images = Array.from(
  { length: 14 },
  (_, i) => `/assets/images/image_${String(i + 1).padStart(3, "0")}.webp`,
);

export default function DetailBackground() {
  const { activeLayout, activeProject } = useStore();
  const isLensMode = activeLayout === "layout-4-lens";

  return (
    <div
      className={`absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-700 ease-in-out z-0 ${isLensMode ? "opacity-100" : "opacity-0"}`}
    >
      {/* LAYER 1: Full-screen blurred background */}
      <img
        src={images[activeProject]}
        alt="Background Blur"
        className="absolute inset-0 w-full h-full object-cover scale-110 blur-[40px] brightness-75 transition-all duration-700"
      />

      {/* LAYER 2: The solid white horizontal box */}
      <div className="absolute top-1/2 left-0 w-full h-[45vh] md:h-[50vh] -translate-y-1/2 bg-white z-10 shadow-2xl" />
    </div>
  );
}
