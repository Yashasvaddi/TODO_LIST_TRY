import React, { useState } from "react";
import { Modal, View, TouchableOpacity, Image, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ShowVideoProps {
  source: any; // Local asset via require(...)
}

export default function ShowVideo({ source }: ShowVideoProps) {
  const [visible, setVisible] = useState(false);

  return (
    <>
      {/* Header Button */}
      <TouchableOpacity onPress={() => setVisible(true)}>
        <Ionicons name="videocam-outline" size={24} color="white" className="mr-4" />
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <View className="flex-1 bg-black/80 justify-center items-center">
          <View className="items-center" style={styles.container}>
            <Text className="text-white mb-10 text-2xl font-bold p-4 bg-black border rounded-full">Here's how this page works</Text>
            {/* GIF / Video */}
            {visible && (
              <Image
                key={Date.now()}
                source={source} // require('../assets/videos/home.gif')
                style={styles.video} // fixed size
                resizeMode="contain"
              />
            )}

            {/* Close Button */}
            <TouchableOpacity
              onPress={() => setVisible(false)}
              className="mt-4 bg-gray-800 px-4 py-2 rounded-lg"
            >
              <Ionicons name="close" size={28} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 720,   // fixed width
    height: 480,  // fixed height
    alignItems: "center",
    justifyContent: "center",
  },
  video: {
    width: 720,   // fixed width for video/GIF
    height: 480,  // fixed height
    borderRadius: 12,
  },
});
