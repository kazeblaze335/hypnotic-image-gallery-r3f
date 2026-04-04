"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import FogSlider from "./FogSlider";

export default function GlobalCanvas() {
  return (
    <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <Suspense fallback={null}>
          {/* FogSlider will read directly from Zustand */}
          <FogSlider />
        </Suspense>
      </Canvas>
    </div>
  );
}
