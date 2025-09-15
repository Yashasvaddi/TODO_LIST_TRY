import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../../../store/authStore";
import { useLocationStore } from "@/store/locationStore";

export default function ChatBotScreen() {
  const credentials = useAuthStore((state) => state.credentials);
  const { state, district } = useLocationStore();

  const [messages, setMessages] = useState<
    { text: string; sender: "user" | "bot" }[]
  >([]);
  const [text, setText] = useState("");
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (messages.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!text.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: "user" as const,
    };
    setMessages((prev) => [...prev, userMessage]);

    const question = `${text.trim()}. for district ${district} and state ${state} if applicable`;
    setText("");

    try {
      const res = await fetch("https://www.codersmitramandal.shop/sih/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Question: question,
          Phone_no: credentials.phone.toString() || "",
          Aadhar_no: credentials.aadhaar.toString() || "",
        }),
      });
      
      let data;
      try {
        data = await res.json();
      } catch {
        data = { answer: "Invalid server response" };
      }

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
    }
  };



  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >
      {/* Container */}
      <View className="flex-1">
        {/* Top Bar */}
        <View className="h-14 flex-row items-center justify-between px-3 border-b border-gray-300 bg-gray-100">
          <TouchableOpacity>
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
              className={`mb-3 p-2 rounded-lg max-w-[80%] ${item.sender === "user"
                ? "self-end bg-gray-200"
                : "self-start bg-blue-100"
                }`}
            >
              <Text className="text-base">{item.text}</Text>
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
          />
          {text.trim() === "" ? (
            <TouchableOpacity className="ml-2 bg-blue-500 p-3 rounded-full">
              <Ionicons name="mic-outline" size={22} color="#fff" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              className="ml-2 bg-blue-500 p-3 rounded-full"
              onPress={sendMessage}
            >
              <Ionicons name="send-outline" size={22} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
