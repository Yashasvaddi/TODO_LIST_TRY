import React, { useState } from "react";
import { View, Text, TouchableOpacity, StatusBar } from "react-native";
import { Link } from "expo-router";
import { HelpCircle } from "lucide-react-native";
import { ChatInterface } from "@/components/ChatInterface";
import { UploadModal } from "@/components/UploadModal";
import { SourceViewerDrawer } from "@/components/SourceViewerDrawer";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomePage() {
  const [uploadOpen, setUploadOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCitation, setSelectedCitation] = useState<any>(null);

  const handleCitationClick = (citation: any) => {
    setSelectedCitation(citation);
    setDrawerOpen(true);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4 border-b border-gray-700 bg-gray-900/95 shadow-sm">
        <View className="flex-row items-center space-x-3">
          <View className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
            <Text className="text-white font-bold text-sm">RAG</Text>
          </View>
          <Text className="text-xl font-semibold text-white">
            Multimodal RAG
          </Text>
        </View>

        <View className="flex-row space-x-3">
          <Link href="/help" asChild>
            <TouchableOpacity className="p-2 rounded-full bg-gray-800/70">
              <HelpCircle size={22} color="#fff" />
            </TouchableOpacity>
          </Link>
        </View>
      </View>

      {/* Chat Interface */}
      <View className="flex-1 px-2">
        <ChatInterface
          onCitationClick={handleCitationClick}
          onFileAttach={() => setUploadOpen(true)}
          darkMode
        />
      </View>

      {/* Modals */}
      <UploadModal open={uploadOpen} onOpenChange={setUploadOpen} darkMode />
      <SourceViewerDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        citation={selectedCitation}
        darkMode
      />
    </SafeAreaView>
  );
}
