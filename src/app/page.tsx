"use client";
import FilmGrain from "@/components/ui/FilmGrain";
import MaskedHero from "@/components/sections/MaskedHero";
import GlobalCanvas from "@/components/webgl/GlobalCanvas";
import OverlayUI from "@/components/ui/OverlayUI";
import DetailBackground from "@/components/ui/DetailBackground";
import { useStore } from "@/store/useStore";

export default function Home() {
  const { isLoading, activeLayout } = useStore();
  const isLensMode = activeLayout === "layout-4-lens";

  return (
    <>
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 50,
          pointerEvents: "none",
        }}
      >
        <FilmGrain />
      </div>

      <main
        style={{
          position: "fixed",
          inset: 0,
          width: "100%",
          height: "100vh",
          overflow: "hidden",
          backgroundColor: "#e5e5e5",
        }}
      >
        {/* HIDE THE "WIDE" TEXT IN LAYOUT 4 */}
        <div
          style={{
            opacity: isLensMode ? 0 : 1,
            transition: "opacity 0.7s ease",
            pointerEvents: isLensMode ? "none" : "auto",
          }}
        >
          <MaskedHero />
        </div>

        {/* Z-0: Background Images */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <DetailBackground />
        </div>

        {/* Z-10: THE INDEPENDENT WHITE MASK (Inline Styles = No Collisions!) */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "85vw",
            height: "40vh",
            display: "flex",
            zIndex: 10,
            pointerEvents: "none",
            opacity: isLensMode ? 1 : 0,
            transition: "opacity 0.7s ease",
          }}
        >
          {/* Left Solid Wall */}
          <div
            style={{
              width: "32.5%",
              height: "100%",
              backgroundColor: "#ffffff",
              boxShadow: "20px 0 40px rgba(0,0,0,0.05)",
            }}
          />
          {/* Center Transparent Hole */}
          <div
            style={{
              width: "35%",
              height: "100%",
              backgroundColor: "transparent",
            }}
          />
          {/* Right Solid Wall */}
          <div
            style={{
              width: "32.5%",
              height: "100%",
              backgroundColor: "#ffffff",
              boxShadow: "-20px 0 40px rgba(0,0,0,0.05)",
            }}
          />
        </div>

        {/* Z-20: WebGL Canvas */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 20,
            pointerEvents: "auto",
          }}
        >
          <GlobalCanvas />
        </div>

        {/* Z-30: UI Text & Menus */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 30,
            pointerEvents: "none",
          }}
        >
          <OverlayUI />
        </div>
      </main>
    </>
  );
}
