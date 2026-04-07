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
      <div className="fixed inset-0 z-50 pointer-events-none">
        <FilmGrain />
      </div>

      {/* Changed background to a light editorial gray (#e5e5e5) so white boxes and black text are visible! */}
      <main className="fixed inset-0 w-full h-screen overflow-hidden bg-[#e5e5e5] transition-opacity duration-1000">
        <MaskedHero />

        {/* Z-0: Blurred Backgrounds */}
        <div className="absolute inset-0 z-0">
          <DetailBackground />
        </div>

        {/* Z-10: THE WHITE MINIMAP BOX */}
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] md:w-[75%] h-[50vh] bg-white z-10 shadow-2xl transition-all duration-700 ${isLensMode ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}
        />

        {/* Z-20: Transparent WebGL Canvas */}
        <div className="absolute inset-0 z-20 pointer-events-auto">
          <GlobalCanvas />
        </div>

        {/* Z-30: UI Text & Menus */}
        <div className="absolute inset-0 z-30 pointer-events-none">
          <OverlayUI />
        </div>
      </main>
    </>
  );
}
