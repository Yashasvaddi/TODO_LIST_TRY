import React, { useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import { useTranslation } from "react-i18next";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { useAuthStore } from "@/store/authStore";
import HelpScreen from "@/components/HelpScreen";

type DrawerRoute =
  | "/(drawer)/home"
  | "/(drawer)/chatbot"
  | "/(drawer)/soil"
  | "/(drawer)/market_prices"
  | "/(drawer)/finanical_calc"
  | "/(drawer)/forums"
  | "/(drawer)/profile"
  | "/(drawer)/settings";

export default function DrawerLayout() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const [helpVisible, setHelpVisible] = useState(false);

  const drawerItems: { name: string; route: DrawerRoute; label: string; icon: React.ReactElement }[] = [
    { name: "home", route: "/(drawer)/home", label: t("home"), icon: <FontAwesome name="home" size={24} /> },
    { name: "chatbot", route: "/(drawer)/chatbot", label: t("chatBot"), icon: <Ionicons name="chatbubbles" size={24} /> },
    { name: "soil", route: "/(drawer)/soil", label: t("soilHealth"), icon: <MaterialIcons name="grass" size={24} /> },
    { name: "market_prices", route: "/(drawer)/market_prices", label: t("marketStats"), icon: <FontAwesome name="line-chart" size={24} /> },
    { name: "finanical_calc", route: "/(drawer)/finanical_calc", label: t("Calculator"), icon: <Ionicons name="calculator" size={24} /> },
    { name: "forums", route: "/(drawer)/forums", label: t("forums"), icon: <Ionicons name="people-outline" size={24} /> },
    { name: "profile", route: "/(drawer)/profile", label: t("profile"), icon: <FontAwesome name="user" size={24} /> },
    { name: "settings", route: "/(drawer)/settings", label: t("settings"), icon: <Ionicons name="settings" size={24} /> },
  ];

  const CustomDrawerContent = () => {

    const handleLogout = () => {
      logout();
      router.replace("/(auth)/login");
    };

    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        {/* Header */}
        <View style={{ backgroundColor: "#065f46", padding: 20, alignItems: "center" }}>
          <Text className="mt-10 font-bold text-white text-3xl">कृषि मित्र</Text>
        </View>

        {/* Drawer Items */}
        <View className="mt-5 flex-1">
          {drawerItems.map((item) => {
            const isActive = pathname === item.route || pathname?.startsWith(`${item.route}/`) || false;

            return (
              <TouchableOpacity
                key={item.name}
                onPress={() => {
                  if (pathname !== item.route) {
                    router.push(item.route);
                  }
                }}
                className={`flex-row items-center py-4 px-6 mx-6 rounded-lg border-b-2 
                  ${isActive ? "bg-green-700 border-green-900" : "border-gray-400"}`}
              >
                {React.cloneElement(item.icon as React.ReactElement<any>, {
                  color: isActive ? "#fff" : "#000",
                })}
                <Text
                  className={`ml-3 text-2xl font-semibold ${
                    isActive ? "text-white" : "text-black"
                  }`}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          onPress={handleLogout}
          className="flex-row items-center py-4 px-6 mx-6 rounded-lg border-b-2 border-gray-200 mb-5"
        >
          <Ionicons name="log-out-outline" size={24} color="red" />
          <Text className="ml-3 text-xl font-semibold text-red-600">
            {t("logout")}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={() => <CustomDrawerContent />}
        screenOptions={{
          headerShown: true,
          headerStyle: {
            backgroundColor: "#065f46",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerRight: () => (
            <TouchableOpacity
              onPress={() => setHelpVisible(true)}
              style={{ marginRight: 16 }}
            >
              <Ionicons name="help-circle-outline" size={26} color="#fff" />
            </TouchableOpacity>
          ),
        }}
      >
        {drawerItems.map((item) => (
          <Drawer.Screen
            key={item.name}
            name={`${item.name}${item.name !== "forums" ? "/index" : ""}`}
            options={{
              title: item.label,
              drawerLabel: item.label,
            }}
          />
        ))}
      </Drawer>

      {/* Help Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={helpVisible}
        onRequestClose={() => setHelpVisible(false)}
      >
        <HelpScreen setHelpVisible={setHelpVisible}/>
      </Modal>
    </GestureHandlerRootView>
  );
}
