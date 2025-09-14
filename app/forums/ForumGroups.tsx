// screens/Forum/ForumGroups.js
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

export default function ForumGroups({ navigation }: {navigation:any}) {
  return (
    <View className="flex-1 bg-white items-center justify-center px-6">

      <TouchableOpacity
        className="w-full bg-green-700 py-3 rounded-lg mb-3 items-center"
        onPress={() => navigation.navigate("Group1")}
      >
        <Text className="text-white text-lg">Group 1</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="w-full bg-green-700 py-3 rounded-lg mb-3 items-center"
        onPress={() => navigation.navigate("Group2")}
      >
        <Text className="text-white text-lg">Group 2</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="w-full bg-green-700 py-3 rounded-lg items-center"
        onPress={() => navigation.navigate("Group3")}
      >
        <Text className="text-white text-lg">Group 3</Text>
      </TouchableOpacity>
    </View>
  );
}
