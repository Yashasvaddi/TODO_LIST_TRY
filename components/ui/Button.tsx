import React from "react";
import { TouchableOpacity, Text, View } from "react-native";

export function Button({ onPress, label, icon }: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-blue-500 px-4 py-2 rounded-lg flex-row items-center"
    >
      {icon && <View className="mr-1">{icon}</View>}
      <Text className="text-white font-medium">{label}</Text>
    </TouchableOpacity>
  );
}
