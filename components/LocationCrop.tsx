import { View, Text } from "react-native";
import React from "react";
import * as Progress from "react-native-progress";

interface locProps {
  coords: {
    lat: number;
    lon: number;
  };
  details: any;
  setCoords: React.Dispatch<
    React.SetStateAction<{ lat: number; lon: number }>
  >;
}

export default function LocationCrop({ coords, setCoords, details }: locProps) {
  // 🌈 Helper to color confidence bars
  const getBarColor = (confidence: number) => {
    if (confidence >= 0.6) return "#22c55e"; // green-500
    if (confidence >= 0.3) return "#eab308"; // yellow-500
    return "#ef4444"; // red-500
  };

  return (
    <View className="p-4 m-4 rounded-2xl bg-white shadow-md border border-gray-200">
      {/* 📍 Location */}
      <Text className="text-xl font-bold text-gray-800 mb-3">📍 Location</Text>
      <View className="mb-4">
        <Text className="text-gray-600">Lat: {coords.lat.toFixed(2)}</Text>
        <Text className="text-gray-600">Lon: {coords.lon.toFixed(2)}</Text>
        <Text className="text-gray-600">District: {details?.locationInfo?.district ?? "--"}</Text>
        <Text className="text-gray-600">State: {details?.locationInfo?.state ?? "--"}</Text>
      </View>


      {/* 🌱 Soil */}
      <Text className="text-xl font-bold text-gray-800 mb-3">
        🌱 Soil Characteristics
      </Text>
      <View className="flex-row flex-wrap gap-2">
        <Text className="px-3 py-1 rounded-full bg-red-100 text-red-700 font-medium">
          Nitrogen: {details?.soil_characteristics?.N_level ?? "--"}
        </Text>
        <Text className="px-3 py-1 rounded-full bg-green-100 text-green-700 font-medium">
          Phosphorus: {details?.soil_characteristics?.P_level ?? "--"}
        </Text>
        <Text className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 font-medium">
          Potassium: {details?.soil_characteristics?.K_level ?? "--"}
        </Text>
        <Text className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">
          pH: {details?.soil_characteristics?.pH_level ?? "--"}
        </Text>
      </View>

      {/* 🌾 Crops */}
      <Text className="text-xl font-bold text-gray-800 mt-6 mb-3">
        🌾 Crop Recommendations
      </Text>

      {details?.crop_recommendations?.length > 0 ? (
        details.crop_recommendations.map((item: any, ind: number) => {
          const confidence = parseFloat(item.confidence.toFixed(2));
          return (
            <View
              key={ind}
              className="mb-4 p-4 rounded-xl bg-gray-50 border border-gray-200 shadow-sm"
            >
              <View className="flex-row justify-between mb-2">
                <Text className="text-lg font-semibold text-gray-800">
                  {item.crop}
                </Text>
                <Text className="text-gray-600 font-medium">
                  {Math.round(confidence * 100)}%
                </Text>
              </View>
              <Progress.Bar
                progress={confidence}
                width={null}
                height={12}
                color={getBarColor(confidence)}
                unfilledColor="#e5e7eb" // gray-200
                borderRadius={8}
                borderWidth={0}
              />
            </View>
          );
        })
      ) : (
        <Text className="text-gray-400 italic">
          No crop recommendations yet...
        </Text>
      )}
    </View>
  );
}
