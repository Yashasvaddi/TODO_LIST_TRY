import React, { useState, useMemo } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, FlatList, Modal } from "react-native";
import statesData from "../app/(drawer)/market_prices/data/states.json";

type MarketItem = {
  market: string;
  predicted_next_day_price: number;
  latest_min_price: number;
  latest_max_price: number;
  last_known_date: string;
};

type MarketResult = {
  commodity: string;
  state: string;
  district: string;
  prediction_date: string;
  markets: MarketItem[];
};

interface MarketFormProps {
  crop: string;
  setCrop: (text: string) => void;
  setItems: (data: MarketResult) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  selectedState: string;
  setSelectedState: (val: string) => void;
  selectedDistrict: string;
  setSelectedDistrict: (val: string) => void;
}

export default function MarketForm({
  crop,
  setCrop,
  setItems,
  loading,
  setLoading,
  selectedState,
  setSelectedState,
  selectedDistrict,
  setSelectedDistrict,
}: MarketFormProps) {
  const [stateDropdownVisible, setStateDropdownVisible] = useState(false);
  const [districtDropdownVisible, setDistrictDropdownVisible] = useState(false);

  const districts = useMemo(() => {
    const found = statesData.states.find((s) => s.state === selectedState);
    return found ? found.districts : [];
  }, [selectedState]);

  const buildMockMarketData = (
    state: string,
    district: string,
    commodity: string
  ): MarketResult => {
    const markets = [
      `${district} Main Mandi`,
      `${district} Rural Yard`,
      `${state} Agri Hub`,
    ];
    const seed = `${state}-${district}-${commodity}`.length;
    const basePrice = 1500 + seed * 12;

    return {
      commodity,
      state,
      district,
      prediction_date: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
      markets: markets.map((market, index) => {
        const drift = (index + 1) * 35;
        const predicted = basePrice + drift;
        return {
          market,
          predicted_next_day_price: predicted,
          latest_min_price: predicted - 90,
          latest_max_price: predicted + 110,
          last_known_date: new Date().toISOString().slice(0, 10),
        };
      }),
    };
  };

  const handleSubmit = async () => {
    if (!selectedState || !selectedDistrict || !crop) {
      Alert.alert("Error", "Please fill all fields before submitting");
      return;
    }

    setLoading(true);
    try {
      const data = buildMockMarketData(selectedState, selectedDistrict, crop.trim());
      setItems(data);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to generate local market data.");
    } finally {
      setLoading(false);
    }
  };

  const renderDropdown = (
    visible: boolean,
    setVisible: any,
    options: string[],
    onSelect?: (val: string) => void
  ) => (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableOpacity
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.3)",
          justifyContent: "center",
          alignItems: "center",
        }}
        activeOpacity={1}
        onPress={() => setVisible(false)}
      >
        <View
          style={{
            width: 260,
            backgroundColor: "#fff",
            borderRadius: 12,
            maxHeight: 320,
          }}
        >
          <FlatList
            data={options}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{
                  padding: 14,
                  borderBottomColor: "#eee",
                  borderBottomWidth: 1,
                }}
                onPress={() => {
                  if (onSelect) onSelect(item);
                  setVisible(false);
                }}
              >
                <Text style={{ fontSize: 16 }}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );

  return (
    <View style={{ marginBottom: 20 }}>
      {/* State Picker */}
      <View style={{ marginBottom: 16 }}>
        <Text style={{ fontWeight: "600", fontSize: 16, marginBottom: 6 }}>State</Text>
        <TouchableOpacity
        activeOpacity={1}
          onPress={() => setStateDropdownVisible(true)}
          style={{
            padding: 14,
            backgroundColor: "#f9f9f9",
            borderColor: "#08CB00",
            borderWidth: 1,
            borderRadius: 12,
          }}
        >
          <Text style={{ fontSize: 15, color: selectedState ? "#000" : "#aaa" }}>
            {selectedState || "Select a state"}
          </Text>
        </TouchableOpacity>
        {renderDropdown(
          stateDropdownVisible,
          setStateDropdownVisible,
          statesData.states.map((s) => s.state),
          (val) => {
            setSelectedState(val);
            setSelectedDistrict(""); // reset district when state changes
          }
        )}
      </View>

      {/* District Picker */}
      <View style={{ marginBottom: 16 }}>
        <Text style={{ fontWeight: "600", fontSize: 16, marginBottom: 6 }}>District</Text>
        <TouchableOpacity
          onPress={() => setDistrictDropdownVisible(true)}
          style={{
            padding: 14,
            backgroundColor: "#f9f9f9",
            borderColor: "#08CB00",
            borderWidth: 1,
            borderRadius: 12,
          }}
          disabled={!selectedState}
        >
          <Text style={{ fontSize: 15, color: selectedDistrict ? "#000" : "#aaa" }}>
            {selectedDistrict || "Select a district"}
          </Text>
        </TouchableOpacity>
        {renderDropdown(
          districtDropdownVisible,
          setDistrictDropdownVisible,
          districts,
          (val) => setSelectedDistrict(val)
        )}
      </View>

      {/* Crop Input */}
      <TextInput
        placeholder="Crop"
        value={crop}
        onChangeText={setCrop}
        style={{
          padding: 14,
          borderRadius: 12,
          backgroundColor: "#f9f9f9",
          borderWidth: 1,
          borderColor: "#08CB00",
          fontSize: 15,
          marginBottom: 20,
        }}
      />

      {/* Submit */}
      <TouchableOpacity
        activeOpacity={1}
        onPress={handleSubmit}
        disabled={loading || !selectedState || !selectedDistrict || !crop}
        style={{
          padding: 14,
          borderRadius: 12,
          backgroundColor: loading || !selectedState || !selectedDistrict || !crop ? "#ccc" : "#08CB00",
          alignItems: "center",
        }}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: "#fff", fontWeight: "600", fontSize: 16 }}>Fetch Prices</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
