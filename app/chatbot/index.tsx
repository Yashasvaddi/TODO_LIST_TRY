import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ChatbotScreen() {
  const [messages, setMessages] = useState([
    { id: "1", text: "Hello! How can I help you today?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMsg = { id: Date.now().toString(), text: input, sender: "user" };
    setMessages([...messages, newMsg]);
    setInput("");
  };

  return (
    <View className="flex-1 bg-gray-100">
      {/* Chat messages */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            className={`m-2 p-3 rounded-xl max-w-[70%] ${
              item.sender === "user" ? "bg-blue-500 self-end border" : "bg-white self-start border"
            }`}
          >
            <Text className={item.sender === "user" ? "text-white" : "text-secondary"}>
              {item.text}
            </Text>
          </View>
        )}
      />

      {/* Input area */}
      <View className="flex-row items-center p-3 bg-white border-t border-gray-200">
        <TouchableOpacity className="p-2">
          <Ionicons name="mic" size={24} color="gray" />
        </TouchableOpacity>

        <TouchableOpacity className="p-2 ml-1">
          <Ionicons name="image" size={24} color="gray" />
        </TouchableOpacity>

        <TextInput
          className="flex-1 mx-2 p-2 bg-gray-100 rounded-lg"
          placeholder="Type a message..."
          value={input}
          onChangeText={setInput}
        />

        <TouchableOpacity className="p-2 bg-blue-500 rounded-full" onPress={sendMessage}>
          <Ionicons name="send" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
