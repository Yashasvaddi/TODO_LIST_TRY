import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import MarketForm from "../../components/MarketForm";
import MarketList from "../../components/MarketList";
import { Ionicons } from "@expo/vector-icons";

export default function MarketPrices() {
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [crop, setCrop] = useState("");
  const [items, setItems] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(true);

  return (
    <View className="flex-1 bg-gray-100 mt-6">
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
        {items && items.commodity && (
          <View style={{ padding: 16 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              Commodity: {items.commodity}
            </Text>
            <Text>State: {items.state}</Text>
            <Text>District: {items.district}</Text>
            <Text>Prediction Date: {items.prediction_date}</Text>
          </View>
        )}

        <FlatList
          data={items?.markets || []}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <MarketList item={item} prediction_date={items.prediction_date} />
          )}
          contentContainerStyle={{
            paddingTop: 20,
            paddingBottom: 200,
            paddingHorizontal: 8,
          }}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}
