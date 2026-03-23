import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useStreakStore, getStreakDays, getMoneySaved } from '@/store/streakStore'
import { useLessonsStore } from '@/store/lessonsStore'
import { useJournalStore } from '@/store/journalStore'
import { colors } from '@/constants/colors'
import { spacing, fontSize, fontWeight, shadow } from '@/constants/theme'
import { strings } from '@/constants/strings'

const MILESTONES = [1, 3, 7, 14, 30, 60, 90, 180, 365]

export default function ProgressScreen() {
  const { quitDate, dailySpend } = useStreakStore()
  const { xp, completedLessons } = useLessonsStore()
  const { cravingLog } = useJournalStore()

  const streakDays = getStreakDays(quitDate)
  const moneySaved = getMoneySaved(quitDate, dailySpend)
  const nextMilestone = MILESTONES.find((m) => m > streakDays) ?? 365

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>{strings.tabs.progress}</Text>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{streakDays}</Text>
            <Text style={styles.statLabel}>Days</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>${moneySaved.toFixed(0)}</Text>
            <Text style={styles.statLabel}>Saved</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{xp}</Text>
            <Text style={styles.statLabel}>XP</Text>
          </View>
        </View>

        {/* Next milestone */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Next Milestone</Text>
          <Text style={styles.milestoneText}>{nextMilestone} days</Text>
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${Math.min(
                    100,
                    (streakDays / nextMilestone) * 100,
                  )}%`,
                },
              ]}
            />
          </View>
          <Text style={styles.progressLabel}>
            {streakDays} / {nextMilestone} days
          </Text>
        </View>

        {/* Milestones list */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Milestones</Text>
          {MILESTONES.map((m) => (
            <View key={m} style={styles.milestoneRow}>
              <Text style={styles.milestoneBadge}>
                {streakDays >= m ? '✅' : '○'}
              </Text>
              <Text
                style={[
                  styles.milestoneDays,
                  streakDays >= m && styles.milestoneDaysReached,
                ]}
              >
                {m} day{m === 1 ? '' : 's'}
              </Text>
            </View>
          ))}
        </View>

        {/* Quick stats */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Activity</Text>
          <Text style={styles.activityLine}>
            {completedLessons.length} lesson{completedLessons.length === 1 ? '' : 's'} completed
          </Text>
          <Text style={styles.activityLine}>
            {cravingLog.length} craving{cravingLog.length === 1 ? '' : 's'} logged
          </Text>
        </View>
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
    gap: spacing.lg,
  },
  title: {
    fontSize: fontSize.title,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: spacing.md,
    alignItems: 'center',
    ...shadow,
  },
  statValue: {
    fontSize: 22,
    fontWeight: fontWeight.bold,
    color: colors.primary,
  },
  statLabel: {
    fontSize: fontSize.caption,
    color: colors.muted,
    marginTop: spacing.xs,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: spacing.lg,
    gap: spacing.sm,
    ...shadow,
  },
  cardLabel: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.medium,
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  milestoneText: {
    fontSize: 20,
    fontWeight: fontWeight.bold,
    color: colors.primary,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#E8F0EC',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 8,
    backgroundColor: colors.accent,
    borderRadius: 4,
  },
  progressLabel: {
    fontSize: fontSize.caption,
    color: colors.muted,
    textAlign: 'right',
  },
  milestoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  milestoneBadge: {
    fontSize: 16,
  },
  milestoneDays: {
    fontSize: fontSize.body,
    color: colors.muted,
  },
  milestoneDaysReached: {
    color: colors.primary,
    fontWeight: fontWeight.semibold,
  },
  activityLine: {
    fontSize: fontSize.body,
    color: colors.text,
  },
})
