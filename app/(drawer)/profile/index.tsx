// app/profile/index.tsx
import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { useLocationStore } from "@/store/locationStore";

export default function ProfileScreen() {
  const { district, state } = useLocationStore();

  return (
    <ScrollView className="flex-1 bg-gray-100">
      {/* Header Banner */}
      <View className="bg-[#065f46] h-40 justify-center items-center">
        <Image
          source={{
            uri: "https://www.pikpng.com/pngl/m/80-805068_my-profile-icon-blank-profile-picture-circle-clipart.png",
          }}
          className="w-20 h-20 rounded-full"
        />
        <Text className="text-white text-xl font-bold mt-2">
          Ramesh Gokhale
        </Text>
      </View>

      {/* Profile Details */}
      <View className="px-6 mt-6">
        {/* Contact Info */}
        <View className="bg-blue-100 rounded-2xl shadow p-4 mb-4">
          <Text className="text-lg font-bold text-gray-800 mb-2">
            Contact Info
          </Text>
          <View className="flex-row items-center mb-2">
            <Ionicons name="mail-outline" size={20} color="#065f46" />
            <Text className="ml-2 text-gray-900">
              RameshGokhale123@gmail.com
            </Text>
          </View>
          <View className="flex-row items-center">
            <Ionicons name="call-outline" size={20} color="#065f46" />
            <Text className="ml-2 text-gray-900">+91 98765 43210</Text>
          </View>
        </View>

        {/* Farmer Badge & Score */}
        <View className="bg-green-100 rounded-2xl shadow p-4 mb-4">
          <Text className="text-lg font-bold text-gray-800 mb-2">
            Farmer Details
          </Text>
          <View className="flex-row items-center mb-3">
            <FontAwesome name="certificate" size={22} color="#FF0000" />
            <Text className="ml-2 text-gray-700">Badge: Gold Farmer 🌟</Text>
          </View>
          <View className="flex-row items-center mb-3">
            <FontAwesome name="star" size={22} color="#FF0000" />
            <Text className="ml-2 text-gray-700">Farmer Score: 92/100</Text>
          </View>
          <View className="flex-row items-center">
            <Ionicons name="location" size={22} color="#FF0000" />
            <Text className="ml-2 text-gray-700">
              Location: {district}, {state}
            </Text>
          </View>
        </View>

        {/* Notes Section */}
        <View className="bg-yellow-100 rounded-2xl shadow p-4 mb-4">
          <Text className="text-lg font-bold text-gray-800 mb-2">Notes</Text>
          <TextInput
            placeholder="Write notes about farming, crops..."
            multiline
            numberOfLines={4}
            className="bg-white border border-gray-300 rounded-3xl p-4 text-gray-700"
          />
        </View>

        {/* Reminders Section */}
        <View className="bg-red-100 rounded-2xl shadow p-4 mb-4">
          <Text className="text-lg font-bold text-gray-800 mb-2">Reminders</Text>

          {/* Input box */}
          <TextInput
            placeholder="Add a new reminder"
            className="bg-white border border-gray-300 rounded-3xl p-4 text-gray-700 mb-3"
          />

          {/* Example Reminders List (static for now) */}
          <View className="space-y-2">
            <View className="flex-row items-center justify-between bg-green-50 p-3 rounded-xl">
              <Text className="text-gray-800">Water the crops - Daily 6 AM</Text>
              <Ionicons name="alarm-outline" size={20} color="#065f46" />
            </View>
            <View className="flex-row items-center mt-3 justify-between bg-green-50 p-3 rounded-xl">
              <Text className="text-gray-800">Fertilizer spray - 20 Sept</Text>
              <Ionicons name="alarm-outline" size={20} color="#065f46" />
            </View>
          </View>

          {/* Add Reminder Button */}
          <TouchableOpacity className="flex-row items-center bg-[#065f46] py-2 px-3 mt-4 rounded-xl justify-center">
            <Ionicons name="add-circle-outline" size={22} color="white" />
            <Text className="ml-2 text-white font-semibold">Add Reminder</Text>
          </TouchableOpacity>
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
