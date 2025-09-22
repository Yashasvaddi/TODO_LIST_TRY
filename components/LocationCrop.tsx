import { View, Text } from "react-native";
import React from "react";
import * as Progress from "react-native-progress";
import Markdown from "react-native-markdown-display";

interface locProps {
  coords: { lat: number; lon: number };
  details: any;
}

export default function LocationCrop({ coords, details }: locProps) {

  const getBarColor = (confidence: number) => {
    if (confidence >= 0.6) return "#22c55e";
    if (confidence >= 0.3) return "#eab308";
    return "#ef4444";
  };

  // 🔹 Static crop recommendation data
  const staticCropData = [
    { crop: "Wheat", confidence: 0.85 },
    { crop: "Rice", confidence: 0.65 },
    { crop: "Maize", confidence: 0.45 },
    { crop: "Tomato", confidence: 0.25 },
  ];

  // 🔹 Static AI-style suggestions
  const staticSuggestions = `
**Recommended Crops:** Wheat, Rice, Maize, Tomato.  
- Ensure proper irrigation for Wheat and Rice.  
- Maize requires well-drained soil and regular sunlight.  
- Tomato needs **balanced fertilization** and pest control.  
- Monitor soil pH and maintain **Nitrogen & Phosphorus levels**.  
- Rotate crops seasonally to maintain soil health.
`;

  return (
    <View className="p-4 m-2 rounded-3xl bg-white shadow-md border border-gray-200">

      {/* Location */}
      <Text className="text-xl font-bold text-gray-800 mb-3">📍 Location</Text>
      <View className="mb-4">
        {/* <Text className="text-gray-600">Lat: {coords?.lat?.toFixed(2) ?? "--"}</Text>
        <Text className="text-gray-600">Lon: {coords?.lon?.toFixed(2) ?? "--"}</Text> */}
        <Text className="text-gray-600">
          District: {details?.locationInfo?.district ?? "--"}
        </Text>
        <Text className="text-gray-600">
          State: {details?.locationInfo?.state ?? "--"}
        </Text>
      </View>
      {/* Soil */}
      <Text className="text-xl font-bold text-gray-800 mb-3">🌱 Soil Characteristics</Text>
      <View className="flex-row flex-wrap gap-2">
        <Text className="px-3 py-1 rounded-full bg-red-100 text-red-700 font-medium">
          Nitrogen: High
        </Text>
        <Text className="px-3 py-1 rounded-full bg-green-100 text-green-700 font-medium">
          Phosphorus: Medium
        </Text>
        <Text className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 font-medium">
          Potassium: High
        </Text>
        <Text className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">
          pH: Low
        </Text>
      </View>



      {/* Crops (Static Data) */}
      <Text className="text-xl font-bold text-gray-800 mt-6 mb-3">🌾 Crop Recommendations</Text>
      {staticCropData.map((item, ind) => (
        <View key={ind} className="mb-4 p-4 rounded-3xl bg-gray-50 border border-gray-200 shadow-sm">
          <View className="flex-row justify-between mb-2">
            <Text className="text-lg font-semibold text-gray-800">{item.crop}</Text>
            <Text className="text-gray-600 font-medium">{Math.round(item.confidence * 100)}%</Text>
          </View>
          <Progress.Bar
            progress={item.confidence}
            width={null}
            height={12}
            color={getBarColor(item.confidence)}
            unfilledColor="#e5e7eb"
            borderRadius={8}
            borderWidth={0}
          />
        </View>
      ))}

      {/* Static Suggestions */}
      <Text className="text-xl font-bold text-gray-800 mt-6 mb-3">💡 Suggestions</Text>
      <View className="p-4 bg-green-50 rounded-3xl border border-green-200 shadow-sm">
        <Markdown
          style={{
            body: { color: "#065f46", fontSize: 16, lineHeight: 22 },
            strong: { color: "#b91c1c" }
          }}
        >
          {staticSuggestions}
        </Markdown>
      </View>
    </View>
  );
}
