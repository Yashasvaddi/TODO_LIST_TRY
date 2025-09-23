import React from "react";
import { View, Text } from "react-native";

interface MarketProps {
  item: {
    market: string;
    predicted_next_day_price: number;
    latest_min_price: number;
    latest_max_price: number;
    last_known_date: string;
  };
  prediction_date: string; // ✅ added this
}

export default function MarketList({ item, prediction_date }: MarketProps) {
  return (
    <View
      style={{
        backgroundColor: "#fff",
        borderColor: "#08CB00",
        borderWidth: 1,
        borderRadius: 20,
        padding: 12,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      {/* Market Title */}
      <Text style={{ color: "#222", fontWeight: "700", fontSize: 16 }}>
        {item.market}
      </Text>
      <Text style={{ color: "#888", fontSize: 11, marginBottom: 8 }}>
        (Price per Quintal)
      </Text>

      {/* Predicted Price */}
      <Text style={{ color: "#087700", fontWeight: "800", fontSize: 14 }}>
        Predicted Price:{" "}
        <Text style={{ color: "#000" }}>₹ {item.predicted_next_day_price.toFixed(2)}</Text>
      </Text>

      {/* Min / Max */}
      <Text style={{ color: "#444", marginTop: 4, fontSize: 11 }}>
        Min: ₹{item.latest_min_price} | Max: ₹{item.latest_max_price}
      </Text>

      {/* Dates */}
      <View style={{ marginTop: 8 }}>
        <Text style={{ color: "#666", fontSize: 11 }}>
          Last Known: {item.last_known_date}
        </Text>
      </View>
    </View>
  );
}
