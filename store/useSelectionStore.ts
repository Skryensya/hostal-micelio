import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { DateRange } from "react-day-picker";

interface SelectionState {
  adults: number;
  children: number;
  dateRange: DateRange | undefined;
  setAdults: (adults: number) => void;
  setChildren: (children: number) => void;
  setDateRange: (range: DateRange | undefined) => void;
  incrementChildren: () => void;
  decrementChildren: () => void;
  decrementAdults: () => void;
  incrementAdults: () => void;
}

export const useSelectionStore = create<SelectionState>()(
  persist(
    (set) => ({
      adults: 1,
      children: 0,
      dateRange: undefined,
      setAdults: (adults: number) => set({ adults }),
      setChildren: (children: number) => set({ children }),
      setDateRange: (range) => set({ dateRange: range }),
      incrementChildren: () =>
        set((state) => ({ children: state.children + 1 })),
      decrementChildren: () =>
        set((state) => ({ children: Math.max(0, state.children - 1) })),
      decrementAdults: () =>
        set((state) => ({ adults: Math.max(1, state.adults - 1) })),
      incrementAdults: () => set((state) => ({ adults: state.adults + 1 })),
    }),
    {
      name: "selection-storage", // unique name for the storage
      storage: createJSONStorage(() => localStorage),
    }
  )
);
