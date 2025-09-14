// app/profile/index.tsx
import React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, TextInput } from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";

export default function ProfileScreen() {
  return (
    <ScrollView className="flex-1 bg-gray-100">
      {/* Header Banner */}
      <View className="bg-[#065f46] h-40 justify-center items-center">
        <Image
          source={{ uri: "https://www.pikpng.com/pngl/m/80-805068_my-profile-icon-blank-profile-picture-circle-clipart.png" }}
          className="w-20 h-20 rounded-full"
        />
        <Text className="text-white text-xl font-bold mt-2">Ramesh Gokhale</Text>
      </View>

      {/* Profile Details */}
      <View className="px-6 mt-6">
        {/* Contact Info */}
        <View className="bg-white rounded-2xl shadow p-4 mb-4">
          <Text className="text-lg font-bold text-gray-800 mb-2">Contact Info</Text>
          <View className="flex-row items-center mb-2">
            <Ionicons name="mail-outline" size={20} color="#065f46" />
            <Text className="ml-2 text-gray-700">RameshGokhale123@gmail.com</Text>
          </View>
          <View className="flex-row items-center">
            <Ionicons name="call-outline" size={20} color="#065f46" />
            <Text className="ml-2 text-gray-700">+91 98765 43210</Text>
          </View>
        </View>

        {/* Farmer Badge & Score */}
        <View className="bg-white rounded-2xl shadow p-4 mb-4">
          <Text className="text-lg font-bold text-gray-800 mb-2">Farmer Details</Text>
          <View className="flex-row items-center mb-3">
            <FontAwesome name="certificate" size={22} color="#065f46" />
            <Text className="ml-2 text-gray-700">Badge: Gold Farmer 🌟</Text>
          </View>
          <View className="flex-row items-center mb-3">
            <FontAwesome name="star" size={22} color="#065f46" />
            <Text className="ml-2 text-gray-700">Farmer Score: 92/100</Text>
          </View>
          <View className="flex-row items-center">
            <Ionicons name="location-outline" size={22} color="#065f46" />
            <Text className="ml-2 text-gray-700">Location: Pune, Maharashtra</Text>
          </View>
        </View>

        {/* Notes Section */}
        <View className="bg-white rounded-2xl shadow p-4 mb-4">
          <Text className="text-lg font-bold text-gray-800 mb-2">Notes</Text>
          <TextInput
            placeholder="Write notes about farming, crops, or reminders..."
            multiline
            numberOfLines={4}
            className="border border-gray-300 rounded-xl p-3 text-gray-700"
          />
        </View>

        {/* Action Buttons */}
        <View className="flex-row justify-between mb-10">
          <TouchableOpacity className="flex-1 bg-[#065f46] py-3 rounded-2xl mr-2 items-center">
            <Ionicons name="create-outline" size={20} color="white" />
            <Text className="text-white mt-1 font-semibold">Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 bg-gray-700 py-3 rounded-2xl ml-2 items-center">
            <Ionicons name="log-out-outline" size={20} color="white" />
            <Text className="text-white mt-1 font-semibold">Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
