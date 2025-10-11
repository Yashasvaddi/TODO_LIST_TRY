import React from "react";
import { View, Text } from "react-native";

export function Badge({ children }: any) {
  return (
    <View className="bg-gray-200 rounded-md px-2 py-1">
      <Text className="text-xs text-gray-700">{children}</Text>
    </View>
  );
}
