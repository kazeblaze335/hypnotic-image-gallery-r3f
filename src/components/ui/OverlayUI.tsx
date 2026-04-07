"use client";
import { useStore } from "@/store/useStore";

const projectData = [
  { title: "Redroom Gesture 14", category: "Concept Series", year: "2025" },
  { title: "Shadowwear 6AM", category: "Photography", year: "2024" },
  { title: "Blur Formation 03", category: "Kinetic Study", year: "2024" },
  { title: "Sunglass Operator", category: "Editorial Motion", year: "2023" },
  { title: "Azure Figure 5", category: "Visual Research", year: "2024" },
].concat(
  Array(9).fill({ title: "Unknown Study", category: "Archive", year: "2024" }),
);

export default function OverlayUI() {
  const { activeLayout, previousLayout, setActiveLayout, activeProject } =
    useStore();
  const currentData = projectData[activeProject] || projectData[0];
  const isLensMode = activeLayout === "layout-4-lens";

  return (
    <div style={{ width: "100%", height: "100%", pointerEvents: "none" }}>
      {/* --- TOP RIGHT MENU (Always Visible) --- */}
      <nav className="editorial-nav">
        {[
          "layout-1-gallery",
          "layout-2-gallery",
          "layout-3-gallery",
          "layout-4-lens",
        ].map((layout, i) => (
          <button
            key={layout}
            onClick={() => setActiveLayout(layout)}
            className={activeLayout === layout ? "active" : ""}
          >
            Layout {i + 1}
          </button>
        ))}
      </nav>

      {/* --- THE SLEEK MINIMAP BAR --- */}
      <div className={`lens-bar-container ${isLensMode ? "active" : ""}`}>
        {/* Left Typography */}
        <div className="lens-text-col">
          <span>{(activeProject + 1).toString().padStart(2, "0")}</span>
          <span>{currentData.category}</span>
        </div>

        {/* Right Typography */}
        <div className="lens-text-col right">
          <span>{currentData.title}</span>
          <span>{currentData.year}</span>
        </div>

        {/* Close Button */}
        <button
          className="btn-close"
          onClick={() => setActiveLayout(previousLayout)}
        >
          [ Close View ]
        </button>
      </div>
    </div>
  );
}
