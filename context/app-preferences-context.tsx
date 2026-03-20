import {
  createContext,
  PropsWithChildren,
  useEffect,
  useMemo,
  useState,
} from "react";

import { STORAGE_KEYS } from "@/constants/storage-keys";
import { AppTheme } from "@/types/travel-entry";
import { safeGetItem, safeSetItem } from "../lib/safe-storage";

type AppPreferencesContextValue = {
  theme: AppTheme;
  isThemeLoaded: boolean;
  toggleTheme: () => Promise<void>;
};

export const AppPreferencesContext =
  createContext<AppPreferencesContextValue | null>(null);

export function AppPreferencesProvider({ children }: PropsWithChildren) {
  const [theme, setTheme] = useState<AppTheme>("light");
  const [isThemeLoaded, setIsThemeLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadTheme() {
      try {
        const storedTheme = await safeGetItem(STORAGE_KEYS.theme);

        if (!isMounted) {
          return;
        }

        if (storedTheme === "light" || storedTheme === "dark") {
          setTheme(storedTheme);
        }
      } finally {
        if (isMounted) {
          setIsThemeLoaded(true);
        }
      }
    }

    void loadTheme();

    return () => {
      isMounted = false;
    };
  }, []);

  const value = useMemo<AppPreferencesContextValue>(
    () => ({
      theme,
      isThemeLoaded,
      toggleTheme: async () => {
        const nextTheme: AppTheme = theme === "light" ? "dark" : "light";
        setTheme(nextTheme);
        await safeSetItem(STORAGE_KEYS.theme, nextTheme);
      },
    }),
    [isThemeLoaded, theme],
  );

  return (
    <AppPreferencesContext.Provider value={value}>
      {children}
    </AppPreferencesContext.Provider>
  );
}
