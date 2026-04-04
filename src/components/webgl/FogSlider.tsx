"use client";

import { useRef, useEffect } from "react";
import * as THREE from "three";
import { useFrame, useThree, extend } from "@react-three/fiber";
import { useTexture, shaderMaterial } from "@react-three/drei";
import { useStore } from "@/store/useStore";

const FogSliderMaterial = shaderMaterial(
  {
    uTexture: new THREE.Texture(),
    uDistortion: 0,
    uScale: 1.0,
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
    varying vec2 vUv;
    void main() {
      vec2 uv = vUv;
      uv.x += sin(uv.y * 10.0) * uDistortion * 0.03;
      gl_FragColor = texture2D(uTexture, uv);
    }
  `,
);

extend({ FogSliderMaterial });

const images = [
  "/assets/images/image_001.webp",
  "/assets/images/image_002.webp",
  "/assets/images/image_003.webp",
  "/assets/images/image_004.webp",
  "/assets/images/image_005.webp",
  "/assets/images/image_006.webp",
];

export default function FogSlider() {
  // Connect to Zustand Store
  const activeLayout = useStore((state) => state.activeLayout);

  const { viewport } = useThree();
  const materialRefs = useRef<any[]>([]);
  const groupRef = useRef<THREE.Group>(null);

  const textures = useTexture(images);

  const targetX = useRef(0);
  const currentX = useRef(0);
  const velocity = useRef(0);

  const margin = 0.5;
  const meshWidth = viewport.width * 0.32;
  const meshHeight = viewport.height * 0.65;
  const totalWidth = (meshWidth + margin) * images.length;

  useEffect(() => {
    if (activeLayout !== "layout-3-gallery") return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const scrollSensitivity = 0.05;
      targetX.current -= (e.deltaX + e.deltaY) * scrollSensitivity;
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [activeLayout]);

  useFrame(() => {
    if (activeLayout !== "layout-3-gallery" || !groupRef.current) return;

    currentX.current = THREE.MathUtils.lerp(
      currentX.current,
      targetX.current,
      0.08,
    );
    const diff = (targetX.current - currentX.current) * 0.01;
    velocity.current = THREE.MathUtils.lerp(
      velocity.current,
      THREE.MathUtils.clamp(diff, -2, 2),
      0.1,
    );

    const scale = THREE.MathUtils.lerp(1, 0.88, Math.abs(velocity.current));
    const progress = currentX.current;

    groupRef.current.children.forEach((mesh: any, i) => {
      let x = i * (meshWidth + margin) + progress;
      let wrappedX = (x + totalWidth / 2) % totalWidth;
      if (wrappedX < 0) wrappedX += totalWidth;

      mesh.position.x = wrappedX - totalWidth / 2;

      if (mesh.material) {
        mesh.material.uDistortion = velocity.current;
        mesh.material.uScale = scale;
      }
    });
  });

  if (activeLayout !== "layout-3-gallery") return null;

  return (
    <group ref={groupRef}>
      {textures.map((tex, i) => (
        <mesh key={i}>
          <planeGeometry args={[meshWidth, meshHeight, 64, 64]} />
          {/* @ts-ignore */}
          <fogSliderMaterial
            ref={(el) => (materialRefs.current[i] = el)}
            uTexture={tex}
          />
        </mesh>
      ))}
    </group>
  );
}
