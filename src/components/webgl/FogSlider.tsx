"use client";

import { useRef, useEffect } from "react";
import * as THREE from "three";
import { useFrame, useThree, extend } from "@react-three/fiber";
import { useTexture, shaderMaterial } from "@react-three/drei";
import { useStore } from "@/store/useStore";
import gsap from "gsap";

const FogSliderMaterial = shaderMaterial(
  {
    uTexture: new THREE.Texture(),
    uDistortion: 0,
    uScale: 1.0,
    uOpacity: 0.0, // Fade-in uniform
  },
  `
    uniform float uDistortion;
    uniform float uScale;
    varying vec2 vUv;
    void main() {
      vUv = uv;
      vec3 pos = position;
      pos.xy *= uScale;
      float bulge = sin(uv.x * 3.1415) * sin(uv.y * 3.1415);
      pos.z += bulge * uDistortion * 2.0; 
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  `
    uniform sampler2D uTexture;
    uniform float uDistortion;
    uniform float uOpacity;
    varying vec2 vUv;
    void main() {
      vec2 uv = vUv;
      uv.x += sin(uv.y * 10.0) * uDistortion * 0.03;
      vec4 texColor = texture2D(uTexture, uv);
      gl_FragColor = vec4(texColor.rgb, texColor.a * uOpacity);
    }
  `,
);

extend({ FogSliderMaterial });

// Sync to 14 images to perfectly match the DOM Flip gallery
const images = Array.from(
  { length: 14 },
  (_, i) => `/assets/images/image_${String(i + 1).padStart(3, "0")}.webp`,
);

export default function FogSlider() {
  const activeLayout = useStore((state) => state.activeLayout);

  const { viewport } = useThree();
  const materialRefs = useRef<any[]>([]);
  const groupRef = useRef<THREE.Group>(null);

  const textures = useTexture(images);

  const targetX = useRef(0);
  const currentX = useRef(0);
  const velocity = useRef(0);
  const opacityObj = useRef({ value: 0 });

  // Strict math to match the CSS exactly
  const margin = viewport.width * 0.05; // 5vw
  const meshWidth = viewport.width * 0.32; // 32vw
  const meshHeight = viewport.height * 0.65; // 65vh
  const totalWidth = (meshWidth + margin) * images.length;

  // Handle Fade In / Out
  useEffect(() => {
    if (activeLayout === "layout-3-gallery") {
      // Fade in WebGL slightly BEFORE the DOM fades out (1.0s vs 1.3s)
      gsap.to(opacityObj.current, { value: 1, duration: 0.3, delay: 1.0 });
    } else {
      // Hide instantly and reset scroll when switching layouts
      gsap.to(opacityObj.current, { value: 0, duration: 0.2 });

      // Reset position so it always hands off perfectly from the DOM
      targetX.current = 0;
      currentX.current = 0;
    }
  }, [activeLayout]);

  // Handle UNBOUNDED Wheel Scroll
  useEffect(() => {
    if (activeLayout !== "layout-3-gallery") return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      // Higher sensitivity makes it feel fast and fluid like the original
      const scrollSensitivity = 0.08;

      // NO CLAMPING! Let the targetX go to infinity and beyond
      targetX.current -= (e.deltaX + e.deltaY) * scrollSensitivity;
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [activeLayout]);

  useFrame(() => {
    if (!groupRef.current) return;

    // Smoothly lerp towards our infinite target
    currentX.current = THREE.MathUtils.lerp(
      currentX.current,
      targetX.current,
      0.08,
    );

    // Calculate velocity for the shaders and inertia
    const diff = (targetX.current - currentX.current) * 0.01;
    velocity.current = THREE.MathUtils.lerp(
      velocity.current,
      THREE.MathUtils.clamp(diff, -2, 2),
      0.1,
    );

    const scale = THREE.MathUtils.lerp(1, 0.88, Math.abs(velocity.current));
    const progress = currentX.current;

    groupRef.current.children.forEach((mesh: any, i) => {
      // 1. Calculate linear infinite position
      let x = i * (meshWidth + margin) + progress;

      // 2. The Infinite Modulo Wrap Magic
      let wrappedX = (x + totalWidth / 2) % totalWidth;
      if (wrappedX < 0) wrappedX += totalWidth;

      // 3. Center it on the screen
      const finalX = wrappedX - totalWidth / 2;
      mesh.position.x = finalX;

      // 4. Retain our cool 3D Physics Inertia
      mesh.rotation.y = velocity.current * -0.4; // Lean left/right based on speed
      mesh.rotation.x = velocity.current * 0.1; // Lean back slightly
      mesh.position.z = Math.abs(finalX) * -0.15; // Curve backward into the fog based on distance from center

      if (mesh.material) {
        mesh.material.uDistortion = velocity.current;
        mesh.material.uScale = scale;
        mesh.material.uOpacity = opacityObj.current.value;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {textures.map((tex, i) => (
        <mesh key={i}>
          <planeGeometry args={[meshWidth, meshHeight, 64, 64]} />
          {/* @ts-ignore */}
          <fogSliderMaterial
            ref={(el: any) => (materialRefs.current[i] = el)}
            uTexture={tex}
            transparent={true}
          />
        </mesh>
      ))}
    </group>
  );
}
