import { Stack } from "expo-router";

export default function ForumsLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ title: "" }} 
      />
      <Stack.Screen 
        name="Group1" 
        options={{ title: "Group 1" }} 
      />
      <Stack.Screen 
        name="Group2" 
        options={{ title: "Group 2" }} 
      />
      <Stack.Screen 
        name="Group3" 
        options={{ title: "Group 3" }} 
      />
    </Stack>
  );
}
