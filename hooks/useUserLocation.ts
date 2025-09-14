import { useEffect, useState } from "react";
import * as Location from "expo-location";
import statesData from "../app/market_prices/data/states.json";

export default function useUserLocation() {
  const [state, setState] = useState<string>("");
  const [district, setDistrict] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.log("Permission to access location denied");
          setLoading(false);
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        const reverseGeo = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        if (reverseGeo.length > 0) {
          const place = reverseGeo[0];
          console.log("Detected location:", place);

          // Match with your states.json
          const matchedState = statesData.states.find(
            (s) => s.state.toLowerCase() === (place.region || "").toLowerCase()
          );

          if (matchedState) {
            setState(matchedState.state);

            const matchedDistrict = matchedState.districts.find((d) =>
              d.toLowerCase().includes((place.city || "").toLowerCase())
            );
            if (matchedDistrict) {
              setDistrict(matchedDistrict);
            }
          }
        }
      } catch (err) {
        console.error("Error detecting location:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { state, district, loading };
}
