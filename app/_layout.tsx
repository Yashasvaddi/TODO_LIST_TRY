import { Stack, useRouter } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { useLocationStore } from '@/store/locationStore';
import * as Notifications from 'expo-notifications';
import '../global.css';
import "../i18n";

// ✅ Configure notification handler ONCE, globally
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function RootLayout() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const setLocation = useLocationStore((state) => state.setLocation);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 📍 Location setup
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") return;

        const loc = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = loc.coords;

        const [reverseGeocode] = await Location.reverseGeocodeAsync({ latitude, longitude });
        const stateName = reverseGeocode.region || "";
        const district = reverseGeocode.city || "";

        setLocation(latitude, longitude, stateName, district);
      } catch (err) {
        console.log("Error fetching location:", err);
      }
    })();
  }, []);

  // 🔔 Schedule notification after app starts
  useEffect(() => {
    (async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        console.log("Notification permission not granted");
        return;
      }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Hey Farmer 👩‍🌾",
        body: "Don't forget to check out our calculator and forums!",
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 20,
        repeats: false,
      },
    });
    })();
  }, []);

  // 🚪 Auth-based navigation
  useEffect(() => {
    if (!mounted || isAuthenticated === undefined) return;

    const target = isAuthenticated ? "/(drawer)/home" : "/(auth)/login";

    if (router.canGoBack()) {
      router.replace(target);
    }
  }, [mounted, isAuthenticated]);

  if (!mounted || isAuthenticated === undefined) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        ) : (
          <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
        )}
      </Stack>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
