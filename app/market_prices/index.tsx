import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import MarketForm from "../../components/MarketForm";
import MarketList from "../../components/MarketList";
import { Ionicons } from "@expo/vector-icons";

export default function MarketPrices() {
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [crop, setCrop] = useState("");
  const [variety, setVariety] = useState("");

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(true);

  return (
    <View className="flex-1 bg-gray-100 mt-6">
      {/* Header */}

      {/* Collapsible Form Card */}
      <View className="mx-4 bg-white rounded-3xl border border-gray-400 overflow-hidden mb-4">
        <TouchableOpacity
          className="px-6 py-4 flex-row justify-center items-center"
          onPress={() => setCollapsed(!collapsed)}
        >
          <Text className="font-semibold text-lg text-center flex-1">Filters</Text>
          <Ionicons
            name={collapsed ? "chevron-down-outline" : "chevron-up-outline"}
            size={24}
            className="ml-2"
          />
        </TouchableOpacity>

        {!collapsed && (
          <View className="p-6 border-t border-gray-200">
            <MarketForm
              selectedState={selectedState}
              setSelectedState={setSelectedState}
              selectedDistrict={selectedDistrict}
              setSelectedDistrict={setSelectedDistrict}
              crop={crop}
              setCrop={setCrop}
              variety={variety}
              setVariety={setVariety}
              items={items}
              setItems={setItems}
              loading={loading}
              setLoading={setLoading}
            />
          </View>
        )}
      </View>

      {/* List */}
      <View className="flex-1 bg-white/60 backdrop-blur-sm rounded-t-3xl shadow-lg border-t border-green-100">
        <FlatList
          data={items}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => <MarketList item={item} />}
          contentContainerStyle={{ paddingTop: 20, paddingBottom: 200, paddingHorizontal: 4 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            !loading && (
              <View className="items-center justify-center py-16">
                <View className="bg-gray-100 rounded-full w-20 h-20 items-center justify-center mb-4">
                  <Text className="text-4xl">📊</Text>
                </View>
                <Text className="text-gray-600 text-lg font-medium text-center">
                  No records found
                </Text>
                <Text className="text-gray-400 text-sm text-center mt-2">
                  Try adjusting your search criteria
                </Text>
              </View>
            )
          }
        />
      </View>
    </View>
  );
}
