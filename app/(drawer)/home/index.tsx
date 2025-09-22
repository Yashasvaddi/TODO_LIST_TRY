import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocationStore } from "@/store/locationStore";

export default function HomeScreen() {
  const [weather, setWeather] = useState<any>(null);

  const { latitude: initialLat, longitude: initialLong } = useLocationStore();

  const [newsExpanded, setNewsExpanded] = useState(false);
  const [summaryExpanded, setSummaryExpanded] = useState(true);

  // 🔹 Static Summary
  const todaysSummary = [
    "🌱 Sow pulses in the prepared field.",
    "💧 Irrigate crops if soil moisture is low.",
    "💰 Visit the mandi to check and take advantage of rising wheat prices.",
    "🔍 Inspect crops for pests or diseases.",
  ];


  const [checkedItems, setCheckedItems] = useState<boolean[]>(
    new Array(todaysSummary.length).fill(false)
  );

  const toggleCheck = (index: number) => {
    setCheckedItems((prev) => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };

  const videos = [
    { id: "FEmnP6u6uKI", title: "Dragon Fruit 🐉 Farming Income" },
    {
      id: "koWzEDnChFQ",
      title:
        "Turmeric Farming Profits 30-40 lakhs? | Agritalk by Abhinav Roy | #shorts",
    },
    {
      id: "iqGiPs5ReYs",
      title: "Thrips Pest Management in Cotton Farming - Punjabi Video",
    },
  ];


  // 🔹 Static News
  const staticNews = [
    "Government announces new subsidy scheme for organic fertilizers.",
    "IMD predicts moderate rainfall in central India for the next week.",
    "Maharashtra farmers shift towards soybean due to better MSP.",
  ];

  // 🔹 Fetch Weather (still using API)
  useEffect(() => {
    async function fetchWeather() {
      const lat = initialLat?.toFixed(2);
      const lon = initialLong?.toFixed(2);
      const apiKey = "e815fdaf6c512348023aee21fccdada5";

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
  }, [initialLat]);

  return (
    <ScrollView className="flex-1 bg-white p-4" showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View className="flex-row justify-between items-center mb-8">
        <Text className="text-gray-900 text-2xl font-bold">
          Good Morning, Ramesh
        </Text>
        <TouchableOpacity className="bg-gray-200 p-2 rounded-full">
          <Ionicons name="notifications-outline" size={24} color="#4b5563" />
        </TouchableOpacity>
      </View>

      {/* 🔹 Farmer's To-Do Section */}
      <View className="mb-6 bg-emerald-100 rounded-3xl shadow-lg">
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setSummaryExpanded(!summaryExpanded)}
          className="flex-row justify-between items-center px-5 py-4"
        >
          <Text className="text-xl font-bold text-emerald-900">
            🌞 Smart Day Plan
          </Text>
          <Ionicons
            name={summaryExpanded ? "chevron-up" : "chevron-down"}
            size={22}
            color="#065f46"
          />
        </TouchableOpacity>

        {summaryExpanded && (
          <View className="px-5 pb-5">
            {todaysSummary.map((point, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => toggleCheck(i)}
                className="flex-row items-center mb-3"
                activeOpacity={1}
              >
                <Ionicons
                  name={checkedItems[i] ? "checkbox" : "square-outline"}
                  size={22}
                  color={checkedItems[i] ? "#004700" : "#9ca3af"}
                  style={{ marginRight: 10 }}
                />
                <Text
                  className={`text-base flex-1 ${checkedItems[i] ? "text-gray-500 line-through" : "text-gray-800"
                    }`}
                >
                  {point.replace(/^(\p{Emoji_Presentation}|\p{Emoji}\ufe0f?\s*)/u, "")}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>


      {/* 🔹 Dropdown: News */}
      <View className="mb-6 bg-yellow-100 rounded-2xl shadow-md">
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setNewsExpanded(!newsExpanded)}
          className="flex-row justify-between items-center px-4 py-3"
        >
          <Text className="text-xl font-bold text-gray-900">Latest News</Text>
          <Ionicons
            name={newsExpanded ? "chevron-up" : "chevron-down"}
            size={22}
            color="#374151"
          />
        </TouchableOpacity>

        {newsExpanded && (
          <View className="px-4 pb-4">
            {staticNews.map((item, i) => (
              <View key={i} className="mb-3">
                <Text className="text-base text-gray-800">{`• ${item}`}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
      {/* Weather Card */}
      <View className="bg-blue-100 rounded-3xl py-4 px-6 mb-8 shadow-lg">
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-xl font-bold">Weather</Text>
          <MaterialCommunityIcons
            name="weather-partly-cloudy"
            size={28}
            color="#f59e0b"
          />
        </View>

        <Text className="text-2xl font-bold text-gray-900 mb-2">
          {weather ? `${Math.round(weather.main?.temp)}°C` : "Loading..."}
        </Text>

        {/* 🔹 Weather Suggestion */}
        <Text className="text-sm text-gray-700 italic mb-6">
          {weather
            ? weather.main?.temp < 25
              ? "🌱 Cool day ahead – good for irrigation and sowing."
              : weather.main?.temp > 32
                ? "☀️ Hot weather – ensure proper watering for crops."
                : "🌤 Pleasant weather – suitable for most farming activities."
            : "Fetching suggestions..."}
        </Text>

        {/* Current Conditions */}
        <View className="flex-row justify-between mb-6">
          <View className="items-center">
            <MaterialCommunityIcons name="thermometer-lines" size={20} color="#4b5563" />
            <Text className="text-gray-600 text-xs mt-1">
              {weather ? `${Math.round(weather.main?.feels_like)}°C Feels` : "--"}
            </Text>
          </View>
          <View className="items-center">
            <MaterialCommunityIcons name="water-percent" size={20} color="#4b5563" />
            <Text className="text-gray-600 text-xs mt-1">
              {weather ? `${weather?.main?.humidity}% Humidity` : "--"}
            </Text>
          </View>
          <View className="items-center">
            <MaterialCommunityIcons name="weather-windy" size={20} color="#4b5563" />
            <Text className="text-gray-600 text-xs mt-1">
              {weather ? `${weather?.wind?.speed} m/s Wind` : "--"}
            </Text>
          </View>
          <View className="items-center">
            <MaterialCommunityIcons name="weather-rainy" size={20} color="#4b5563" />
            <Text className="text-gray-600 text-xs mt-1">
              {weather && weather.rain ? `${weather?.rain["1h"]} mm Rain` : "0 mm Rain"}
            </Text>
          </View>
        </View>

        {/* Sunrise & Sunset */}
        <View className="flex-row justify-between mb-6">
          <Text className="text-gray-600 text-xs">
            {weather
              ? new Date(weather?.sys?.sunrise * 1000).toLocaleTimeString()
              : "--"} Sunrise
          </Text>
          <Text className="text-gray-600 text-xs">
            {weather
              ? new Date(weather?.sys?.sunset * 1000).toLocaleTimeString()
              : "--"} Sunset
          </Text>
        </View>

        {/* 🔹 Fake 15-Day Forecast */}
        <Text className="text-lg font-semibold text-gray-800 mb-3">15-Day Forecast</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
          {Array.from({ length: 15 }).map((_, i) => {
            const day = new Date();
            day.setDate(day.getDate() + i + 1);
            const fakeTemp = Math.floor(20 + Math.random() * 15);
            const conditions = ["sunny", "cloudy", "rainy"];
            const condition = conditions[Math.floor(Math.random() * conditions.length)];
            const iconMap: any = {
              sunny: "weather-sunny",
              cloudy: "weather-cloudy",
              rainy: "weather-rainy",
            };

            return (
              <View
                key={i}
                className="w-20 bg-white rounded-2xl p-2 mr-3 items-center shadow"
              >
                <Text className="text-xs font-semibold text-gray-700">
                  {day.toLocaleDateString("en-US", { weekday: "short" })}
                </Text>
                <MaterialCommunityIcons
                  name={iconMap[condition]}
                  size={28}
                  color="#f59e0b"
                  style={{ marginVertical: 6 }}
                />
                <Text className="text-sm font-bold text-gray-800">{fakeTemp}°C</Text>
              </View>
            );
          })}
        </ScrollView>
      </View>

      {/* 🌟 Tip of the Day */}
      <View className="bg-green-100 rounded-3xl p-5 mb-8 shadow-sm">
        <Text className="text-lg font-bold text-green-900 mb-2">🌟 Farming Tip of the Day</Text>
        <Text className="text-gray-700 text-sm leading-6">
          Rotate your crops every season to maintain soil fertility and reduce pests. 🌱
        </Text>
      </View>


      {/* QUICK GUIDE */}
      <View className="rounded-3xl shadow-md p-5 mb-8" style={{ backgroundColor: "#065f46" }}>
        <Text className="text-xl font-bold text-white mb-4">Quick Guide</Text>
        <View className="flex-row flex-wrap justify-between">
          {[
            { title: "Chatbot", desc: "Get instant answers to queries.", icon: "chatbubble-ellipses-outline" },
            { title: "Soil Health", desc: "View soil health and suggestions.", icon: "leaf-outline" },
            { title: "Market Prices", desc: "View real-time and predicted crop prices.", icon: "cash-outline" },
            { title: "Financial Calculator", desc: "Track profits, costs & revenue.", icon: "calculator-outline" },
            { title: "Forums", desc: "Discuss & share with the community.", icon: "people-outline" },
            { title: "Profile", desc: "Manage your personal details.", icon: "person-circle-outline" },
          ].map((item, index) => (
            <View
              key={index}
              className="w-[48%] bg-white rounded-3xl p-4 mb-4 shadow-md flex-col justify-between"
              style={{ minHeight: 100 }}
            >
              <View className="flex-row items-center mb-2">
                <View className="bg-green-100 rounded-full p-3 mr-3">
                  <Ionicons name={item.icon as any} size={24} color="#065f46" />
                </View>
                <Text className="text-gray-900 font-semibold text-sm flex-1 ">{item.title}</Text>
              </View>
              <Text className="text-gray-500 text-[10px] mt-auto">{item.desc}</Text>
            </View>
          ))}
        </View>
      </View>



      {/* YouTube Videos Section */}
      <View className="bg-red-100 rounded-3xl p-4 shadow-sm pt-8 mb-10">
        <Text className="text-xl font-bold text-gray-800 mb-4">
          🎬 Recommended Videos
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 16 }}
        >
          {videos.map((video) => (
            <TouchableOpacity
              key={video.id}
              onPress={() =>
                Linking.openURL(`https://www.youtube.com/watch?v=${video.id}`)
              }
              className="w-72 mr-4 rounded-3xl bg-white p-3 shadow-md"
              activeOpacity={0.9}
            >
              <View className="relative">
                <Image
                  source={{
                    uri: `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`,
                  }}
                  className="w-full h-44 rounded-3xl mb-3"
                  resizeMode="cover"
                />
                <View className="absolute inset-0 justify-center items-center">
                  <Ionicons
                    name="play-circle"
                    size={60}
                    color="rgba(255,255,255,0.9)"
                  />
                </View>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-base font-semibold text-gray-800 flex-1 mr-2">
                  {video.title}
                </Text>
                <Ionicons name="logo-youtube" size={24} color="red" />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
}
