// ChatBotScreen.tsx
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Pressable,
  Image,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useAuthStore } from "../../../store/authStore";
import { useLocationStore } from "@/store/locationStore";

export default function ChatBotScreen() {
  const credentials = useAuthStore((state) => state.credentials);
  const { state, district } = useLocationStore();

  type Message = {
    id: string;
    text?: string;
    imageUri?: string;
    sender: "user" | "bot";
  };

  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const [staticIndex, setStaticIndex] = useState(0);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  // Keyboard listeners
  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () =>
      setKeyboardVisible(true)
    );
    const hideSub = Keyboard.addListener("keyboardDidHide", () =>
      setKeyboardVisible(false)
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const staticResponses = [
    {
      imageUri: "file:///mnt/data/46f1ef0d-ebda-4497-a2d4-538afc619e73.jpg",
     text: `Detected Pest: Colorado Potato Beetle 

Description:
The Colorado Potato Beetle is a major pest that primarily attacks potato plants but can also damage tomatoes, eggplants, and peppers. 

Control Measures:
- Inspect plants daily and handpick beetles, eggs, and larvae. Drop them into soapy water to kill them.
- Apply neem oil or insecticidal soap to disrupt feeding and reproduction.
- Lady beetles, lacewings, and predatory stink bugs naturally prey on these pests.
- Avoid planting potatoes or other host plants in the same area each year to break the beetle’s life cycle.
- Use straw or organic mulch to make it harder for beetles to locate and colonize plants.
- Choose potato varieties that are less susceptible to beetle damage.` 

    },
    {
      imageUri: "file:///mnt/data/659098aa-95fa-447a-9f91-ee9e66df1862.jpg",
text: `Detected Disease: Leaf Rust 

Description:
Leaf Rust is a common fungal disease that primarily affects cereal crops such as wheat, barley, and oats. It appears as yellow-orange or reddish-brown pustules (rust spots) on the upper surface of leaves. 

Preventive Measures:
- Grow crop varieties that are bred for rust resistance.
- Avoid overhead watering to minimize leaf wetness and improve airflow between plants.
- Use recommended fungicides (e.g., Mancozeb, Propiconazole) at the first sign of infection to limit disease spread.
- Remove and destroy infected leaves or crop residues to prevent fungal spores from surviving.
- Rotate with non-host crops to break the disease cycle.
- Ensure adequate nutrition, especially nitrogen, as weak plants are more vulnerable to rust infection.`

    },
    {
      imageUri: "https://your-static-image-url.com/premature_early_blight.png",
      text: `Detected Disease: Early Blight of Potato 

Description:
Early Blight is a widespread fungal disease caused by Alternaria solani. It commonly affects potato and tomato plants, producing characteristic dark, concentric “target-like” spots on older leaves.

Preventive Measures:
- Avoid planting potatoes or tomatoes in the same field consecutively to break the fungal life cycle.
- Remove and destroy infected plant debris after harvest to reduce sources of infection.
- Plant with adequate spacing to allow good air circulation and minimize humidity around leaves.
- Apply recommended fungicides at the first sign of disease to slow down its spread.
- Maintain healthy soil with proper fertilization, especially potassium and nitrogen, to improve plant resistance.
- Where available, choose potato varieties with improved tolerance to Early Blight.`

    },
  ];

  useEffect(() => {
    if (messages.length > 0)
      flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  // Image picker
  const pickImage = async (fromCamera: boolean) => {
    try {
      const result = fromCamera
        ? await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.5,
            allowsEditing: true,
            base64: true,
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.5,
            allowsEditing: true,
            base64: true,
          });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        const base64 = result.assets[0].base64 ?? null;
        setBase64Image(base64);

        const imageMessage: Message = {
          id: Date.now().toString(),
          imageUri: uri,
          sender: "user",
        };
        setMessages((prev) => [...prev, imageMessage]);
        setModalVisible(false);

        const idx = Math.min(staticIndex, staticResponses.length - 1);
        const chosen = staticResponses[idx];
        const staticBotMessage: Message = {
          id: Date.now().toString() + "-bot",
          text: chosen.text.trim(),
          sender: "bot",
        };
        setMessages((prev) => [...prev, staticBotMessage]);
        setStaticIndex((i) => Math.min(i + 1, staticResponses.length - 1));
      }
    } catch (e) {
      console.error("Image picker error:", e);
    }
  };

  const sendMessage = async () => {
    if (!text.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: "user" as const,
    };
    setMessages((prev) => [...prev, userMessage]);
    setText("");

    const botMessage = {
      id: Date.now().toString() + "-bot",
      text: "Hello Ramesh! Welcome to Krishi Mitra, I'm here to assist you with all your farming queries.",
      sender: "bot" as const,
    };
    setMessages((prev) => [...prev, botMessage]);
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Top Bar */}
      <View className="h-14 flex-row items-center justify-between px-3 border-b border-gray-300 bg-gray-100">
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Ionicons name="camera-outline" size={28} color="#007AFF" />
        </TouchableOpacity>
        <Text className="text-lg font-bold">Image Upload</Text>
        <View className="w-7" />
      </View>

      {/* Chat Area + Input */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={keyboardVisible ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              className={`mb-2 max-w-[80%] rounded-2xl px-3 ${
                item.sender === "user"
                  ? "self-end bg-blue-500 py-2"
                  : "self-start bg-gray-100 border border-gray-200 py-2"
              }`}
              style={{
                borderBottomRightRadius: item.sender === "user" ? 4 : 16,
                borderBottomLeftRadius: item.sender === "bot" ? 4 : 16,
              }}
            >
              {item.text && (
                <Text
                  className={`text-base leading-5 ${
                    item.sender === "user" ? "text-white" : "text-gray-800"
                  }`}
                >
                  {item.text}
                </Text>
              )}

              {item.imageUri && (
                <Image
                  source={{ uri: item.imageUri }}
                  style={{
                    width: 220,
                    height: 180,
                    borderRadius: 12,
                    marginTop: item.text ? 6 : 0,
                  }}
                  resizeMode="cover"
                />
              )}
            </View>
          )}
          contentContainerStyle={{
            paddingHorizontal: 12,
            paddingVertical: 8,
          }}
          keyboardShouldPersistTaps="handled"
          style={{ flex: 1 }}
        />

        {/* Input */}
        <View className="flex-row items-center mb-1 p-3 py-3 border-t border-gray-300 bg-white">
          <TextInput
            className="flex-1 max-h-24 px-4 py-3 border border-gray-300 rounded-full text-base bg-gray-100"
            placeholder="Type a message..."
            placeholderTextColor="#999"
            value={text}
            onChangeText={setText}
            multiline
            editable={!loading}
          />
          {text.trim() === "" ? (
            <TouchableOpacity className="ml-2 bg-blue-500 p-3 rounded-full">
              <Ionicons name="mic-outline" size={22} color="#fff" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              className="ml-2 bg-blue-500 p-3 rounded-full"
              onPress={sendMessage}
              disabled={loading}
            >
              <Ionicons name="send-outline" size={22} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>

      {/* Modal for image picking */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View className="flex-1 justify-end bg-black/40">
          <View className="bg-white p-5 rounded-t-2xl shadow-lg">
            <Text className="text-center text-lg font-semibold mb-4 text-gray-800">
              Upload Image
            </Text>

            <TouchableOpacity
              onPress={() => pickImage(true)}
              className="flex-row items-center p-3 mb-3 rounded-xl bg-gray-100"
            >
              <Ionicons name="camera-outline" size={22} color="#007AFF" />
              <Text className="ml-3 text-base text-gray-800">Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => pickImage(false)}
              className="flex-row items-center p-3 mb-3 rounded-xl bg-gray-100"
            >
              <Ionicons name="image-outline" size={22} color="#007AFF" />
              <Text className="ml-3 text-base text-gray-800">
                Choose from Gallery
              </Text>
            </TouchableOpacity>

            <Pressable
              onPress={() => setModalVisible(false)}
              className="mt-2 p-3 rounded-xl bg-red-100"
            >
              <Text className="text-red-600 text-center font-medium">Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}
