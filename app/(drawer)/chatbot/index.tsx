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
  ActivityIndicator,
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
  const [imageType, setImageType] = useState<"pest" | "disease" | null>(null);
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (messages.length > 0) flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  // Pick image from camera or gallery
  const pickImage = async (fromCamera: boolean) => {
    let result: any;
    try {
      result = fromCamera
        ? await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
            base64: true,
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
            base64: true,
          });
    } catch (e) {
      console.error("Image picker error:", e);
      return;
    }

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const base64 = result.assets[0].base64;

      setBase64Image(base64);

      // Add user image message
      const imageMessage: Message = {
        id: Date.now().toString(),
        imageUri: uri,
        sender: "user",
      };
      setMessages((prev) => [...prev, imageMessage]);
      setModalVisible(false);

      if (!imageType) return;

      setLoading(true);

      // Determine API endpoint
      const endpoint =
        imageType === "pest"
          ? "https://www.codersmitramandal.shop/sih/predict"
          : "https://www.codersmitramandal.shop/sih/plantpredict";

      const body = imageType === "pest" ? { image: base64 } : { image_base64: base64 };

      try {
        // Call detection API
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        const data = await res.json();

        const detectionText =
          imageType === "pest"
            ? `Detected pest: ${data?.pest || "No result"}`
            : `Detected disease: ${data?.predicted_class || "No result"}`;

        // Send detection result to chatbot API
        const chatRes = await fetch("https://www.codersmitramandal.shop/sih/chatbot", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            Question: `${detectionText}. Give suggestions for this and start the answer with the detected disease/pest. For district ${district} and state ${state} only if applicable, keep it short and very precise, no greeting.`,
            Phone_no: credentials.phone?.toString() || "",
            Aadhar_no: credentials.aadhaar?.toString() || "",
            ImageBase64: base64,
            ImageType: imageType || "",
          }),
        });

        const chatData = await chatRes.json();

        const botMessage: Message = {
          id: Date.now().toString() + "-bot",
          text: chatData?.answer || "No answer from chatbot",
          sender: "bot",
        };
        setMessages((prev) => [...prev, botMessage]);
      } catch (e) {
        console.error("Detection/chatbot error:", e);
        const botMessage: Message = {
          id: Date.now().toString() + "-bot-error",
          text: "Failed to get prediction or chatbot response",
          sender: "bot",
        };
        setMessages((prev) => [...prev, botMessage]);
      }

      setLoading(false);
      setImageType(null);
    }
  };

  // Send text message to chatbot
  const sendMessage = async () => {
    if (!text.trim()) return;

    const userMessage = { id: Date.now().toString(), text: text.trim(), sender: "user" as const };
    setMessages((prev) => [...prev, userMessage]);

    const question = `${text.trim()}. For district ${district} and state ${state} only if applicable. If there is no disease or pest in question, speak normally. You are a farmer chatbot.`;
    setText("");

    setLoading(true);
    try {
      const res = await fetch("https://www.codersmitramandal.shop/sih/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Question: question,
          Phone_no: credentials.phone?.toString() || "",
          Aadhar_no: credentials.aadhaar?.toString() || "",
          ImageBase64: base64Image,
        }),
      });

      const data = await res.json();

      const botMessage = {
        id: Date.now().toString() + "-bot",
        text: data?.answer || "No answer",
        sender: "bot" as const,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (e) {
      console.error("Chatbot error:", e);
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString() + "-error", text: "Something went wrong.", sender: "bot" as const },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : "padding"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 95}
    >
      <View className="flex-1">
        {/* Top Bar */}
        <View className="h-14 flex-row items-center justify-between px-3 border-b border-gray-300 bg-gray-100">
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Ionicons name="camera-outline" size={28} color="#007AFF" />
          </TouchableOpacity>
          <Text className="text-lg font-bold">Image Upload</Text>
          <View className="w-7" />
        </View>

        {/* Chat Area */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              className={`mb-3 p-2 rounded-lg max-w-[80%] ${item.sender === "user" ? "self-end bg-gray-200" : "self-start bg-blue-100"
                }`}
            >
              {item.text && <Text className="text-base">{item.text}</Text>}
              {item.imageUri && (
                <Image
                  source={{ uri: item.imageUri }}
                  style={{ width: 200, height: 200, borderRadius: 10 }}
                />
              )}
            </View>
          )}
          contentContainerStyle={{ padding: 10, flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        />

        {/* Input */}
        <View className="flex-row items-center p-2 border-t border-gray-300 bg-white">
          <TextInput
            className="flex-1 max-h-24 px-4 py-2 border border-gray-300 rounded-full text-base bg-gray-100"
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
            <TouchableOpacity className="ml-2 bg-blue-500 p-3 rounded-full" onPress={sendMessage} disabled={loading}>
              <Ionicons name="send-outline" size={22} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Modal for Pest/Disease */}
      <Modal transparent visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-lg p-6 w-80">
            {!imageType ? (
              <>
                <Text className="text-lg font-bold mb-4 text-center">Select Type</Text>
                <Pressable className="mb-3 p-3 bg-green-500 rounded" onPress={() => setImageType("pest")}>
                  <Text className="text-black text-center font-semibold">Pest</Text>
                </Pressable>
                <Pressable className="mb-3 p-3 bg-green-500 rounded" onPress={() => setImageType("disease")}>
                  <Text className="text-black text-center font-semibold">Disease</Text>
                </Pressable>
                <Pressable onPress={() => setModalVisible(false)} className="p-2">
                  <Text className="text-center text-red-500">Cancel</Text>
                </Pressable>
              </>
            ) : (
              <>
                <Text className="text-lg font-bold mb-4 text-center">
                  {imageType === "pest" ? "Pest" : "Disease"} - Select Source
                </Text>
                <Pressable className="mb-3 p-3 bg-blue-500 rounded" onPress={() => pickImage(true)}>
                  <Text className="text-white text-center font-semibold">Camera</Text>
                </Pressable>
                <Pressable className="mb-3 p-3 bg-blue-500 rounded" onPress={() => pickImage(false)}>
                  <Text className="text-white text-center font-semibold">Gallery</Text>
                </Pressable>
                <Pressable onPress={() => setImageType(null)} className="p-2">
                  <Text className="text-center text-red-500">Back</Text>
                </Pressable>
              </>
            )}
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}
