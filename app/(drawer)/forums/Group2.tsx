// screens/Forum/Group2.js
import React, { useState, useRef } from "react";
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
import { useRouter } from "expo-router";

const initialMessages = [
  { id: "1", name: "Amit", text: "Anyone tried organic fertilizers?", type: "left" },
  { id: "2", name: "Priya", text: "Yes! They really improved my soil health.", type: "left" },
  { id: "3", name: "You", text: "Do they cost more than chemical ones?", type: "right" },
  { id: "4", name: "Amit", text: "A bit, but long-term benefits are better.", type: "left" },
];

export default function Group2() {
  const router = useRouter();
  const [messages, setMessages] = useState(initialMessages);
  const [inputText, setInputText] = useState("");
  const flatListRef = useRef(null);

  const sendMessage = () => {
    if (inputText.trim() === "") return;
    const newMessage = { id: Date.now().toString(), name: "You", text: inputText, type: "right" };
    setMessages((prev) => [...prev, newMessage]);
    setInputText("");
    setTimeout(() => (flatListRef.current as any)?.scrollToOffset({ offset: Number.MAX_SAFE_INTEGER, animated: true }), 100);
  };

  const renderMessage = ({ item }: {item: any}) => {
    const isRight = item.type === "right";
    return (
      <View className={`flex-row my-2 ${isRight ? "justify-end" : "justify-start"}`}>
        <View className={`max-w-[75%] px-3 py-2 rounded-2xl ${isRight ? "bg-green-700 rounded-br-none" : "bg-gray-200 rounded-bl-none"}`}>
          {!isRight && <Text className="text-xs text-gray-600 mb-1">{item.name}</Text>}
          <Text className={`${isRight ? "text-white" : "text-black"}`}>{item.text}</Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View className="flex-1 bg-white">
        <View className="flex-row items-center px-4 py-3 border-b border-gray-300">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text className="ml-4 text-lg font-semibold">Organic Farming (Group 2)</Text>
        </View>

        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={{ padding: 10 }}
        />

        <View className="flex-row items-center border-t border-gray-300 px-3 py-2 bg-white mb-10">
          <TextInput
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 bg-gray-100 rounded-full"
            value={inputText}
            onChangeText={setInputText}
          />
          <TouchableOpacity onPress={sendMessage} className="ml-2 bg-green-700 p-2 rounded-full">
            <Ionicons name="send" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
