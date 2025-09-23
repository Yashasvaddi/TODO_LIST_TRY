import React, { useRef, useState } from "react";
import { View, Text, FlatList, Image, Dimensions, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

interface Card {
  image: any;
  text: string;
}

interface HelpScreenProps {
  setHelpVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function HelpScreen({ setHelpVisible }: HelpScreenProps) {
  const carouselData: Card[] = [
    {
      image: require("@/assets/help/HomeHelp1.png"),
      text: `This is the main hub of Krishi Mitra.
You can:
-> Quickly access all features of the app.
-> Stay updated on farming information.
-> Keep track of your daily farm tasks with task list.
-> Receive everyday tips and videos to improve your yield.`,
    },
    {
      image: require("@/assets/help/HomeHelp2.png"),
      text: "Check the latest Market Prices to plan selling decisions efficiently.",
    },
  ];

  const flatListRef = useRef<FlatList>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const onScroll = (event: any) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(slideIndex);
  };

  return (
    <View className="flex-1 bg-green-50 items-center justify-center">
      {/* Close Button */}
      <Pressable
        className="absolute top-6 right-4 z-50 bg-green-700 p-2 rounded-full"
        onPress={() => setHelpVisible(false)}
      >
        <Ionicons name="close" size={24} color="#fff" />
      </Pressable>

      <Text className="text-2xl font-bold text-green-700 mt-6 mb-6">
        Krishi Mitra Home Page
      </Text>

      <FlatList
        ref={flatListRef}
        data={carouselData}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={{ paddingHorizontal: width * 0.025 }}
        renderItem={({ item }) => (
          <View
            className="bg-white rounded-2xl shadow-lg mx-2 items-center p-4"
            style={{ width: width * 0.95, height: height * 0.84 }}
          >
            <Image
              source={item.image}
              className="w-full flex-1"
              resizeMode="contain"
            />
            <Text className="text-green-800 font-semibold text-md mt-4">
              {item.text}
            </Text>
          </View>
        )}
      />

      {/* Pagination dots */}
      <View className="flex-row mt-4">
        {carouselData.map((_, index) => (
          <View
            key={index}
            className={`h-2 w-2 rounded-full mx-1 ${index === activeIndex ? "bg-green-700" : "bg-green-300"}`}
          />
        ))}
      </View>
    </View>
  );
}
