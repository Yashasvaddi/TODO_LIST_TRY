// app/settings/index.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, Switch } from "react-native";
import { useTranslation } from "react-i18next";

export default function Settings() {
  const { t, i18n } = useTranslation();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const changeLanguage = (lng: "en" | "hi") => {
    i18n.changeLanguage(lng); // dynamically changes language
  };

  return (
    <View className="flex-1 bg-gray-100 p-4">
      <Text className="text-2xl font-bold text-green-600 mb-6">{t("settings")}</Text>

      {/* Language Section */}
      <Text className="text-lg font-semibold mb-2">{t("language")}</Text>
      <View className="flex-row mb-6">
        <TouchableOpacity
          onPress={() => changeLanguage("en")}
          className={`px-4 py-2 mr-2 rounded border ${
            i18n.language === "en" ? "bg-green-600 border-green-600" : "bg-white border-gray-300"
          }`}
        >
          <Text className={i18n.language === "en" ? "text-white" : "text-black"}>{t("english")}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => changeLanguage("hi")}
          className={`px-4 py-2 rounded border ${
            i18n.language === "hi" ? "bg-green-600 border-green-600" : "bg-white border-gray-300"
          }`}
        >
          <Text className={i18n.language === "hi" ? "text-white" : "text-black"}>{t("hindi")}</Text>
        </TouchableOpacity>
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
