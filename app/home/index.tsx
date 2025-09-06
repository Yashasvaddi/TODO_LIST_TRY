import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function HomeScreen() {
  return (
    <ScrollView className="flex-1 bg-white p-4" showsVerticalScrollIndicator={false}>

      {/* Header */}
      <View className="flex-row justify-between items-center mb-8">
        <Text className="text-gray-900 text-2xl font-bold">Good Morning, Ramesh</Text>
        <TouchableOpacity className="bg-gray-200 p-2 rounded-full">
          <Ionicons name="notifications-outline" size={24} color="#4b5563" />
        </TouchableOpacity>
      </View>

      {/* Horizontal Crop Buttons ScrollView */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ alignItems: "center", paddingHorizontal: 4 }}
        className="mb-10"
      >
        <TouchableOpacity className="w-24 h-8 bg-gray-200 rounded-full justify-center items-center">
          <Text className="text-gray-700 text-sm">Overview</Text>
        </TouchableOpacity>
        <TouchableOpacity className="w-24 h-8 bg-amber-500 rounded-full justify-center items-center ml-2">
          <Text className="text-white text-sm font-semibold">Corn 🌽</Text>
        </TouchableOpacity>
        <TouchableOpacity className="w-24 h-8 bg-gray-200 rounded-full justify-center items-center ml-2">
          <Text className="text-gray-700 text-sm">Wheat 🌾</Text>
        </TouchableOpacity>
        <TouchableOpacity className="w-24 h-8 bg-gray-200 rounded-full justify-center items-center ml-2">
          <Text className="text-gray-700 text-sm">Barley 🌱</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Weather Card */}
      <View className="bg-gray-100 rounded-xl p-4 mb-8 shadow-sm">
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-gray-900 text-xl font-semibold">Weather</Text>
          <MaterialCommunityIcons name="weather-partly-cloudy" size={28} color="#f59e0b" />
        </View>
        <Text className="text-2xl font-bold text-gray-900 mb-6">+25°C</Text>
        <View className="flex-row justify-between mb-6">
          <View className="items-center">
            <MaterialCommunityIcons name="thermometer-lines" size={20} color="#4b5563" />
            <Text className="text-gray-600 text-xs mt-1">+22°C Soil</Text>
          </View>
          <View className="items-center">
            <MaterialCommunityIcons name="water-percent" size={20} color="#4b5563" />
            <Text className="text-gray-600 text-xs mt-1">59% Humidity</Text>
          </View>
          <View className="items-center">
            <MaterialCommunityIcons name="weather-windy" size={20} color="#4b5563" />
            <Text className="text-gray-600 text-xs mt-1">6 m/s Wind</Text>
          </View>
          <View className="items-center">
            <MaterialCommunityIcons name="weather-rainy" size={20} color="#4b5563" />
            <Text className="text-gray-600 text-xs mt-1">0 mm Rain</Text>
          </View>
        </View>
        <View className="flex-row justify-between mb-10">
          <Text className="text-gray-600 text-xs">5:25 am Sunrise</Text>
          <Text className="text-gray-600 text-xs">8:04 pm Sunset</Text>
        </View>
      </View>

      {/* Soil Moisture Card */}
      <View className="bg-gray-100 rounded-xl p-4 shadow-sm pt-8 mb-10">
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-gray-800 font-semibold">Soil Moisture</Text>
          <TouchableOpacity className="bg-gray-200 px-3 py-1 rounded-full">
            <Text className="text-gray-700 text-xs">Today</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-around mb-8">
          <View className="items-center">
            <View className="w-16 h-32 bg-red-300 rounded-lg mb-2"></View>
            <Text className="text-gray-700 text-sm">Low</Text>
            <Text className="text-gray-500 text-xs">12 Fields</Text>
          </View>
          <View className="items-center">
            <View className="w-16 h-40 bg-amber-400 rounded-lg mb-2"></View>
            <Text className="text-gray-700 text-sm">Optimal</Text>
            <Text className="text-gray-500 text-xs">18 Fields</Text>
          </View>
          <View className="items-center">
            <View className="w-16 h-28 bg-blue-300 rounded-lg mb-2"></View>
            <Text className="text-gray-700 text-sm">High</Text>
            <Text className="text-gray-500 text-xs">42 Fields</Text>
          </View>
        </View>
      </View>

      {/* Flexible spacer to fill remaining screen */}
      <View className="flex-1" />

    </ScrollView>
  );
}
