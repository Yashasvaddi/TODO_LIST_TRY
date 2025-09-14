import React, { useState } from "react";
import { View, Button, Image, Text, ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function ImageToBase64() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [base64Data, setBase64Data] = useState<string | null>(null);
  const [response, setResponse] = useState<any>(null);

  // ✅ Unified handler for gallery/camera
  const handleImagePick = async (fromCamera: boolean) => {
    // Ask for permission
    const permission = fromCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permission.status !== "granted") {
      alert("Permission to access camera/gallery is required!");
      return;
    }

    // Launch picker/camera
    const result = fromCamera
      ? await ImagePicker.launchCameraAsync({
          base64: true,
          quality: 0.7,
        })
      : await ImagePicker.launchImageLibraryAsync({
          base64: true,
          quality: 0.7,
        });

    if (!result.canceled) {
      const asset = result.assets[0];
      setImageUri(asset.uri);
      setBase64Data(asset.base64 ?? null);

      // send image immediately
      sendImageToServer(asset.base64 ?? null);
    }
  };

  // ✅ API call
  const sendImageToServer = async (b64: string | null) => {
    if (!b64) return;

    try {
      const res = await fetch("https://www.codersmitramandal.shop/sih/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: b64 }),
      });

      const text = await res.text();
      console.log("Raw response:", text);

      try {
        const data = JSON.parse(text);
        console.log("Parsed JSON:", data);
        setResponse(data);
      } catch {
        setResponse(text); // If not JSON, just show raw text
      }
    } catch (err) {
      console.log("Error sending image:", err);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Button title="📸 Take Photo" onPress={() => handleImagePick(true)} />
      <View style={{ marginVertical: 10 }} />
      <Button title="🖼️ Pick from Gallery" onPress={() => handleImagePick(false)} />

      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          style={{ width: 300, height: 300, marginTop: 20, borderRadius: 10 }}
        />
      )}

      {base64Data && (
        <Text style={{ marginTop: 20 }}>
          Base64 (first 100 chars): {base64Data.substring(0, 100)}...
        </Text>
      )}

      {response && (
        <Text style={{ marginTop: 20 }}>
          Server response: {JSON.stringify(response, null, 2)}
        </Text>
      )}
    </ScrollView>
  );
}
