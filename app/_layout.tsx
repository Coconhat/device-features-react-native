import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import { Colors } from "@/constants/theme";
import { AppPreferencesProvider } from "@/context/app-preferences-context";
import { TravelEntriesProvider } from "@/context/travel-entries-context";
import { useAppPreferences } from "@/hooks/use-app-preferences";
import { setupNotifications } from "@/lib/notifications";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  return (
    <AppPreferencesProvider>
      <TravelEntriesProvider>
        <RootNavigator />
      </TravelEntriesProvider>
    </AppPreferencesProvider>
  );
}

function RootNavigator() {
  const { theme, isThemeLoaded } = useAppPreferences();

  useEffect(() => {
    void setupNotifications();
  }, []);

  const navigationTheme =
    theme === "dark"
      ? {
          ...DarkTheme,
          colors: {
            ...DarkTheme.colors,
            background: Colors.dark.background,
            card: Colors.dark.card,
            text: Colors.dark.text,
            border: Colors.dark.border,
            primary: Colors.dark.tint,
          },
        }
      : {
          ...DefaultTheme,
          colors: {
            ...DefaultTheme.colors,
            background: Colors.light.background,
            card: Colors.light.card,
            text: Colors.light.text,
            border: Colors.light.border,
            primary: Colors.light.tint,
          },
        };

  if (!isThemeLoaded) {
    return null;
  }

  return (
    <ThemeProvider value={navigationTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>
      <StatusBar style={theme === "dark" ? "light" : "dark"} />
    </ThemeProvider>
  );
}
