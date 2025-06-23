import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DateRange } from "react-day-picker";
import { RoomOption } from "@/lib/types";

// const FIFTEEN_MINUTES = 15 * 60 * 1000; // 15 minutes in milliseconds
const FIVE_MINUTES = 5 * 60 * 1000; // 15 seconds in milliseconds

interface SelectionState {
  adults: number;
  children: number;
  dateRange: DateRange | undefined;
  selectedFormat: RoomOption | null;
  setAdults: (value: string | number) => void;
  setChildren: (value: string | number) => void;
  setDateRange: (range: DateRange | undefined) => void;
  setSelectedFormat: (format: RoomOption | null) => void;
  clearSelectedFormat: () => void;
  incrementChildren: () => void;
  decrementChildren: () => void;
  decrementAdults: () => void;
  incrementAdults: () => void;
  selectedTab: "hospedaje" | "larga-estadia";
  setSelectedTab: (tab: "hospedaje" | "larga-estadia") => void;
}

const customStorage = {
  getItem: (key: string) => {
    const item = localStorage.getItem(key);
    if (!item) return null;

    try {
      const data = JSON.parse(item);
      const now = Date.now();

      if (now - data.timestamp > FIVE_MINUTES) {
        // State is expired
        localStorage.removeItem(key);
        return null;
      }

      return data.state;
    } catch {
      localStorage.removeItem(key);
      return null;
    }
  },
  setItem: (key: string, value: unknown) => {
    const data = { state: value, timestamp: Date.now() };
    localStorage.setItem(key, JSON.stringify(data));
  },
  removeItem: (key: string) => {
    localStorage.removeItem(key);
  },
};

export const useSelectionStore = create<SelectionState>()(
  persist(
    (set) => ({
      adults: 1,
      children: 0,
      dateRange: undefined,
      selectedTab: "hospedaje",
      selectedFormat: null,
      setSelectedTab: (tab: "hospedaje" | "larga-estadia") =>
        set({ selectedTab: tab }),
      setAdults: (value) => {
        const newValue =
          typeof value === "string" ? parseInt(value || "1", 10) : value;
        set({ adults: Math.max(1, newValue) });
      },
      setChildren: (value) => {
        const newValue =
          typeof value === "string" ? parseInt(value || "0", 10) : value;
        set({ children: Math.max(0, newValue) });
      },
      setDateRange: (range) => set({ dateRange: range }),
      setSelectedFormat: (format) => set({ selectedFormat: format }),
      clearSelectedFormat: () => set({ selectedFormat: null }),
      incrementChildren: () =>
        set((state) => ({ children: state.children + 1 })),
      decrementChildren: () =>
        set((state) => ({ children: Math.max(0, state.children - 1) })),
      decrementAdults: () =>
        set((state) => ({ adults: Math.max(1, state.adults - 1) })),
      incrementAdults: () => set((state) => ({ adults: state.adults + 1 })),
    }),
    {
      name: "selection-storage",
      storage: customStorage,
    },
  ),
);
