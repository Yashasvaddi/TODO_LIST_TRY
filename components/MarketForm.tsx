import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import statesData from "../app/market_prices/data/states.json";
import useUserLocation from "@/hooks/useUserLocation";

interface MarketFormProps {
  selectedState: string;
  setSelectedState: (state: string) => void;
  selectedDistrict: string;
  setSelectedDistrict: (district: string) => void;
  crop: string;
  setCrop: (text: string) => void;
  items: any[];
  setItems: (data: any[]) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export default function MarketForm({
  selectedState,
  setSelectedState,
  selectedDistrict,
  setSelectedDistrict,
  crop,
  setCrop,
  items,
  setItems,
  loading,
  setLoading,
}: MarketFormProps) {
  const [stateOpen, setStateOpen] = useState(false);
  const [districtOpen, setDistrictOpen] = useState(false);
  const [districts, setDistricts] = useState<any[]>([]);

  const { state: userState, district: userDistrict, loading: locationLoading } = useUserLocation();

  useEffect(() => {
    if (userState && userState !== selectedState) {
      setSelectedState(userState);
    }
  }, [userState]);

  useEffect(() => {
    const found = statesData.states.find((s) => s.state === selectedState);
    const newDistricts = found ? found.districts.map((d) => ({ label: d, value: d })) : [];
    setDistricts(newDistricts);

    // Only set userDistrict if it's inside the new list
    if (found && userDistrict && found.districts.includes(userDistrict)) {
      setSelectedDistrict(userDistrict);
    } else if (!found) {
      setSelectedDistrict("");
    }
  }, [selectedState, userDistrict]);

  const stateItems = statesData.states.map((s) => ({
    label: s.state,
    value: s.state,
  }));

  const handleSubmit = async () => {
    if (!selectedState || !selectedDistrict) {
      Alert.alert("Error", "Please fill all fields before submitting");
      return;
    }

    setLoading(true);

    try {
      const url = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${process.env.MANDI_KEY}&format=json&filters[state.keyword]=${selectedState}&filters[district.keyword]=${selectedDistrict}&limit=20`;
      const response = await fetch(url);
      const data = await response.json();
      console.log("API response:", data);
      setItems(data.records || []);
      Alert.alert("Success", "Data fetched successfully!");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="mb-4">
      {/* State Dropdown */}
      <View style={{ zIndex: 1000, marginBottom: 16 }}>
        {locationLoading && (
          <Text className="text-gray-500 text-sm mb-2">Detecting your location...</Text>
        )}
        <Text className="text-black font-semibold mb-1">State</Text>
        <DropDownPicker
          open={stateOpen}
          value={selectedState}
          items={stateItems}
          setOpen={setStateOpen}
          setValue={setSelectedState}
          placeholder="Select a state"
          searchable={true}
          disabled={locationLoading}
          listMode="MODAL"
          style={{ backgroundColor: "#FFFFFF", borderColor: "#08CB00" }}
          dropDownContainerStyle={{ backgroundColor: "#FFFFFF", borderColor: "#08CB00" }}
        />
      </View>

      {/* District Dropdown */}
      <View style={{ zIndex: 900, marginBottom: 16 }}>
        <Text className="text-black font-semibold mb-1">District</Text>
        <DropDownPicker
          open={districtOpen}
          value={selectedDistrict}
          items={districts}
          setOpen={setDistrictOpen}
          setValue={setSelectedDistrict}
          placeholder="Select a district"
          searchable={true}
          disabled={!selectedState}
          listMode="MODAL"
          style={{ backgroundColor: "#FFFFFF", borderColor: "#08CB00" }}
          dropDownContainerStyle={{ backgroundColor: "#FFFFFF", borderColor: "#08CB00" }}
        />
      </View>

      {/* Crop */}
      <TextInput
        placeholder="Crop"
        value={crop}
        onChangeText={setCrop}
        className="p-3 mb-2 rounded-xl bg-white border"
        style={{ borderColor: "#08CB00", color: "#000000" }}
      />

      {/* Submit */}
      <TouchableOpacity
        onPress={handleSubmit}
        className={`mt-4 p-3 rounded-xl items-center ${loading ? "bg-gray-400" : "bg-[#08CB00]"}`}
        disabled={loading}
      >
        <Text className="text-white font-semibold">
          {loading ? "Loading..." : "Fetch Prices"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
