export type MascotState =
  | 'seed'
  | 'seedling'
  | 'growing'
  | 'blooming'
  | 'thriving'
  | 'wilted'
  | 'worried'
  | 'happy'
  | 'celebrating'

export function getMascotState(
  streakDays: number,
  hasCheckedInToday: boolean,
): MascotState {
  if (!hasCheckedInToday && streakDays > 0) return 'worried'
  if (streakDays === 0) return 'seed'
  if (streakDays < 3) return 'seedling'
  if (streakDays < 7) return 'growing'
  if (streakDays < 30) return 'blooming'
  return 'thriving'
}
