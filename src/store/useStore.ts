import { create } from "zustand";

interface AppState {
  activeLayout: string;
  previousLayout: string;
  setActiveLayout: (layout: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  activeProject: number; // Defaulting to 0 instead of null so Layout 4 always has an image!
  setActiveProject: (index: number) => void;
}

export const useStore = create<AppState>((set) => ({
  activeLayout: "layout-1-gallery",
  previousLayout: "layout-1-gallery",

  // When setting a new layout, save the current one as previous
  setActiveLayout: (layout) =>
    set((state) => ({
      previousLayout: state.activeLayout,
      activeLayout: layout,
    })),

  isLoading: true,
  setIsLoading: (loading) => set({ isLoading: loading }),

  activeProject: 0,
  setActiveProject: (index) => set({ activeProject: index }),
}));
