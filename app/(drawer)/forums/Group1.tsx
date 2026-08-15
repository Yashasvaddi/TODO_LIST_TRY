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
  Modal,
  ScrollView,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";

export default function Group1({ navigation }) {
  const [messages, setMessages] = useState([
    {
      id: "1",
      name: "Bhaswati",
      text: "Hey everyone! Welcome to the Farmers Community.",
      type: "left",
    },
    {
      id: "2",
      name: "Naresh",
      text: "Hi Alice! Happy to be here.",
      type: "left",
    },
    {
      id: "3",
      name: "Surendra",
      text: "Does anyone have tips for organic fertilizers?",
      type: "left",
    },
    {
      id: "4",
      name: "Raj",
      text: "Yes! Compost and cow dung work really well.",
      type: "left",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [summary, setSummary] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const flatListRef = useRef(null);
  const ws = useRef<WebSocket | null>(null);
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

  useEffect(() => {
    ws.current = new WebSocket("wss://codersmitramandal.shop/sih/ws/group1");

    ws.current.onopen = () => {
      console.log("✅ WebSocket connected");
    };

    ws.current.onmessage = (event) => {
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

  // 🧠 Trigger AI Summary every 5 messages
  useEffect(() => {
    if (messages.length > 0 && messages.length % 5 === 0) {
      generateSummary();
    }
  }, [messages]);

  const prompt = `you are a chat summarizer, give a summary of the the following chat: ${JSON.stringify(messages)}`;

  async function generateSummary() {
    try {
      const res = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-goog-api-key": `${process.env.EXPO_PUBLIC_GEMINI_KEY}`,
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      const data = await res.json();
      const text =
        data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
      setSummary(text);
    } catch (err) {
      console.log("Error calling GenAI:", err);
      setSummary("Error fetching response");
    }
  }

  const sendMessage = () => {
    if (inputText.trim() === "") return;

    const newMessage = {
      id: Date.now().toString(),
      name: "You",
      text: inputText,
      type: "right",
    };
    setMessages((prev) => [...prev, newMessage]);
    ws.current?.send(inputText);
    setInputText("");

    setTimeout(() => {
      flatListRef.current?.scrollToOffset({
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
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={keyboardVisible ? 90 : 0}
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
        <View className="flex-row items-center p-3 py-3 border-t border-gray-300 bg-white">
          <TextInput
            className="flex-1 max-h-24 px-4 py-3 border border-gray-300 rounded-full text-base bg-gray-100"
            placeholder="Type your message..."
            placeholderTextColor="#999"
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          {inputText.trim() === "" ? (
            <TouchableOpacity className="ml-2 bg-green-700 p-3 rounded-full">
              <Ionicons name="mic-outline" size={22} color="#fff" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              className="ml-2 bg-green-700 p-3 rounded-full"
              onPress={sendMessage}
            >
              <Ionicons name="send-outline" size={22} color="#fff" />
            </TouchableOpacity>
          )}
        </View>

        {/* Floating Button for Summary */}
        <TouchableOpacity
          className="absolute top-2 right-5 bg-green-700 p-2 rounded-full shadow-xl"
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="document-text" size={22} color="white" />
        </TouchableOpacity>

        {/* Modal */}
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent
          onRequestClose={() => setModalVisible(false)}
        >
          <View className="flex-1 bg-black/50 justify-center items-center px-4">
            <View className="w-full bg-white rounded-2xl p-6 shadow-lg">
              <Text className="text-lg font-bold mb-4">AI Summary</Text>
              <ScrollView className="max-h-64">
                <Text className="text-gray-700 text-sm">
                  {summary || "No summary yet"}
                </Text>
              </ScrollView>
              <View className="flex-row justify-end mt-4">
                <TouchableOpacity
                  className="bg-green-700 py-2 px-4 rounded-lg mr-2"
                  onPress={() =>
                    Clipboard.setStringAsync(summary || "")
                  } // ✅ fixed here
                >
                  <Text className="text-white font-medium">Copy</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="bg-gray-300 py-2 px-4 rounded-lg"
                  onPress={() => setModalVisible(false)}
                >
                  <Text className="text-gray-700 font-medium">Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </KeyboardAvoidingView>
  );
}
