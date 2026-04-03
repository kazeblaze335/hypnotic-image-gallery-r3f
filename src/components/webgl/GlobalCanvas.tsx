"use client";

import { Canvas } from "@react-three/fiber";
import { Preload } from "@react-three/drei";
import { tunnel } from "@/providers/TunnelProvider";

export default function GlobalCanvas() {
  return (
    <div className="fixed inset-0 z-[40] pointer-events-none">
      <Canvas
        // FIX: Force the actual <canvas> element to ignore all mouse events!
        style={{ pointerEvents: "none" }}
        dpr={[1, 1.5]}
        gl={{
          antialias: false,
          powerPreference: "high-performance",
          alpha: true,
        }}
        camera={{ position: [0, 0, 5], fov: 75 }}
        frameloop="always"
      >
        <tunnel.Out />
        <Preload all />
      </Canvas>
    </div>
  );
}
