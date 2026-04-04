import { create } from "zustand";

interface AppState {
  activeLayout: string;
  setActiveLayout: (layout: string) => void;
}

export const useStore = create<AppState>((set) => ({
  activeLayout: "layout-1-gallery", // Default layout
  setActiveLayout: (layout) => set({ activeLayout: layout }),
}));
