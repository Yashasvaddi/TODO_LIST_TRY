import React, { useState, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import WebMap from './../../components/WebMap';
import LocationCrop from "@/components/LocationCrop";
import { ScrollView } from "react-native";
import * as Location from "expo-location";

export default function MapPicker() {

  const [coords, setCoords] = useState({ lat: 19.076, lon: 72.877 }); // Mumbai default
  const [details, setDetails] = useState({})
  const [apiLoad, setApiLoad] = useState(false)

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setApiLoad(true)
        // 📌 1. Call your backend
        const res = await fetch("https://www.codersmitramandal.shop/sih/recommend/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(coords),
        });
        const apiData = await res.json();

        // 📌 2. Reverse geocode
        const [place] = await Location.reverseGeocodeAsync({
          latitude: coords.lat,
          longitude: coords.lon,
        });

        const locationInfo = place
          ? {
            district: place.subregion || place.city || "--",
            state: place.region || "--",
          }
          : { district: "--", state: "--" };

        // 📌 3. Merge data
        setDetails({
          ...apiData,
          locationInfo,
        });

        console.log("Final details:", {
          ...apiData,
          locationInfo,
        });
      } catch (err) {
        console.log("Error fetching:", err);
      }
      setApiLoad(false)
    };

    fetchAllData();
  }, [coords]);


  return (
    <View className="flex-1">
      <View style={{ flex: 0.6 }}>
        <WebMap coords={coords} setCoords={setCoords} />
      </View>
      <ScrollView style={{ flex: 0.4 }} >
        {
          apiLoad ? <Text>Loading.......</Text>:<LocationCrop details={details} coords={coords} setCoords={setCoords} />
        }
      </ScrollView>
    </View>
  );
}
