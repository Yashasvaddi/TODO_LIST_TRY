import { Stack, Redirect } from 'expo-router';
import { View } from 'react-native';
import { useAuthStore } from '@/store/authStore';

export default function AuthLayout() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // If user is already authenticated, redirect to main app
  if (isAuthenticated) {
    return <Redirect href="/(drawer)/home" />;
  }

  return (
    <View style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: '#fff' },
        }}
      >
        <Stack.Screen 
          name="login" 
          options={{
            title: 'Login',
            animation: 'fade',
          }}
        />
        {/* Add other auth screens here */}
      </Stack>
    </View>
  );
}
