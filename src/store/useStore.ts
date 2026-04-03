import { create } from "zustand";

interface AppState {
  // 1. Lenis Scroll State
  // This tracks how far down the page the user has scrolled (0 to 1)
  scrollProgress: number;
  setScrollProgress: (progress: number) => void;

  // 2. Global Loading State
  // We will use this later for the Phase 4 Asset Preloader
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
  // Initialize scroll at the very top
  scrollProgress: 0,
  setScrollProgress: (progress) => set({ scrollProgress: progress }),

  // Initialize loading as true so the site stays hidden until assets parse
  isLoading: true,
  setIsLoading: (loading) => set({ isLoading: loading }),
}));
