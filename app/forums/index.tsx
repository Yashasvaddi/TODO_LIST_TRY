import React, { useState, useRef } from "react";
import { View, Text, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Initial messages
const initialMessages = [
  { id: "1", name: "Ramesh", text: "Namaste, did you check today's crop prices?", type: "left" },
  { id: "2", name: "Sita", text: "Yes, wheat is ₹2200 per quintal now!", type: "left" },
  { id: "3", name: "You", text: "That's great, should we sell now or wait?", type: "right" },
  { id: "4", name: "Mahesh", text: "I think waiting could fetch a better price.", type: "left" },
  { id: "5", name: "Radha", text: "But storage is limited. We might need to sell some part today.", type: "left" },
  { id: "6", name: "You", text: "True, balancing is key. Let's plan together.", type: "right" },
];

const FarmerChat = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [inputText, setInputText] = useState("");

  // ✅ Provide initial value 'null' and specify FlatList type
  const flatListRef = useRef<FlatList>(null);

  const sendMessage = () => {
    if (inputText.trim() === "") return;

    const newMessage = {
      id: Date.now().toString(),
      name: "You",
      text: inputText,
      type: "right",
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInputText("");

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const renderMessage = ({ item }: { item: { id: string; name: string; text: string; type: string } }) => {
    const isRight = item.type === "right";

    return (
      <View className={`flex-row my-2 ${isRight ? "justify-end" : "justify-start"}`}>
        <View className={`max-w-[75%] px-3 py-2 rounded-2xl ${isRight ? "bg-green-700 rounded-br-none" : "bg-gray-200 rounded-bl-none"}`}>
          {!isRight && (
            <Text className="text-xs text-gray-600 mb-1">{item.name}</Text>
          )}
          <Text className={`${isRight ? "text-white" : "text-black"}`}>{item.text}</Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View className="flex-1 bg-white">
        {/* Header */}
        <View className="flex-row items-center px-4 py-3 border-b border-gray-300">
          <Ionicons name="arrow-back" size={24} color="black" />
          <Text className="ml-4 text-lg font-semibold">Farmers Community</Text>
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
          <TouchableOpacity onPress={sendMessage} className="ml-2 bg-green-700 p-2 rounded-full">
            <Ionicons name="send" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default FarmerChat;
