// import { useEffect, useState } from "react";
// import * as Device from "expo-device";
// import { Platform } from "react-native";

// export function useNotifications() {
//   const [expoPushToken, setExpoPushToken] = useState<string | null>(null);

//   useEffect(() => {
//     registerForPushNotificationsAsync().then((token) => {
//       if (token) setExpoPushToken(token);
//       console.log("Expo Push Token:", token);
//     });
//   }, []);

//   return expoPushToken;
// }

// async function registerForPushNotificationsAsync() {
//   let token;

//   if (Device.isDevice) {
//     const existingPermission = (await Notifications.getPermissionsAsync()) as any;
//     let granted =
//       existingPermission?.granted === true ||
//       existingPermission?.status === "granted";
//     if (!granted) {
//       const requestedPermission = (await Notifications.requestPermissionsAsync()) as any;
//       granted =
//         requestedPermission?.granted === true ||
//         requestedPermission?.status === "granted";
//     }
//     if (!granted) {
//       alert("Failed to get push token for push notification!");
//       return;
//     }
//     token = (await Notifications.getExpoPushTokenAsync()).data;
//   } else {
//     alert("Must use physical device for Push Notifications");
//   }

//   if (Platform.OS === "android") {
//     Notifications.setNotificationChannelAsync("default", {
//       name: "default",
//       importance: Notifications.AndroidImportance.MAX,
//       vibrationPattern: [0, 250, 250, 250],
//       lightColor: "#FF231F7C",
//     });
//   }

//   return token;
// }
