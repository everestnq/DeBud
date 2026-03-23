import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { differenceInDays, parseISO, startOfDay } from 'date-fns'

interface StreakState {
  quitDate: string | null
  relapseHistory: string[]
  dailySpend: number
  setQuitDate: (date: string) => void
  setDailySpend: (amount: number) => void
  logRelapse: () => void
  resetStreak: () => void
}

export const useStreakStore = create<StreakState>()(
  persist(
    (set) => ({
      quitDate: null,
      relapseHistory: [],
      dailySpend: 0,

      setQuitDate: (date) => set({ quitDate: date }),

      setDailySpend: (amount) => set({ dailySpend: amount }),

      logRelapse: () =>
        set((state) => ({
          relapseHistory: [...state.relapseHistory, new Date().toISOString()],
          quitDate: new Date().toISOString(),
        })),

      resetStreak: () =>
        set({ quitDate: new Date().toISOString() }),
    }),
    {
      name: 'streak-store',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
)

// Computed selectors (not stored)
export function getStreakDays(quitDate: string | null): number {
  if (!quitDate) return 0
  const days = differenceInDays(
    startOfDay(new Date()),
    startOfDay(parseISO(quitDate)),
  )
  return Math.max(0, days)
}

export function getMoneySaved(quitDate: string | null, dailySpend: number): number {
  const days = getStreakDays(quitDate)
  return days * dailySpend
}
