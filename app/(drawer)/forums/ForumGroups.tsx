// screens/Forum/ForumGroups.js
import React from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";

export default function ForumGroups({ navigation }: {navigation:any}) {
  const groups = [
    { name: "Group 1", desc: "General farming discussions", route: "Group1" },
    { name: "Group 2", desc: "Crop-specific queries", route: "Group2" },
    { name: "Group 3", desc: "Techniques & best practices", route: "Group3" },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {groups.map((g, i) => (
        <TouchableOpacity
          key={i}
          style={styles.card}
          onPress={() => navigation.navigate(g.route)}
        >
          <Text style={styles.title}>{g.name}</Text>
          <Text style={styles.desc}>{g.desc}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 10,
  },
  card: {
    backgroundColor: "#1B5E20", // deep green
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 4, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  desc: {
    color: "#f1f1f1",
    fontSize: 14,
  },
});
