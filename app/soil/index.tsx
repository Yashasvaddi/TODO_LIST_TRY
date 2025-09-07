import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, ScrollView } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

export default function SoilHealth() {
  const [notes, setNotes] = useState("");

  return (
    <ScrollView className="flex-1 bg-white p-6">
      {/* Header */}
      <View className="items-center mb-6">
        <Text className="text-3xl font-bold text-green-800">Soil Health 🌱</Text>
        <Text className="text-gray-600 text-lg mt-2">
          Upload or report soil health. Get insights & recommendations.
        </Text>
      </View>

      {/* Upload Button */}
      <TouchableOpacity
        className="flex-row items-center justify-center bg-green-700 p-4 rounded-2xl shadow-md mb-6"
        onPress={() => alert("Upload feature coming soon!")}
      >
        <Ionicons name="cloud-upload-outline" size={24} color="white" />
        <Text className="ml-3 text-white font-semibold text-lg">Upload Soil Report</Text>
      </TouchableOpacity>

      {/* Insights Section */}
      <View className="bg-green-100 p-5 rounded-2xl shadow mb-6">
        <Text className="text-xl font-bold text-green-800 mb-3">Insights</Text>
        <Text className="text-gray-700 leading-6">
          • Soil pH: Neutral (6.8){"\n"}
          • Organic Matter: Good{"\n"}
          • Nitrogen: Adequate{"\n"}
          • Potassium: Low
        </Text>
      </View>

      {/* Recommendations Section */}
      <View className="bg-green-50 p-5 rounded-2xl shadow mb-6">
        <Text className="text-xl font-bold text-green-800 mb-3">Recommendations</Text>
        <Text className="text-gray-700 leading-6">
          ✅ Add potash-based fertilizers{"\n"}
          ✅ Rotate crops with legumes{"\n"}
          ✅ Mulching suggested to retain soil moisture
        </Text>
      </View>

      {/* Notes Section */}
      <View className="bg-white p-5 rounded-2xl shadow border border-gray-200">
        <Text className="text-xl font-bold text-green-800 mb-3">Farmer Notes</Text>
        <TextInput
          value={notes}
          onChangeText={setNotes}
          placeholder="Write your observations..."
          multiline
          numberOfLines={5}
          className="border border-gray-300 rounded-xl p-3 text-gray-700"
        />
        <TouchableOpacity
          className="mt-4 bg-green-700 p-3 rounded-xl items-center"
          onPress={() => alert("Notes saved: " + notes)}
        >
          <MaterialIcons name="save" size={22} color="white" />
          <Text className="text-white font-semibold mt-1">Save Notes</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
