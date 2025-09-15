import { Stack } from "expo-router";

export default function ForumsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // 👈 removes the header for all forum screens
      }}
    >
      <Stack.Screen name="index" options={{ title: "" }} />
      <Stack.Screen name="Group1" />
      <Stack.Screen name="Group2" />
      <Stack.Screen name="Group3" />
    </Stack>
  );
}
