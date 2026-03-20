import AsyncStorage from "@react-native-async-storage/async-storage";

type StorageLike = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
};

const inMemoryStore = new Map<string, string>();

async function memoryGetItem(key: string): Promise<string | null> {
  return inMemoryStore.has(key) ? (inMemoryStore.get(key) ?? null) : null;
}

async function memorySetItem(key: string, value: string): Promise<void> {
  inMemoryStore.set(key, value);
}

const storageFallback: StorageLike = {
  getItem: memoryGetItem,
  setItem: memorySetItem,
};

function isMissingNativeModuleError(error: unknown) {
  if (!(error instanceof Error)) {
    return false;
  }

  const message = error.message.toLowerCase();
  return (
    message.includes("native module is null") ||
    message.includes("cannot access legacy storage") ||
    message.includes("asyncstorage is null")
  );
}

export async function safeGetItem(key: string) {
  try {
    return await AsyncStorage.getItem(key);
  } catch (error) {
    if (!isMissingNativeModuleError(error)) {
      throw error;
    }

    return storageFallback.getItem(key);
  }
}

export async function safeSetItem(key: string, value: string) {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    if (!isMissingNativeModuleError(error)) {
      throw error;
    }

    await storageFallback.setItem(key, value);
  }
}
