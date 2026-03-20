import { useContext } from 'react';

import { TravelEntriesContext } from '@/context/travel-entries-context';

export function useTravelEntries() {
  const context = useContext(TravelEntriesContext);

  if (!context) {
    throw new Error('useTravelEntries must be used within TravelEntriesProvider');
  }

  return context;
}
