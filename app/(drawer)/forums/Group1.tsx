// screens/Forum/Group1.js
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Group1({ navigation }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const flatListRef = useRef(null);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Connect WebSocket
    ws.current = new WebSocket("wss://codersmitramandal.shop/sih/ws/group1");

    ws.current.onopen = () => {
      console.log("✅ WebSocket connected");
    };

    ws.current.onmessage = (event) => {
      // event.data is plain text
      const newMessage = {
        id: Date.now().toString(),
        name: "Other",
        text: event.data,
        type: "left",
      };
      setMessages((prev) => [...prev, newMessage]);
    };

    ws.current.onerror = (error) => {
      console.error("❌ WebSocket error:", error);
    };

    ws.current.onclose = () => {
      console.log("🔌 WebSocket closed");
    };

    return () => {
      ws.current?.close();
    };
  }, []);

  const sendMessage = () => {
    if (inputText.trim() === "") return;

    // Optimistically show in UI
    const newMessage = {
      id: Date.now().toString(),
      name: "You",
      text: inputText,
      type: "right",
    };
    setMessages((prev) => [...prev, newMessage]);

    // Send plain text
    ws.current?.send(inputText);

    setInputText("");

    setTimeout(() => {
      (flatListRef.current as any)?.scrollToOffset({
        offset: Number.MAX_SAFE_INTEGER,
        animated: true,
      });
    }, 100);
  };

  const renderMessage = ({ item }) => {
    const isRight = item.type === "right";

    return (
      <View
        className={`flex-row my-2 ${isRight ? "justify-end" : "justify-start"}`}
      >
        <View
          className={`max-w-[75%] px-3 py-2 rounded-2xl ${isRight
              ? "bg-green-700 rounded-br-none"
              : "bg-gray-200 rounded-bl-none"
            }`}
        >
          {!isRight && (
            <Text className="text-xs text-gray-600 mb-1">{item.name}</Text>
          )}
          <Text className={`${isRight ? "text-white" : "text-black"}`}>
            {item.text}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "padding"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 95} // adjust if header overlaps
    >
      <View className="flex-1 bg-white">
        {/* Header */}
        <View className="flex-row items-center px-4 py-3 border-b border-gray-300">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text className="ml-4 text-lg font-semibold">
            Farmers Community (Group 1)
          </Text>
        </View>

        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={{ padding: 10 }}
        />

        {/* Input Box */}
        <View className="flex-row items-center border-t border-gray-300 px-3 py-2 bg-white">
          <TextInput
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 bg-gray-100 rounded-full"
            value={inputText}
            onChangeText={setInputText}
          />
          <TouchableOpacity
            onPress={sendMessage}
            className="ml-2 bg-green-700 p-2 rounded-full"
          >
            <Ionicons name="send" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );

}
