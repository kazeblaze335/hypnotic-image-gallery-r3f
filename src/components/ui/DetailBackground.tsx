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
      className={`absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden ${isLensMode ? "opacity-100" : "opacity-0"}`}
    >
      {images.map((src, i) => {
        let offset = "100%";
        if (i === activeProject) offset = "0%";
        else if (i < activeProject) offset = "-100%";

        if (activeProject === 0 && i === images.length - 1) offset = "-100%";
        if (activeProject === images.length - 1 && i === 0) offset = "100%";

        return (
          <img
            key={src}
            src={src}
            alt="Background"
            // Rendered at native clarity without blur filters
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[600ms] ease-out"
            style={{ transform: `translateY(${offset})` }}
          />
        );
      })}
    </div>
  );
}
