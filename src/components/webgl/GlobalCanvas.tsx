"use client";
import { Canvas } from "@react-three/fiber";
import UnifiedScene from "./UnifiedScene";

export default function GlobalCanvas() {
  return (
    // The wrapper MUST be absolute inset-0
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        gl={{ alpha: true, antialias: true }} // alpha: true allows the DOM sandwich to work!
        camera={{ position: [0, 0, 5], fov: 45 }}
        style={{
          width: "100vw",
          height: "100vh",
          background: "transparent",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        <UnifiedScene />
      </Canvas>
    </div>
  );
}
