import { CartProvider } from "@/contexts/CartContext";
import { OrderProvider } from "@/contexts/OrderContext";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "./global.css";

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    "Coiny-Regular": require("../assets/fonts/Coiny-Regular.ttf"),
  });

  useEffect(() => {
    if (error) throw error;
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error]);

  if (!fontsLoaded) return null; 

  return (
      <OrderProvider>
        <CartProvider>
          <StatusBar style='dark' backgroundColor='#ffffff' />
          <Stack screenOptions={{ headerShown: false }} />
        </CartProvider>
      </OrderProvider>
  );
}
