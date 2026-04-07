"use client";
import { useEffect, useRef } from "react";
import { useStore } from "@/store/useStore"; // Hooking into your global state

const projectData = [
  {
    title: "Redroom Gesture 14",
    image: "/assets/images/image_001.webp",
    category: "Concept Series",
    year: "2025",
  },
  {
    title: "Shadowwear 6AM",
    image: "/assets/images/image_002.webp",
    category: "Photography",
    year: "2024",
  },
  {
    title: "Blur Formation 03",
    image: "/assets/images/image_003.webp",
    category: "Kinetic Study",
    year: "2024",
  },
  {
    title: "Sunglass Operator",
    image: "/assets/images/image_004.webp",
    category: "Editorial Motion",
    year: "2023",
  },
  {
    title: "Azure Figure 5",
    image: "/assets/images/image_005.webp",
    category: "Visual Research",
    year: "2024",
  },
];

export default function InfiniteMinimap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // Grab the specific DOM nodes
    const projectList = container.querySelector(".project-list");
    const minimapPreview = container.querySelector(".minimap-img-preview");
    const minimapInfo = container.querySelector(".minimap-info-list");
    if (!projectList || !minimapPreview || !minimapInfo) return;

    const config = {
      SCROLL_SPEED: 0.75,
      LERP_FACTOR: 0.05,
      BUFFER_SIZE: 5,
      MAX_VELOCITY: 150,
      SNAP_DURATION: 500,
    };

    const state = {
      currentY: 0,
      targetY: 0,
      isDragging: false,
      projects: new Map(),
      minimap: new Map(),
      minimapInfoMap: new Map(),
      projectHeight: window.innerHeight,
      minimapHeight: 250,
      isSnapping: false,
      snapStart: { time: 0, y: 0, target: 0 },
      lastScrollTime: Date.now(),
      dragStart: { y: 0, scrollY: 0 },
    };

    const lerp = (start: number, end: number, factor: number) =>
      start + (end - start) * factor;

    const createParallax = (img: HTMLImageElement | null, height: number) => {
      let current = 0;
      return {
        update: (scroll: number, index: number) => {
          if (!img) return;
          const target = (-scroll - index * height) * 0.2;
          current = lerp(current, target, 0.1);
          if (Math.abs(current - target) > 0.01) {
            img.style.transform = `translateY(${current}px) scale(1.5)`;
          }
        },
      };
    };

    const getProjectData = (index: number) => {
      const i =
        ((Math.abs(index) % projectData.length) + projectData.length) %
        projectData.length;
      return projectData[i];
    };

    const createElement = (
      index: number,
      type: "main" | "minimap" | "info",
    ) => {
      const maps = {
        main: state.projects,
        minimap: state.minimap,
        info: state.minimapInfoMap,
      };
      if (maps[type].has(index)) return;

      const data = getProjectData(index);
      const num = (
        (((Math.abs(index) % projectData.length) + projectData.length) %
          projectData.length) +
        1
      )
        .toString()
        .padStart(2, "0");

      if (type === "main") {
        const el = document.createElement("li");
        el.className = "project";
        el.innerHTML = `<img src="${data.image}" alt="${data.title}" />`;
        projectList.appendChild(el);
        state.projects.set(index, {
          el,
          parallax: createParallax(
            el.querySelector("img"),
            state.projectHeight,
          ),
        });
      } else if (type === "minimap") {
        const el = document.createElement("div");
        el.className = "minimap-img-item";
        el.innerHTML = `<img src="${data.image}" alt="${data.title}" />`;
        minimapPreview.appendChild(el);
        state.minimap.set(index, {
          el,
          parallax: createParallax(
            el.querySelector("img"),
            state.minimapHeight,
          ),
        });
      } else {
        const el = document.createElement("div");
        el.className = "minimap-item-info";
        el.innerHTML = `
          <div class="minimap-item-info-row"><p>${num}</p><p>${data.title}</p></div>
          <div class="minimap-item-info-row"><p>${data.category}</p><p>${data.year}</p></div>
        `;
        minimapInfo.appendChild(el);
        state.minimapInfoMap.set(index, { el });
      }
    };

    const syncElements = () => {
      const current = Math.round(-state.targetY / state.projectHeight);
      const min = current - config.BUFFER_SIZE;
      const max = current + config.BUFFER_SIZE;

      for (let i = min; i <= max; i++) {
        createElement(i, "main");
        createElement(i, "minimap");
        createElement(i, "info");
      }

      [state.projects, state.minimap, state.minimapInfoMap].forEach((map) => {
        map.forEach((item, index) => {
          if (index < min || index > max) {
            item.el.remove();
            map.delete(index);
          }
        });
      });
    };

    const snapToProject = () => {
      state.isSnapping = true;
      state.snapStart.time = Date.now();
      state.snapStart.y = state.targetY;
      state.snapStart.target =
        -Math.round(-state.targetY / state.projectHeight) * state.projectHeight;
    };

    const updateSnap = () => {
      const progress = Math.min(
        (Date.now() - state.snapStart.time) / config.SNAP_DURATION,
        1,
      );
      const eased = 1 - Math.pow(1 - progress, 3);
      state.targetY =
        state.snapStart.y +
        (state.snapStart.target - state.snapStart.y) * eased;
      if (progress >= 1) state.isSnapping = false;
    };

    const updatePositions = () => {
      const minimapY =
        (state.currentY * state.minimapHeight) / state.projectHeight;

      state.projects.forEach((item, index) => {
        const y = index * state.projectHeight + state.currentY;
        item.el.style.transform = `translateY(${y}px)`;
        item.parallax.update(state.currentY, index);
      });

      state.minimap.forEach((item, index) => {
        const y = index * state.minimapHeight + minimapY;
        item.el.style.transform = `translateY(${y}px)`;
        item.parallax.update(minimapY, index);
      });

      state.minimapInfoMap.forEach((item, index) => {
        item.el.style.transform = `translateY(${index * state.minimapHeight + minimapY}px)`;
      });
    };

    const animate = () => {
      const now = Date.now();
      if (
        !state.isSnapping &&
        !state.isDragging &&
        now - state.lastScrollTime > 100
      ) {
        const snapPoint =
          -Math.round(-state.targetY / state.projectHeight) *
          state.projectHeight;
        if (Math.abs(state.targetY - snapPoint) > 1) snapToProject();
      }

      if (state.isSnapping) updateSnap();
      if (!state.isDragging)
        state.currentY += (state.targetY - state.currentY) * config.LERP_FACTOR;

      syncElements();
      updatePositions();
      animationRef.current = requestAnimationFrame(animate);
    };

    // Event Listeners scoped to window
    const handleWheel = (e: WheelEvent) => {
      state.isSnapping = false;
      state.lastScrollTime = Date.now();
      const delta = Math.max(
        Math.min(e.deltaY * config.SCROLL_SPEED, config.MAX_VELOCITY),
        -config.MAX_VELOCITY,
      );
      state.targetY -= delta;
    };

    const handleTouchStart = (e: TouchEvent) => {
      state.isDragging = true;
      state.isSnapping = false;
      state.dragStart = { y: e.touches[0].clientY, scrollY: state.targetY };
      state.lastScrollTime = Date.now();
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!state.isDragging) return;
      state.targetY =
        state.dragStart.scrollY +
        (e.touches[0].clientY - state.dragStart.y) * 1.5;
      state.lastScrollTime = Date.now();
    };

    const handleTouchEnd = () => (state.isDragging = false);

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);

    // Initializer
    for (let i = -config.BUFFER_SIZE; i <= config.BUFFER_SIZE; i++) {
      createElement(i, "main");
      createElement(i, "minimap");
      createElement(i, "info");
    }
    animate();

    // Cleanup loop and listeners on unmount
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  return (
    <div className="minimap-container" ref={containerRef}>
      <ul className="project-list"></ul>
      <div className="minimap">
        <div className="minimap-wrapper">
          <div className="minimap-img-preview"></div>
          <div className="minimap-info-list"></div>
        </div>
      </div>
    </div>
  );
}
