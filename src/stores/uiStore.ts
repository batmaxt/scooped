import { create } from "zustand";

interface UIState {
  activeTab: "discover" | "feed" | "checkin" | "profile";
  isBottomSheetOpen: boolean;
  setActiveTab: (tab: UIState["activeTab"]) => void;
  setBottomSheetOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  activeTab: "discover",
  isBottomSheetOpen: false,
  setActiveTab: (tab) => set({ activeTab: tab }),
  setBottomSheetOpen: (open) => set({ isBottomSheetOpen: open }),
}));
