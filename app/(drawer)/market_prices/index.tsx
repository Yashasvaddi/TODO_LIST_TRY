import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import MarketForm from "../../../components/MarketForm";
import MarketList from "../../../components/MarketList";
import { Ionicons } from "@expo/vector-icons";
import { useLocationStore } from "@/store/locationStore";

export default function MarketPrices() {
  const { state, district } = useLocationStore();

  const [selectedState, setSelectedState] = useState(state);
  const [selectedDistrict, setSelectedDistrict] = useState(district);
  const [crop, setCrop] = useState("");
  const [items, setItems] = useState<any>(null); // ✅ start with null
  const [loading, setLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(true);

  return (
    <View className="flex-1 bg-gray-100 mt-6">
      {/* Collapsible Form Card */}
      <View className="mx-4 bg-white rounded-3xl border border-gray-400 overflow-hidden mb-4">
        <TouchableOpacity
          activeOpacity={1}
          className="px-6 py-4 flex-row justify-center items-center"
          onPress={() => setCollapsed(!collapsed)}
        >
          <Text className="font-semibold text-lg text-center flex-1">
            Filters
          </Text>
          <Ionicons
            name={collapsed ? "chevron-down-outline" : "chevron-up-outline"}
            size={24}
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
              setItems={setItems}
              loading={loading}
              setLoading={setLoading}
            />
          </View>
        )}
      </View>

      {/* List */}
      <View className="flex-1 bg-white rounded-3xl mx-2">
        {items && items.commodity ? (
          <>
            <View style={{ padding: 16 }}>
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                Commodity: {items.commodity}
              </Text>
              <Text>State: {items.state}</Text>
              <Text>District: {items.district}</Text>
              <Text>Prediction Date: 2025-09-24</Text>
            </View>

            <FlatList
              data={items.markets || []}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <MarketList
                  item={item}
                  prediction_date={items.prediction_date}
                />
              )}
              contentContainerStyle={{
                paddingTop: 20,
                paddingBottom: 200,
                paddingHorizontal: 8,
              }}
              showsVerticalScrollIndicator={false}
            />
          </>
        ) : (
          <View className="flex-1 justify-center items-center mb-20">
            <Text className="mb-4"><Ionicons name="search-outline" size={100} /></Text>
            <Text className="text-gray-500 text-base">
              Couldn’t find market data
            </Text>
            <Text className="text-gray-500 text-base">
              Try different filters.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
