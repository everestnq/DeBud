import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useStreakStore, getMoneySaved, getStreakDays } from '@/store/streakStore'
import { colors } from '@/constants/colors'
import { spacing, fontSize, fontWeight, shadow } from '@/constants/theme'
import { strings } from '@/constants/strings'

export default function HomeScreen() {
  const router = useRouter()
  const { quitDate, dailySpend } = useStreakStore()
  const streakDays = getStreakDays(quitDate)
  const moneySaved = getMoneySaved(quitDate, dailySpend)

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Mascot placeholder */}
        <View style={styles.mascotPlaceholder}>
          <Text style={styles.mascotEmoji}>🌱</Text>
        </View>

        {/* Streak card */}
        <View style={styles.card}>
          <Text style={styles.streakNumber}>{streakDays}</Text>
          <Text style={styles.streakLabel}>{strings.home.streakLabel}</Text>
        </View>

        {/* Savings card */}
        <View style={styles.card}>
          <Text style={styles.savingsNumber}>${moneySaved.toFixed(2)}</Text>
          <Text style={styles.streakLabel}>{strings.home.savingsLabel}</Text>
        </View>

        {/* Craving panic button */}
        <TouchableOpacity
          style={styles.cravingButton}
          onPress={() => router.push('/craving')}
          activeOpacity={0.8}
        >
          <Text style={styles.cravingButtonText}>I'm Having a Craving</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scroll: {
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.lg,
  },
  mascotPlaceholder: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.xl,
    ...shadow,
  },
  mascotEmoji: {
    fontSize: 80,
  },
  card: {
    width: '100%',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: spacing.xl,
    alignItems: 'center',
    ...shadow,
  },
  streakNumber: {
    fontSize: fontSize.hero,
    fontWeight: fontWeight.bold,
    color: colors.gold,
  },
  savingsNumber: {
    fontSize: fontSize.hero,
    fontWeight: fontWeight.bold,
    color: colors.accent,
  },
  streakLabel: {
    fontSize: fontSize.body,
    color: colors.muted,
    marginTop: spacing.xs,
  },
  cravingButton: {
    width: '100%',
    backgroundColor: colors.warm,
    borderRadius: 12,
    padding: spacing.lg,
    alignItems: 'center',
    marginTop: spacing.sm,
    ...shadow,
  },
  cravingButtonText: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
    color: colors.white,
  },
})
