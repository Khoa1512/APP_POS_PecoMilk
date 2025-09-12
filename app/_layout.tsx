import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import "./global.css";
import { useEffect } from 'react';

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    "Coiny-Regular": require("../assets/fonts/Coiny-Regular.ttf"),
  });
  useEffect(() => {
    if (error) throw error;
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error]);
  return <Stack screenOptions={{ headerShown: false }} />;
}
