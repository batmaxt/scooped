import { create } from "zustand";

interface UIState {
  activeTab: "home" | "discover" | "search" | "alerts" | "profile";
  isBottomSheetOpen: boolean;
  setActiveTab: (tab: UIState["activeTab"]) => void;
  setBottomSheetOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  activeTab: "home",
  isBottomSheetOpen: false,
  setActiveTab: (tab) => set({ activeTab: tab }),
  setBottomSheetOpen: (open) => set({ isBottomSheetOpen: open }),
}));
