import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { differenceInDays, isSameDay, parseISO } from 'date-fns'

interface LessonsState {
  completedLessons: string[]
  xp: number
  lessonStreak: number
  lastLessonDate: string | null
  completeLesson: (id: string, xpEarned: number) => void
}

export const useLessonsStore = create<LessonsState>()(
  persist(
    (set) => ({
      completedLessons: [],
      xp: 0,
      lessonStreak: 0,
      lastLessonDate: null,

      completeLesson: (id, xpEarned) =>
        set((state) => {
          if (state.completedLessons.includes(id)) return state

          const today = new Date()
          const lastDate = state.lastLessonDate
            ? parseISO(state.lastLessonDate)
            : null

          let newStreak = state.lessonStreak
          if (!lastDate) {
            newStreak = 1
          } else if (isSameDay(lastDate, today)) {
            // Already logged today, no streak change
          } else if (differenceInDays(today, lastDate) === 1) {
            newStreak += 1
          } else {
            newStreak = 1
          }

          return {
            completedLessons: [...state.completedLessons, id],
            xp: state.xp + xpEarned,
            lessonStreak: newStreak,
            lastLessonDate: today.toISOString(),
          }
        }),
    }),
    {
      name: 'lessons-store',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
)
