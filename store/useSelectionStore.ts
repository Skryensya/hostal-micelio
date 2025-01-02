import { create } from 'zustand'

interface SelectionState {
  adults: number
  children: number
  setAdults: (adults: number) => void
  setChildren: (children: number) => void
}

export const useSelectionStore = create<SelectionState>((set) => ({
  adults: 1,
  children: 0,
  setAdults: (adults: number) => set({ adults }),
  setChildren: (children: number) => set({ children }),
}))
