import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import "../global.css";

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer>
        <Drawer.Screen
          name="home/index" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: 'Home',
            title: 'Home',
          }}
        />
        <Drawer.Screen
          name="chatbot/index" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: 'ChatBot',
            title: 'ChatBot',
          }}
        />
        <Drawer.Screen
          name="soil/index" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: 'Soil Health',
            title: 'Soil Health',
          }}
        />
        <Drawer.Screen
          name="market_prices/index" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: 'Market Stats',
            title: 'Market Stats',
          }}
        />
        <Drawer.Screen
          name="forums/index" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: 'Forums',
            title: 'Forums',
          }}
        />
        <Drawer.Screen
          name="profile/index" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: 'Profile',
            title: 'Profile',
          }}
        />
        <Drawer.Screen
          name="settings/index" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: 'Settings',
            title: 'Settings',
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
