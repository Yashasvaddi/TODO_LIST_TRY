import { create } from "zustand";

interface LanguageState {
    language: string,
    setLanguage: (language: string) => void
}

export const LanguageStore = create<LanguageState>((set) => ({
    language: "english",
    setLanguage: (language) => set({ language })
}))