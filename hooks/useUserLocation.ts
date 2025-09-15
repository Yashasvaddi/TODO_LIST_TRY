import { useEffect, useState } from "react";
import * as Location from "expo-location";
import statesData from "../app/(drawer)/market_prices/data/states.json";
import { useLocationStore } from "../store/locationStore";

export default function useUserLocation() {
  const { setLocation } = useLocationStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.log("Permission denied");
          setLoading(false);
          return;
        }

        const loc = await Location.getCurrentPositionAsync({});
        const reverseGeo = await Location.reverseGeocodeAsync({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });

        if (reverseGeo.length > 0) {
          const place = reverseGeo[0];

          const matchedState = statesData.states.find(
            (s) => s.state.toLowerCase() === (place.region || "").toLowerCase()
          );

          const matchedDistrict =
            matchedState?.districts.find((d) =>
              d.toLowerCase().includes((place.city || "").toLowerCase())
            ) || "";

          setLocation(
            loc.coords.latitude,
            loc.coords.longitude,
            matchedState?.state || "",
            matchedDistrict
          );
        }
      } catch (err) {
        console.error("Error fetching location:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { loading };
}
