import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import { X } from "lucide-react-native";

export function SourceViewerDrawer({ open, onOpenChange, citation }: any) {
  if (!citation) return null;

  return (
    <Modal visible={open} transparent animationType="slide">
      <View className="flex-1 bg-black/60 justify-end">
        <View className="bg-gray-900 p-6 rounded-t-2xl max-h-[80%]">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-lg font-semibold text-white">Source Citation</Text>
            <TouchableOpacity onPress={() => onOpenChange(false)}>
              <X size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text className="font-semibold text-base text-white">{citation.filename}</Text>
          {citation.page && (
            <Text className="text-gray-400 text-sm">Page {citation.page}</Text>
          )}
          <View className="bg-gray-800 mt-4 rounded-lg p-4">
            <Text className="text-gray-300 text-sm">
              {citation.snippet || "Snippet not available"}
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}
