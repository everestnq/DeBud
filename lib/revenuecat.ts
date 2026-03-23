import Purchases, { LOG_LEVEL } from 'react-native-purchases'
import { Platform } from 'react-native'
import { useEffect, useState } from 'react'

const RC_API_KEY_IOS = process.env.EXPO_PUBLIC_RC_IOS_KEY ?? ''
const RC_API_KEY_ANDROID = process.env.EXPO_PUBLIC_RC_ANDROID_KEY ?? ''

export function initRevenueCat() {
  const apiKey = Platform.OS === 'ios' ? RC_API_KEY_IOS : RC_API_KEY_ANDROID
  if (!apiKey) return
  Purchases.setLogLevel(LOG_LEVEL.ERROR)
  Purchases.configure({ apiKey })
}

export function usePremium() {
  const [isPremium, setIsPremium] = useState(false)

  useEffect(() => {
    let cancelled = false

    Purchases.getCustomerInfo()
      .then((info) => {
        if (!cancelled) {
          setIsPremium('debudPremium' in info.entitlements.active)
        }
      })
      .catch(() => {
        /* offline — default to false */
      })

    return () => {
      cancelled = true
    }
  }, [])

  return isPremium
}

export const PRODUCTS = {
  monthly:  'debudMonthly',
  annual:   'debudAnnual',
  lifetime: 'debudLifetime',
} as const
