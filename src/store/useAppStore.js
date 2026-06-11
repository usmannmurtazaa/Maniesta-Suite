/**
 * Zustand application store.
 *
 * ⚠️ Currently minimal – holds global sidebar toggle and last calculator used.
 *    The sidebar toggle may duplicate local state in DashboardLayout / Header.
 *    Verify usage before adding more global state here.
 */
import { create } from 'zustand';

export const useAppStore = create((set) => ({
  sidebarOpen: false,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  lastCalculator: null,
  setLastCalculator: (calc) => set({ lastCalculator: calc }),
}));