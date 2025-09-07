// app/_layout.tsx
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { Text, View, TouchableOpacity } from "react-native";
import "../global.css";
import "../i18n";
import { useTranslation } from "react-i18next";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { usePathname } from "expo-router";
import ShowVideo from '@/components/ShowVideo';


export default function Layout() {
  const { t } = useTranslation();

  const pathname = usePathname();

  const videoSources: Record<string, any> = {
  //   "/home": require("../assets/videos/home.gif"),
    "/chatbot": require("../assets/videos/chatbot.mp4"),
  //   // "/soil/index": require("../assets/videos/soil.mp4"),
    "/market_prices": require("../assets/videos/market_prices.mp4"),
  //   // "/forums/index": require("../assets/videos/forums.mp4"),
  //   // "/profile/index": require("../assets/videos/profile.mp4"),
    "/settings": require("../assets/videos/settings.mp4"),
  };

  const drawerItems = [
    { name: "home/index", label: t("home"), icon: <FontAwesome name="home" size={24} className="mr-4" /> },
    { name: "chatbot/index", label: t("chatBot"), icon: <Ionicons name="chatbubbles-outline" size={24} className="mr-4" /> },
    { name: "soil/index", label: t("soilHealth"), icon: <MaterialIcons name="grass" size={24} className="mr-4" /> },
    { name: "market_prices/index", label: t("marketStats"), icon: <FontAwesome name="line-chart" size={24} className="mr-4" /> },
    { name: "forums/index", label: t("forums"), icon: <Ionicons name="people-outline" size={24} className="mr-4" /> },
    { name: "profile/index", label: t("profile"), icon: <FontAwesome name="user" size={24} className="mr-4" /> },
    { name: "settings/index", label: t("settings"), icon: <Ionicons name="settings-outline" size={24} className="mr-4" /> },
  ];

  const CustomDrawerContent = ({ navigation }: any) => (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header */}
      <View style={{ backgroundColor: "#065f46", padding: 20, alignItems: "center" }}>
        <Text className="mt-10 font-bold text-white text-3xl">FARM APP</Text>
      </View>

      {/* Drawer Items */}
      <View style={{ marginTop: 20 }}>
        {drawerItems.map((item) => (
          <TouchableOpacity
            key={item.name}
            onPress={() => navigation.navigate(item.name)}
            className="py-2 mt-3 mx-14 flex justify-center items-center rounded-lg mb-2 border-b-2 border-gray-400"
          >
            <Text className="text-2xl font-semibold pb-6">{item.icon}  <Text className="text-center">{item.label}</Text></Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer drawerContent={(props) => <CustomDrawerContent {...props} />}>
        {drawerItems.map((item) => (
          <Drawer.Screen
            key={item.name}
            name={item.name}
            options={{
              drawerLabel: item.label, title: item.label,
              headerStyle: { backgroundColor: "#065f46" },
              headerTintColor: "#fff",
              headerRight: () => (
                <ShowVideo source={videoSources[pathname]} />
              ),
            }}
          />
        ))}
      </Drawer>
    </GestureHandlerRootView>
  );
}
