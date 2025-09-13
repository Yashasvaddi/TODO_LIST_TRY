import React, { useState, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import * as Location from "expo-location";
import { WebView } from "react-native-webview";

interface cropProps {
    coords: {
        lat: number;
        lon: number;
    };
    setCoords: React.Dispatch<React.SetStateAction<{ lat: number; lon: number }>>;
}
export default function WebMap({ coords, setCoords }: cropProps) {
    const [loading, setLoading] = useState(false);

    const webviewRef = useRef<WebView>(null);
    
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

    useEffect(() => {
        if (coords.lat && coords.lon) {
            sendCoordsToWebView(coords.lat, coords.lon);
        }
    }, [coords]);

    const fetchLocation = async () => {
        setLoading(true);
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                Alert.alert("Permission denied", "Allow location access to use this feature");
                setLoading(false);
                return;
            }

            let location = await Location.getLastKnownPositionAsync({});
            if (!location) {
                location = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.Balanced,
                    timeout: 5000,
                });
            }

            const { latitude, longitude } = location.coords;
            setCoords({ lat: latitude, lon: longitude });
            sendCoordsToWebView(latitude, longitude);
        } catch (err) {
            console.log(err);
            Alert.alert("Error", "Could not fetch location");
        }
        setLoading(false);
    };

    return (
        <View className="flex-1">
            <View style={{ flex: 1 }}>
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
              const map = L.map('map').setView([19.076, 72.877], 13);
              window.map = map;

              L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
              }).addTo(map);

              window.marker = L.marker([19.076, 72.877]).addTo(map);

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
                        setCoords(data);
                    }}
                />
            </View>
            <View className="p-4 bg-white">
                <Text className="text-gray-800 mb-2 font-extralight text-sm">
                    Selected Lat: {coords.lat.toFixed(6)}, lon: {coords.lon.toFixed(6)}
                </Text>
                <View className="flex flex-row justify-between ">
                    <TouchableOpacity
                        onPress={fetchLocation}
                        className={`mt-2 p-3 rounded-xl items-center ${loading ? "bg-gray-400" : "bg-green-600"
                            }`}
                        disabled={loading}
                    >
                        <Text className="text-white font-semibold">
                            {loading ? "Loading..." : "Fetch My Location"}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            setCoords({ lat: 19.076, lon: 72.877 });
                            sendCoordsToWebView(19.076, 72.877);
                        }}
                        className="mt-2 p-3 rounded-xl items-center bg-blue-600"
                    >
                        <Text className="text-white font-semibold">Reset to Mumbai</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
