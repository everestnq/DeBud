import { useEffect } from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { initRevenueCat } from '@/lib/revenuecat'
import { createNotificationChannel } from '@/lib/notifications'
import { colors } from '@/constants/colors'

const queryClient = new QueryClient()

export default function RootLayout() {
  useEffect(() => {
    initRevenueCat()
    createNotificationChannel()
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="dark" backgroundColor={colors.bg} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen
          name="craving"
          options={{ presentation: 'fullScreenModal' }}
        />
      </Stack>
    </QueryClientProvider>
  )
}
