import React, { useState, useMemo } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, FlatList, Modal } from "react-native";
import statesData from "../app/market_prices/data/states.json";
import { useLocationStore } from "../store/locationStore";
import useUserLocation from "@/hooks/useUserLocation";

interface MarketFormProps {
  crop: string;
  setCrop: (text: string) => void;
  setItems: (data: any) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export default function MarketForm({
  crop,
  setCrop,
  setItems,
  loading,
  setLoading,
}: MarketFormProps) {
  const { state, district, setState, setDistrict } = useLocationStore();
  const { loading: locationLoading } = useUserLocation();

  const [stateDropdownVisible, setStateDropdownVisible] = useState(false);
  const [districtDropdownVisible, setDistrictDropdownVisible] = useState(false);

  const districts = useMemo(() => {
    const found = statesData.states.find((s) => s.state === state);
    return found ? found.districts : [];
  }, [state]);

  const handleSubmit = async () => {
    if (!state || !district || !crop) {
      Alert.alert("Error", "Please fill all fields before submitting");
      return;
    }

    setLoading(true);
    try {
      console.log(state, district);
      
      const apiBody = { state, district, commodity: crop };
      const response = await fetch("https://www.codersmitramandal.shop/sih/marketprice/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiBody),
      });
      const data = await response.json();
      setItems(data || {});
      console.log("Fetched:", data);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  const renderDropdown = (visible: boolean, setVisible: any, options: string[], onSelect: (val: string) => void) => (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableOpacity
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.3)", justifyContent: "center", alignItems: "center" }}
        activeOpacity={1}
        onPress={() => setVisible(false)}
      >
        <View style={{ width: 260, backgroundColor: "#fff", borderRadius: 12, maxHeight: 320 }}>
          <FlatList
            data={options}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{ padding: 14, borderBottomColor: "#eee", borderBottomWidth: 1 }}
                onPress={() => {
                  onSelect(item);
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
        {locationLoading && <Text style={{ color: "#777" }}>Detecting location…</Text>}
        <Text style={{ fontWeight: "600", fontSize: 16, marginBottom: 6 }}>State</Text>
        <TouchableOpacity
          onPress={() => setStateDropdownVisible(true)}
          style={{ padding: 14, backgroundColor: "#f9f9f9", borderColor: "#08CB00", borderWidth: 1, borderRadius: 12 }}
        >
          <Text style={{ fontSize: 15, color: state ? "#000" : "#aaa" }}>{state || "Select a state"}</Text>
        </TouchableOpacity>
        {renderDropdown(stateDropdownVisible, setStateDropdownVisible, statesData.states.map(s => s.state), setState)}
      </View>

      {/* District Picker */}
      <View style={{ marginBottom: 16 }}>
        <Text style={{ fontWeight: "600", fontSize: 16, marginBottom: 6 }}>District</Text>
        <TouchableOpacity
          onPress={() => setDistrictDropdownVisible(true)}
          style={{ padding: 14, backgroundColor: "#f9f9f9", borderColor: "#08CB00", borderWidth: 1, borderRadius: 12 }}
          disabled={!state}
        >
          <Text style={{ fontSize: 15, color: district ? "#000" : "#aaa" }}>{district || "Select a district"}</Text>
        </TouchableOpacity>
        {renderDropdown(districtDropdownVisible, setDistrictDropdownVisible, districts, setDistrict)}
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
        onPress={handleSubmit}
        disabled={loading || !state || !district || !crop}
        style={{
          padding: 14,
          borderRadius: 12,
          backgroundColor: loading || !state || !district || !crop ? "#ccc" : "#08CB00",
          alignItems: "center",
        }}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: "#fff", fontWeight: "600", fontSize: 16 }}>Fetch Prices</Text>}
      </TouchableOpacity>
    </View>
  );
}
