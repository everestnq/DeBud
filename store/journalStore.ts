import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

export interface MoodEntry {
  id: string
  date: string    // ISO string
  mood: 1 | 2 | 3 | 4 | 5
  note?: string
}

export interface CravingEntry {
  id: string
  date: string    // ISO string
  trigger?: string
  intensity: 1 | 2 | 3 | 4 | 5
}

interface JournalState {
  moodEntries: MoodEntry[]
  cravingLog: CravingEntry[]
  addMoodEntry: (entry: MoodEntry) => void
  addCravingEntry: (entry: CravingEntry) => void
}

export const useJournalStore = create<JournalState>()(
  persist(
    (set) => ({
      moodEntries: [],
      cravingLog: [],

      addMoodEntry: (entry) =>
        set((state) => ({ moodEntries: [entry, ...state.moodEntries] })),

      addCravingEntry: (entry) =>
        set((state) => ({ cravingLog: [entry, ...state.cravingLog] })),
    }),
    {
      name: 'journal-store',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
)
