import { STORAGE_KEYS } from "@/constants/storage-keys";
import { safeGetItem, safeSetItem } from "./safe-storage";
import { TravelEntry } from "@/types/travel-entry";

function isValidTravelEntry(entry: unknown): entry is TravelEntry {
  if (!entry || typeof entry !== "object") {
    return false;
  }

  const candidate = entry as TravelEntry;

  return (
    typeof candidate.id === "string" &&
    typeof candidate.imageUri === "string" &&
    typeof candidate.address === "string" &&
    typeof candidate.createdAt === "string" &&
    candidate.id.trim().length > 0 &&
    candidate.imageUri.trim().length > 0 &&
    candidate.address.trim().length > 0 &&
    candidate.createdAt.trim().length > 0
  );
}

export async function loadTravelEntries(): Promise<TravelEntry[]> {
  try {
    const rawValue = await safeGetItem(STORAGE_KEYS.entries);

    if (!rawValue) {
      return [];
    }

    const parsed = JSON.parse(rawValue) as unknown;

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isValidTravelEntry);
  } catch {
    return [];
  }
}

export async function saveTravelEntries(entries: TravelEntry[]) {
  const safeEntries = entries.filter(isValidTravelEntry);
  await safeSetItem(STORAGE_KEYS.entries, JSON.stringify(safeEntries));
}
