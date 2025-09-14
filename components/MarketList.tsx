// MarketList.tsx
import React from "react";
import { View, Text } from "react-native";

interface MarketListProps {
  item: any[];
}

export default function MarketList({item}: MarketListProps ) {
  return (
    <View
      style={{
        backgroundColor: "#FFFFFF",
        borderColor: "#08CB00",
        borderWidth: 1,
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
      }}
    >
      <Text style={{ color: "#253900", fontWeight: "600", fontSize: 16 }}>
        {item.commodity} ({item.variety})
      </Text>
      <Text style={{ color: "#000000" }}>State: {item.state}</Text>
      <Text style={{ color: "#000000" }}>District: {item.district}</Text>
      <Text style={{ color: "#000000" }}>Market name: {item.market}</Text>
      <Text style={{ color: "#08CB00", fontWeight: "700", marginTop: 4 }}>
        ₹ {item.modal_price}
      </Text>
    </View>
  );
}
