// i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import { useLanguageStore } from "./store/languageStore"; // Updated hook import

const resources = {
  en: {
    translation: {
      home: "Home",
      chatBot: "ChatBot",
      soilHealth: "Soil Health",
      marketStats: "Market Stats",
      forums: "Forums",
      profile: "Profile",
      settings: "Settings",
      language: "Language",
      english: "English",
      hindi: "Hindi",
      marathi: "Marathi",
      darkMode: "Dark Mode",
      notifications: "Notifications",
      about: "About",
      version: "Version",
      description:
        "This app helps farmers with market prices, soil info, and more.",
    },
  },
  hi: {
    translation: {
      home: "होम",
      chatBot: "चैटबॉट",
      soilHealth: "मिट्टी स्वास्थ्य",
      marketStats: "बाजार आंकड़े",
      forums: "फोरम",
      profile: "प्रोफ़ाइल",
      settings: "सेटिंग्स",
      language: "भाषा",
      english: "अंग्रेज़ी",
      hindi: "हिन्दी",
      marathi: "मराठी",
      darkMode: "डार्क मोड",
      notifications: "सूचनाएं",
      about: "जानकारी",
      version: "संस्करण",
      description:
        "यह ऐप किसानों को बाजार की कीमतें, मिट्टी की जानकारी और अधिक में मदद करता है।",
    },
  },
  ma: {
    translation: {
      home: "मुख्यपृष्ठ",
      chatBot: "चॅटबॉट",
      soilHealth: "माती आरोग्य",
      marketStats: "बाजार आकडेवारी",
      forums: "फोरम",
      profile: "प्रोफाइल",
      settings: "सेटिंग्ज",
      language: "भाषा",
      english: "इंग्रजी",
      hindi: "हिंदी",
      marathi: "मराठी",
      darkMode: "डार्क मोड",
      notifications: "सूचना",
      about: "बद्दल",
      version: "आवृत्ती",
      description:
        "हा अॅप शेतकऱ्यांना बाजारभाव, माती माहिती आणि बरेच काही मिळविण्यास मदत करतो.",
    },
  },
};

// Map store language values to i18n codes
function getLanguageCode(language: string): string {
  if (language === "hindi") return "hi";
  if (language === "marathi") return "ma";
  return "en"; // default English
}

// Initialize i18n
i18n.use(initReactI18next).init({
  resources,
  lng: Localization.getLocales()?.[0]?.languageCode ?? "en", // detect device language
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

// Subscribe to LanguageStore changes
useLanguageStore.subscribe((state) => {
  const code = getLanguageCode(state.language);
  i18n.changeLanguage(code);
});

export default i18n;
