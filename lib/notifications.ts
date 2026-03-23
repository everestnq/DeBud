import * as Notifications from 'expo-notifications'
import { Platform } from 'react-native'
import { strings } from '@/constants/strings'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
})

export async function requestPermissions(): Promise<boolean> {
  const { status: existing } = await Notifications.getPermissionsAsync()
  if (existing === 'granted') return true

  const { status } = await Notifications.requestPermissionsAsync()
  return status === 'granted'
}

export async function scheduleDailyCheckIn(hour = 20, minute = 0) {
  await Notifications.cancelScheduledNotificationAsync('daily-checkin').catch(
    () => {},
  )

  await Notifications.scheduleNotificationAsync({
    identifier: 'daily-checkin',
    content: {
      title: 'DeBud',
      body: strings.notifications.dailyCheckIn,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  })
}

export async function scheduleStreakRiskReminder() {
  await Notifications.cancelScheduledNotificationAsync('streak-risk').catch(
    () => {},
  )

  await Notifications.scheduleNotificationAsync({
    identifier: 'streak-risk',
    content: {
      title: 'DeBud',
      body: strings.notifications.streakAtRisk,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 22,
      minute: 0,
    },
  })
}

export async function sendMilestoneNotification(days: number) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'DeBud',
      body: strings.notifications.milestone(days),
    },
    trigger: null,
  })
}

export async function scheduleLessonReminder(afterHours = 24) {
  await Notifications.cancelScheduledNotificationAsync('lesson-reminder').catch(
    () => {},
  )

  const triggerDate = new Date(Date.now() + afterHours * 60 * 60 * 1000)

  await Notifications.scheduleNotificationAsync({
    identifier: 'lesson-reminder',
    content: {
      title: 'DeBud',
      body: strings.notifications.lessonReady,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: triggerDate,
    },
  })
}

export function createNotificationChannel() {
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
    })
  }
}
