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
import useUserLocation from "@/hooks/useUserLocation";
import { AuthProvider, useAuth } from "../AuthContext"; // <-- project-root/AuthContext.tsx
import LoginScreen from "./login"; // app/login.tsx

function LayoutInner() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const { loading } = useUserLocation();
  const { isAuthenticated } = useAuth(); // from AuthContext

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Fetching your location...</Text>
      </View>
    );
  }

  // show login first if not authenticated
  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  const drawerItems = [
    { name: "home/index", label: t("home"), icon: <FontAwesome name="home" size={22} /> },
    { name: "chatbot/index", label: t("chatBot"), icon: <Ionicons name="chatbubbles-outline" size={22} /> },
    { name: "soil/index", label: t("soilHealth"), icon: <MaterialIcons name="grass" size={22} /> },
    { name: "market_prices/index", label: t("marketStats"), icon: <FontAwesome name="line-chart" size={22} /> },
    { name: "finanical_calc/index", label: t("Calculator"), icon: <Ionicons name="settings-outline" size={22} /> },
    { name: "forums", label: t("forums"), icon: <Ionicons name="people-outline" size={22} /> },
    { name: "profile/index", label: t("profile"), icon: <FontAwesome name="user" size={22} /> },
    { name: "settings/index", label: t("settings"), icon: <Ionicons name="settings-outline" size={22} /> },
  ];

  const CustomDrawerContent = ({ navigation }: any) => {
    const currentPage = pathname.replace("/", "");
    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <View style={{ backgroundColor: "#065f46", padding: 20, alignItems: "center" }}>
          <Text style={{ marginTop: 10, fontWeight: "700", color: "#fff", fontSize: 24 }}>FARM APP</Text>
        </View>

        <View style={{ marginTop: 20 }}>
          {drawerItems.map((item) => {
            const itemKey = item.name.split("/")[0];
            const isActive = currentPage === itemKey;
            return (
              <TouchableOpacity
                key={item.name}
                onPress={() => navigation.navigate(item.name)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 14,
                  paddingHorizontal: 18,
                  marginHorizontal: 14,
                  borderBottomWidth: 1,
                  borderColor: isActive ? "#134e4a" : "#e5e7eb",
                  borderRadius: 8,
                  backgroundColor: isActive ? "#166534" : "transparent",
                  marginBottom: 6,
                }}
              >
                <View style={{ marginRight: 12 }}>{item.icon}</View>
                <Text style={{ fontSize: 18, fontWeight: "600", color: isActive ? "#fff" : "#000" }}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer drawerContent={(props) => <CustomDrawerContent {...props} />}>
        {drawerItems.map((item) => (
          <Drawer.Screen
            key={item.name}
            name={item.name}
            options={{
              drawerLabel: item.label,
              title: item.label,
              headerStyle: { backgroundColor: "#065f46" },
              headerTintColor: "#fff",
            }}
          />
        ))}
      </Drawer>
    </GestureHandlerRootView>
  );
}

// only one default export — wraps LayoutInner inside AuthProvider
export default function Layout() {
  return (
    <AuthProvider>
      <LayoutInner />
    </AuthProvider>
  );
}
