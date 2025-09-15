import React, { useEffect, useState } from "react";
import { View, ScrollView, Text } from "react-native";
import WebMap from "../../../components/WebMap";
import LocationCrop from "@/components/LocationCrop";
import * as Location from "expo-location";
import { useLocationStore } from "@/store/locationStore";
import { LanguageStore } from "@/store/languageStore";

export default function MapPicker() {
  const { latitude: storeLat, longitude: storeLong, setLocation } = useLocationStore();
  const [coords, setCoords] = useState({ lat: storeLat ?? 19.076, lon: storeLong ?? 72.877 });
  const [details, setDetails] = useState({});
  const [apiLoad, setApiLoad] = useState(false);

  // ✅ Fetch live location once on app start
  useEffect(() => {
    (async () => {
      if (storeLat != null && storeLong != null) return; // already set
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") return;

        const loc = await Location.getCurrentPositionAsync({});
        setCoords({ lat: loc.coords.latitude, lon: loc.coords.longitude });
        setLocation(loc.coords.latitude, loc.coords.longitude, "", ""); // district/state empty for now
      } catch (err) {
        console.log("Error fetching user location:", err);
      }
    })();
  }, []);


  useEffect(() => {
    if (coords.lat == null || coords.lon == null) return;

    const fetchAllData = async () => {
      try {
        setApiLoad(true);

        const res = await fetch("https://www.codersmitramandal.shop/sih/recommend/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(coords),
        });
        const apiData = await res.json();
        console.log(apiData);
        let locationInfo = { district: "--", state: "--" };
        try {
          const [place] = await Location.reverseGeocodeAsync({ latitude: coords.lat, longitude: coords.lon });
          locationInfo = place
            ? { district: place.subregion || place.city || "--", state: place.region || "--" }
            : locationInfo;
        } catch {
          console.warn("Reverse geocode failed");
        }
        
        
        setDetails({ ...apiData, locationInfo });
      } catch (err) {
        console.log("Error fetching data:", err);
      } finally {
        setApiLoad(false);
      }
    };
    fetchAllData();
  }, [coords]);

  return (
    <View className="flex-1">
      <View style={{ flex: 0.6 }}>
        <WebMap coords={coords} setCoords={setCoords} />
      </View>
      <ScrollView style={{ flex: 0.4 }}>
        {apiLoad ? <Text>Loading.......</Text> : <LocationCrop details={details} coords={coords} />}
      </ScrollView>
    </View>
  );
}
