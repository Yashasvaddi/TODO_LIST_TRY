// app/settings/index.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, Switch } from "react-native";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "@/store/languageStore";

export default function Settings() {
  const { t, i18n } = useTranslation();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const language = useLanguageStore((state) => state.language);
  const setLanguage = useLanguageStore((state) => state.setLanguage);

  const LANG_MAP: Record<string, string> = {
    en: "english",
    hi: "hindi",
    ma: "marathi",
  };

  const changeLanguage = (lng: "en" | "hi" | "ma") => {
    setLanguage(LANG_MAP[lng]);
    i18n.changeLanguage(lng);
  };

  return (
    <View className="flex-1 bg-gray-100 p-4">
      <Text className="text-2xl font-bold text-green-600 mb-6">{t("settings")}</Text>

      {/* Language Section */}
      <Text className="text-lg font-semibold mb-2">{t("language")}</Text>
      <View className="flex-row mb-6">
        {(["en", "hi", "ma"] as const).map((lng) => (
          <TouchableOpacity
            key={lng}
            onPress={() => changeLanguage(lng)}
            className={`px-4 py-2 mr-2 rounded border ${
              i18n.language === lng ? "bg-green-600 border-green-600" : "bg-white border-gray-300"
            }`}
          >
            <Text className={i18n.language === lng ? "text-white" : "text-black"}>
              {t(LANG_MAP[lng])}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Dark Mode */}
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-lg font-semibold">{t("darkMode")}</Text>
        <Switch value={darkMode} onValueChange={setDarkMode} />
      </View>

      {/* Notifications */}
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-lg font-semibold">{t("notifications")}</Text>
        <Switch value={notifications} onValueChange={setNotifications} />
      </View>

      {/* About Section */}
      <View className="p-4 bg-white rounded-xl border border-green-600">
        <Text className="font-semibold text-lg mb-2">{t("about")}</Text>
        <Text className="text-gray-700 mb-1">{t("version")}: 1.0.0</Text>
        <Text className="text-gray-700">{t("description")}</Text>
      </View>
    </View>
  );
}
