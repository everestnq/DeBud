import { differenceInDays, parseISO, startOfDay } from 'date-fns'

export function getStreakDays(quitDate: string | null): number {
  if (!quitDate) return 0
  const days = differenceInDays(
    startOfDay(new Date()),
    startOfDay(parseISO(quitDate)),
  )
  return Math.max(0, days)
}

export function getMoneySaved(quitDate: string | null, dailySpend: number): number {
  return getStreakDays(quitDate) * dailySpend
}

export function hasCheckedInToday(lastCheckIn: string | null): boolean {
  if (!lastCheckIn) return false
  const diff = differenceInDays(new Date(), parseISO(lastCheckIn))
  return diff === 0
}
