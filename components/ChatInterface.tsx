// ChatInterface.tsx
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Paperclip, Send, FileText } from "lucide-react-native"; // ✅ Works on Expo Web + Mobile

export function ChatInterface({
  onCitationClick,
  onFileAttach,
}: {
  onCitationClick?: (c: any) => void;
  onFileAttach?: () => void;
}) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages, loading]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMessage = { id: Date.now(), role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Mock AI reply
    setLoading(true);
    setTimeout(() => {
      const aiMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content:
          "This is a demo AI response. You can upload files for contextual answers.",
        citations: [
          {
            filename: "sample.pdf",
            page: 2,
            snippet: "Example snippet from the uploaded document.",
          },
        ],
      };
      setMessages((prev) => [...prev, aiMessage]);
      setLoading(false);
    }, 1200);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-[#0d0d0f]"
    >
      {/* Chat Scroll Area */}
      <ScrollView
        ref={scrollRef}
        className="flex-1 px-4 pt-4"
        contentContainerStyle={{ paddingBottom: 110 }}
      >
        {/* Empty State */}
        {messages.length === 0 && !loading && (
          <View className="flex-1 justify-center items-center py-24">
            <Text className="text-2xl font-bold text-white mb-2">
              MultiModal RAG Assistant
            </Text>
            <Text className="text-white text-center w-4/5 leading-5 text-gray-300">
              Start typing below or attach a file to ask questions.
            </Text>
          </View>
        )}

        {/* Messages */}
        {messages.map((msg) => (
          <View
            key={msg.id}
            className={`mb-4 ${
              msg.role === "user" ? "items-end" : "items-start"
            }`}
          >
            <View
              className={`max-w-[80%] px-4 py-3 rounded-2xl shadow-md ${
                msg.role === "user"
                  ? "bg-blue-600 rounded-br-none"
                  : "bg-[#1a1a1c] border border-[#2a2a2c] rounded-bl-none"
              }`}
            >
              <Text className="text-base text-white">{msg.content}</Text>

              {msg.citations?.map((c: any, i: number) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => onCitationClick?.(c)}
                  className="bg-[#232326] mt-3 p-2.5 rounded-lg border border-[#2e2e30]"
                >
                  <View className="flex-row items-center mb-1">
                    <FileText size={14} color="#9ca3af" />
                    <Text className="text-white text-xs ml-2">
                      {c.filename} {c.page && `(Page ${c.page})`}
                    </Text>
                  </View>
                  {c.snippet && (
                    <Text className="text-gray-300 text-xs italic">
                      “{c.snippet}”
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Loading indicator */}
        {loading && (
          <View className="flex-row items-center mt-3 px-2">
            <ActivityIndicator size="small" color="#60a5fa" />
            <Text className="ml-3 text-white text-sm">Thinking...</Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom Input Bar */}
      <View className="absolute bottom-0 w-full flex-row items-center px-4 py-3 bg-[#111112] border-t border-[#1e1e20]">
        <TouchableOpacity onPress={onFileAttach} className="mr-3">
          <Paperclip size={22} color="#9ca3af" />
        </TouchableOpacity>

        <TextInput
          className="flex-1 bg-[#1c1c1e] border border-[#2a2a2c] rounded-full px-4 py-2 text-white text-base"
          placeholder="Ask something..."
          placeholderTextColor="#6b7280"
          value={input}
          onChangeText={setInput}
          onSubmitEditing={handleSend}
          blurOnSubmit={false}
        />

        <TouchableOpacity
          onPress={handleSend}
          disabled={!input.trim()}
          className={`ml-3 w-11 h-11 rounded-full items-center justify-center shadow-lg ${
            input.trim() ? "bg-blue-600" : "bg-[#1f2937]"
          }`}
        >
          <Send size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
