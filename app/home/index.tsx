import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Linking, Image, Modal, ActivityIndicator } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocationStore } from "@/store/locationStore";
import { LanguageStore } from "@/store/languageStore";

export default function HomeScreen() {
  const [weather, setWeather] = useState<any>(null);

  // 🔹 NEW STATES FOR POPUP
  const [news, setNews] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(true);
  const [loadingNews, setLoadingNews] = useState(true);

  const { latitude: initialLat, longitude: initialLong } = useLocationStore();
  const { language } = LanguageStore();

  useEffect(() => {
    async function fetchWeather() {
      const lat = initialLat; // Example: Delhi latitude
      const lon = initialLong; // Example: Delhi longitude
      const apiKey = "e815fdaf6c512348023aee21fccdada5"; // ⬅️ Replace with your OpenWeather API key

      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
        );
        const data = await res.json();
        setWeather(data);
      } catch (e) {
        console.log("Weather API error:", e);
      }
    }

    fetchWeather();
  }, []);

  // 🔹 FETCH NEWS FOR POPUP
  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch("https://www.codersmitramandal.shop/sih/news", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lang: language }), // you can change to "hindi" / "english"
        });
        const data = await res.json();
        setNews(data);
      } catch (e) {
        console.log("News API error:", e);
      } finally {
        setLoadingNews(false);
      }
    }
    fetchNews();
  }, [language]);

  return (
    <>

      {/* 🔹 YOUR ORIGINAL CODE STARTS HERE (unchanged) */}
      <ScrollView className="flex-1 bg-white p-4" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row justify-between items-center mb-8">
          <Text className="text-gray-900 text-2xl font-bold">Good Morning, Ramesh</Text>
          <TouchableOpacity className="bg-gray-200 p-2 rounded-full">
            <Ionicons name="notifications-outline" size={24} color="#4b5563" />
          </TouchableOpacity>
        </View>
        {/* NEWS Carousel */}
        <View className="mb-6 bg-white rounded-2xl w-full shadow-lg">
          {/* Header */}
          <View className="flex-row justify-between items-center px-4 pt-4 pb-2">
            <Text className="text-xl font-bold text-gray-900">आजची बातमी</Text>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="p-1 rounded-full bg-gray-100"
            >
              <Ionicons name="close" size={22} color="#374151" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          {loadingNews ? (
            <View className="flex-1 justify-center items-center py-6">
              <ActivityIndicator size="large" color="#f59e0b" />
              <Text className="text-gray-500 mt-3">लोड होत आहे…</Text>
            </View>
          ) : news && Array.isArray(news.NEWS) ? (
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              className="w-full"
              contentContainerStyle={{ paddingHorizontal: 16 }}
            >
              {news.NEWS.map((item: string, index: number) => (
                <View
                  key={index}
                  className="w-[300px] mx-2 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-4 shadow-md"
                >
                  <Text className="text-base leading-6 text-gray-800">
                    {item.replace(/\*\*/g, "").replace(/\\n/g, "\n").trim()}
                  </Text>
                </View>
              ))}
            </ScrollView>
          ) : news?.NEWS ? (
            <View className="px-4 pb-4">
              <Text className="text-base leading-6 text-gray-700">
                {news.NEWS.replace(/\*\*/g, "").replace(/\\n/g, "\n").trim()}
              </Text>
            </View>
          ) : (
            <View className="py-6 items-center">
              <Text className="text-gray-400">No news available.</Text>
            </View>
          )}
        </View>



        {/* Weather Card */}
        <View className="bg-gray-100 rounded-xl p-4 mb-8 shadow-sm">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-gray-900 text-xl font-semibold">Weather</Text>
            <MaterialCommunityIcons name="weather-partly-cloudy" size={28} color="#f59e0b" />
          </View>

          <Text className="text-2xl font-bold text-gray-900 mb-6">
            {weather ? `${Math.round(weather.main.temp)}°C` : "Loading..."}
          </Text>

          <View className="flex-row justify-between mb-6">
            <View className="items-center">
              <MaterialCommunityIcons name="thermometer-lines" size={20} color="#4b5563" />
              <Text className="text-gray-600 text-xs mt-1">
                {weather ? `${Math.round(weather.main.feels_like)}°C Feels` : "--"}
              </Text>
            </View>
            <View className="items-center">
              <MaterialCommunityIcons name="water-percent" size={20} color="#4b5563" />
              <Text className="text-gray-600 text-xs mt-1">
                {weather ? `${weather.main.humidity}% Humidity` : "--"}
              </Text>
            </View>
            <View className="items-center">
              <MaterialCommunityIcons name="weather-windy" size={20} color="#4b5563" />
              <Text className="text-gray-600 text-xs mt-1">
                {weather ? `${weather.wind.speed} m/s Wind` : "--"}
              </Text>
            </View>
            <View className="items-center">
              <MaterialCommunityIcons name="weather-rainy" size={20} color="#4b5563" />
              <Text className="text-gray-600 text-xs mt-1">
                {weather && weather.rain ? `${weather.rain["1h"]} mm Rain` : "0 mm Rain"}
              </Text>
            </View>
          </View>

          <View className="flex-row justify-between mb-10">
            <Text className="text-gray-600 text-xs">
              {weather ? new Date(weather.sys.sunrise * 1000).toLocaleTimeString() : "--"} Sunrise
            </Text>
            <Text className="text-gray-600 text-xs">
              {weather ? new Date(weather.sys.sunset * 1000).toLocaleTimeString() : "--"} Sunset
            </Text>
          </View>
        </View>

        {/* YouTube Videos Section */}
        <View className="bg-gray-100 rounded-xl p-4 shadow-sm pt-8 mb-10">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-gray-800 font-semibold">Recommended Videos</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 16 }}
          >
            <TouchableOpacity
              onPress={() => Linking.openURL("https://www.youtube.com/watch?v=dQw4w9WgXcQ")}
              className="mr-4"
            >
              <Image
                source={{ uri: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg" }}
                className="w-64 h-48 rounded-lg"
              />
              <Text className="text-gray-700 mt-2 w-64">Introduction to Smart Farming</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => Linking.openURL("https://www.youtube.com/watch?v=ysz5S6PUM-U")}
            >
              <Image
                source={{ uri: "https://img.youtube.com/vi/ysz5S6PUM-U/hqdefault.jpg" }}
                className="w-64 h-48 rounded-lg"
              />
              <Text className="text-gray-700 mt-2 w-64">Crop Monitoring Techniques</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Flexible spacer */}
        <View className="flex-1" />
      </ScrollView>
    </>
  );
}
