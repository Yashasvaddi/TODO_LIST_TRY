// i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";

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
      darkMode: "डार्क मोड",
      notifications: "सूचनाएं",
      about: "जानकारी",
      version: "संस्करण",
      description:
        "यह ऐप किसानों को बाजार की कीमतें, मिट्टी की जानकारी और अधिक में मदद करता है।",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: Localization.locale?.split("-")[0] || "en", // fallback to 'en'
  fallbackLng: "en",
  interpolation: {
    escapeValue: false, // React already escapes
  },
});

export default i18n;
