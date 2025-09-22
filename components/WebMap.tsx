import React, { useEffect, useRef } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { WebView } from "react-native-webview";
import { useLocationStore } from "@/store/locationStore";

interface WebMapProps {
  coords: { lat: number; lon: number };
  setCoords: React.Dispatch<React.SetStateAction<{ lat: number; lon: number }>>;
}

export default function WebMap({ coords, setCoords }: WebMapProps) {
  const webviewRef = useRef<WebView>(null);

  // Zustand stored coordinates (do not update these)
  const { latitude: storeLat, longitude: storeLong } = useLocationStore();

  // Fallback coordinates (Mumbai)
  const initialLat = storeLat ?? 19.076;
  const initialLon = storeLong ?? 72.877;

  // Function to send coordinates to WebView and update marker
  const sendCoordsToWebView = (lat: number, lon: number) => {
    const jsCode = `
      if(window.map){
        map.setView([${lat}, ${lon}], 13, {animate:true});
        if(window.marker) map.removeLayer(window.marker);
        window.marker = L.marker([${lat}, ${lon}]).addTo(map);
      }
    `;
    webviewRef.current?.injectJavaScript(jsCode);
  };

  // Update marker whenever local coords change
  useEffect(() => {
    if (coords.lat && coords.lon) sendCoordsToWebView(coords.lat, coords.lon);
  }, [coords]);

  return (
    <View className="flex-1 m-2">
      {/* Map */}
      <WebView
        ref={webviewRef}
        originWhitelist={["*"]}
        source={{
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
              <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
            </head>
            <body class="m-0 p-0">
              <div id="map" style="width:100%; height:100vh;"></div>
              <script>
                const map = L.map('map').setView([${initialLat}, ${initialLon}], 13);
                window.map = map;

                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                  attribution: '© OpenStreetMap contributors'
                }).addTo(map);

                window.marker = L.marker([${initialLat}, ${initialLon}]).addTo(map);

                map.on('click', function(e) {
                  const { lat, lng } = e.latlng;
                  if(window.marker) map.removeLayer(window.marker);
                  window.marker = L.marker([lat, lng]).addTo(map);
                  window.ReactNativeWebView.postMessage(JSON.stringify({ lat, lon: lng }));
                });
              </script>
            </body>
            </html>
          `,
        }}
        onMessage={(event) => {
          const data = JSON.parse(event.nativeEvent.data);
          setCoords(data); // update local marker coordinates
        }}
      />

      {/* Controls */}
      <View className="p-4 bg-white">
        <Text className="text-gray-800 mb-2 font-extralight text-sm">
          Selected Lat: {coords.lat?.toFixed(6) ?? "--"}, lon: {coords.lon?.toFixed(6) ?? "--"}
        </Text>

        <TouchableOpacity
          onPress={() => {
            if (storeLat != null && storeLong != null) {
              setCoords({ lat: storeLat, lon: storeLong }); // reset marker to Zustand values
            }
          }}
          disabled={storeLat == null || storeLong == null}
          className={`mt-2 p-3 rounded-3xl items-center ${
            storeLat == null ? "bg-gray-400" : "bg-green-600"
          }`}
        >
          <Text className="text-white font-semibold">Go back to my Location</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
