import "@/global.css";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Lato_400Regular, Lato_700Bold } from "@expo-google-fonts/lato";
import { Quicksand_400Regular, Quicksand_500Medium } from "@expo-google-fonts/quicksand";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    Lato_400Regular,
    Lato_700Bold,
    Quicksand_400Regular,
    Quicksand_500Medium,
  });

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        {/* Auth screens first - these will be the initial routes */}
        <Stack.Screen name="auth/login" options={{ headerShown: false }} />
        <Stack.Screen name="auth/register" options={{ headerShown: false }} />
        <Stack.Screen name="auth/form" options={{ headerShown: false }} />
        {/* Tabs come after auth */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}