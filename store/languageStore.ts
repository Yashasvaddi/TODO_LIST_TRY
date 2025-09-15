import { create } from "zustand";
import * as Localization from 'expo-localization';

interface LanguageState {
  language: string;
  setLanguage: (language: string) => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  language: Localization.getLocales()?.[0]?.languageCode ?? "en", // auto-detect device language
  setLanguage: (language) => set({ language }),
}));
