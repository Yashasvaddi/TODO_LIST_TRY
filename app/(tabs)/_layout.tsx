import { Tabs } from "expo-router";
import { View } from "react-native";
import { MessageCircle, Book, Home, Settings } from "lucide-react-native";
import "../../global.css"

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: { backgroundColor: "#111112", borderTopColor: "#1e1e20" },
        tabBarActiveTintColor: "#60a5fa",
        tabBarInactiveTintColor: "#9ca3af",
      }}
    >
      <Tabs.Screen
        name="chat"
        options={{
          tabBarIcon: ({ color, size }) => (
            <View className="items-center justify-center">
              <MessageCircle size={size || 24} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          tabBarIcon: ({ color, size }) => (
            <View className="items-center justify-center">
              <Book size={size || 24} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          tabBarIcon: ({ color, size }) => (
            <View className="items-center justify-center">
              <Home size={size || 24} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ color, size }) => (
            <View className="items-center justify-center">
              <Settings size={size || 24} color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
