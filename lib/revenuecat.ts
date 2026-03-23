// RevenueCat requires a native build (npx expo run:ios / run:android).
// This stub lets the app run in Expo Go / dev without crashing.

export function initRevenueCat() {
  // no-op until native build
}

export function usePremium(): boolean {
  return false
}

export const PRODUCTS = {
  monthly:  'debudMonthly',
  annual:   'debudAnnual',
  lifetime: 'debudLifetime',
} as const
