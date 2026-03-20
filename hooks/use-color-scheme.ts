import { useContext } from "react";
import { useColorScheme as useSystemColorScheme } from "react-native";

import { AppPreferencesContext } from "@/context/app-preferences-context";

export function useColorScheme() {
  const preferences = useContext(AppPreferencesContext);
  const systemTheme = useSystemColorScheme();

  return preferences?.theme ?? systemTheme;
}
