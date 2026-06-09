import { create } from 'zustand';

export const useAppStore = create((set) => ({
  sidebarOpen: false,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  lastCalculator: null,
  setLastCalculator: (calc) => set({ lastCalculator: calc }),
}));