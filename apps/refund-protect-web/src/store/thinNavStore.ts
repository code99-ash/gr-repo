import { create } from "zustand";

interface ThinNavState {
    thinNav: boolean,
    toggleThinNav: () => void
}

export const useThinNavStore = create<ThinNavState>((set) => ({
    thinNav: false,
    toggleThinNav: () => set((state) => ({ thinNav: !state.thinNav }))
}))