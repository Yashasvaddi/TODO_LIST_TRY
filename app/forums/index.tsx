// screens/Forum/index.js
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ForumGroups from "./ForumGroups";
import Group1 from "./Group1";
import Group2 from "./Group2";
import Group3 from "./Group3";

const Stack = createNativeStackNavigator();

export default function ForumStack() {
  return (
    <Stack.Navigator
      initialRouteName="ForumGroups"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="ForumGroups" component={ForumGroups} />
      <Stack.Screen name="Group1" component={Group1} />
      <Stack.Screen name="Group2" component={Group2} />
      <Stack.Screen name="Group3" component={Group3} />
    </Stack.Navigator>
  );
}
