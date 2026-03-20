import {
  createContext,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  loadTravelEntries,
  saveTravelEntries,
} from "@/lib/travel-entry-storage";
import { TravelEntry } from "@/types/travel-entry";

type AddTravelEntryInput = {
  imageUri: string;
  address: string;
};

type TravelEntriesContextValue = {
  entries: TravelEntry[];
  isLoaded: boolean;
  addEntry: (
    input: AddTravelEntryInput,
  ) => Promise<{ ok: boolean; error?: string }>;
  removeEntry: (id: string) => Promise<void>;
};

export const TravelEntriesContext =
  createContext<TravelEntriesContextValue | null>(null);

export function TravelEntriesProvider({ children }: PropsWithChildren) {
  const [entries, setEntries] = useState<TravelEntry[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function hydrateEntries() {
      const storedEntries = await loadTravelEntries();

      if (isMounted) {
        setEntries(storedEntries);
        setIsLoaded(true);
      }
    }

    void hydrateEntries();

    return () => {
      isMounted = false;
    };
  }, []);

  const addEntry = useCallback(
    async (input: AddTravelEntryInput) => {
      const imageUri = input.imageUri.trim();
      const address = input.address.trim();

      if (!imageUri) {
        return { ok: false, error: "Please capture a photo before saving." };
      }

      if (!address) {
        return {
          ok: false,
          error: "Unable to resolve your current address. Please try again.",
        };
      }

      const newEntry: TravelEntry = {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        imageUri,
        address,
        createdAt: new Date().toISOString(),
      };

      const nextEntries = [newEntry, ...entries];
      setEntries(nextEntries);
      await saveTravelEntries(nextEntries);

      return { ok: true };
    },
    [entries],
  );

  const removeEntry = useCallback(
    async (id: string) => {
      const trimmedId = id.trim();

      if (!trimmedId) {
        return;
      }

      const nextEntries = entries.filter((entry) => entry.id !== trimmedId);

      setEntries(nextEntries);
      await saveTravelEntries(nextEntries);
    },
    [entries],
  );

  const value = useMemo<TravelEntriesContextValue>(
    () => ({
      entries,
      isLoaded,
      addEntry,
      removeEntry,
    }),
    [addEntry, entries, isLoaded, removeEntry],
  );

  return (
    <TravelEntriesContext.Provider value={value}>
      {children}
    </TravelEntriesContext.Provider>
  );
}
