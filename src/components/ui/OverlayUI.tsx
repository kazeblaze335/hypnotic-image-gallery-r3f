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
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        pointerEvents: "none",
      }}
    >
      {/* --- TOP RIGHT MENU --- */}
      <nav
        style={{
          position: "fixed",
          top: "2.5rem",
          right: "3rem",
          zIndex: 9999,
          display: "flex",
          gap: "2rem",
          pointerEvents: "auto",
        }}
      >
        {[
          "layout-1-gallery",
          "layout-2-gallery",
          "layout-3-gallery",
          "layout-4-lens",
        ].map((layout, i) => (
          <button
            key={layout}
            onClick={() => setActiveLayout(layout)}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: 0,
              color: activeLayout === layout ? "#000" : "rgba(0, 0, 0, 0.4)",
              textDecoration: activeLayout === layout ? "underline" : "none",
              textUnderlineOffset: "6px",
              textDecorationThickness: "2px",
              fontSize: "11px",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              transition: "color 0.3s ease",
            }}
          >
            Layout {i + 1}
          </button>
        ))}
      </nav>

      {/* --- MINIMAP TYPOGRAPHY (Locks to the Z-10 Mask exactly) --- */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "85vw",
          height: "40vh",
          display: "flex",
          justifyContent: "space-between",
          opacity: isLensMode ? 1 : 0,
          transition: "opacity 0.7s ease",
          pointerEvents: "none",
        }}
      >
        {/* Left Column */}
        <div
          style={{
            width: "32.5%",
            padding: "2.5rem 3rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            color: "#000",
            fontSize: "11px",
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}
        >
          <span>{(activeProject + 1).toString().padStart(2, "0")}</span>
          <span>{currentData.category}</span>
        </div>

        {/* Center Void / Close Button */}
        <div style={{ width: "35%", position: "relative" }}>
          <button
            onClick={() => setActiveLayout(previousLayout)}
            style={{
              position: "absolute",
              bottom: "-3rem",
              left: "50%",
              transform: "translateX(-50%)",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              pointerEvents: isLensMode ? "auto" : "none",
              color: "rgba(0, 0, 0, 0.5)",
              fontSize: "10px",
              fontWeight: "bold",
              textTransform: "uppercase",
              letterSpacing: "0.3em",
            }}
          >
            [ Close View ]
          </button>
        </div>

        {/* Right Column */}
        <div
          style={{
            width: "32.5%",
            padding: "2.5rem 3rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            textAlign: "right",
            color: "#000",
            fontSize: "11px",
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}
        >
          <span>{currentData.title}</span>
          <span>{currentData.year}</span>
        </div>
      </div>
    </div>
  );
}
