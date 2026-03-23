import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { useStreakStore, getStreakDays, getMoneySaved } from '@/store/streakStore'
import { useLessonsStore } from '@/store/lessonsStore'
import { useJournalStore } from '@/store/journalStore'
import { colors } from '@/constants/colors'
import { format, addDays, parseISO } from 'date-fns'

interface Milestone {
  days: number
  label: string
  sub: string
  state: 'done' | 'next' | 'future'
  date?: string
}

function buildMilestones(streakDays: number, quitDate: string | null): Milestone[] {
  const milestones = [
    { days: 1, label: '1 Day Clean', sub: 'The hardest day' },
    { days: 7, label: '1 Week Clean', sub: 'Sleep starts improving' },
    { days: 14, label: '2 Weeks Clean', sub: 'Mental fog lifting' },
    { days: 30, label: '30 Days Clean 🌸', sub: 'Bud blooms fully' },
    { days: 60, label: '60 Days Clean', sub: 'Habit fully rewired' },
    { days: 90, label: '90 Days Clean', sub: 'New normal unlocked' },
  ]

  const nextIdx = milestones.findIndex((m) => m.days > streakDays)

  return milestones.map((m, i) => {
    const isDone = streakDays >= m.days
    const isNext = i === nextIdx

    let date: string | undefined
    if (isDone && quitDate) {
      date = format(addDays(parseISO(quitDate), m.days), 'MMM d')
    } else if (isNext) {
      date = `${m.days - streakDays} days`
    }

    return {
      ...m,
      state: isDone ? 'done' : isNext ? 'next' : 'future',
      date,
    }
  })
}

export default function ProgressScreen() {
  const { quitDate, dailySpend } = useStreakStore()
  const { completedLessons } = useLessonsStore()
  const { cravingLog } = useJournalStore()

  const streakDays = getStreakDays(quitDate)
  const moneySaved = getMoneySaved(quitDate, dailySpend)
  const nextMilestone = [1, 7, 14, 30, 60, 90].find((m) => m > streakDays) ?? 90
  const milestoneProgress = Math.min(100, (streakDays / nextMilestone) * 100)
  const savingsGoal = 150
  const savingsProgress = Math.min(100, (moneySaved / savingsGoal) * 100)
  const milestones = buildMilestones(streakDays, quitDate)

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Progress</Text>
            <Text style={styles.subtitle}>{streakDays} days and counting</Text>
          </View>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{streakDays}</Text>
            <Text style={styles.statLabel}>Days clean</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{cravingLog.length}</Text>
            <Text style={styles.statLabel}>Cravings beat</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{completedLessons.length}</Text>
            <Text style={styles.statLabel}>Lessons done</Text>
          </View>
        </View>

        {/* Next milestone progress */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>🎯 Next milestone</Text>
            <Text style={styles.progressPct}>{Math.round(milestoneProgress)}%</Text>
          </View>
          <View style={styles.progressBarBg}>
            <LinearGradient
              colors={[colors.accent, colors.primary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressBarFill, { width: `${milestoneProgress}%` }]}
            />
          </View>
          <Text style={styles.progressSub}>
            {nextMilestone - streakDays} days until {nextMilestone}-day milestone 🌸
          </Text>
        </View>

        {/* Savings goal */}
        <View style={[styles.progressCard, styles.progressCardMt]}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>💰 Savings goal</Text>
            <Text style={styles.progressPct}>${moneySaved.toFixed(0)} / ${savingsGoal}</Text>
          </View>
          <View style={styles.progressBarBg}>
            <LinearGradient
              colors={['#F0B429', '#E07A36']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressBarFill, { width: `${savingsProgress}%` }]}
            />
          </View>
          <Text style={styles.progressSub}>
            ${Math.max(0, savingsGoal - moneySaved).toFixed(0)} away from your savings goal 🍽
          </Text>
        </View>

        <Text style={styles.sectionHeading}>Milestones</Text>

        <View style={styles.milestoneList}>
          {milestones.map((m) => (
            <View
              key={m.days}
              style={[styles.milestoneItem, m.state === 'next' && styles.milestoneItemNext, m.state === 'future' && styles.milestoneItemFuture]}
            >
              <View style={[styles.msCheck, m.state === 'done' && styles.msCheckDone, m.state === 'next' && styles.msCheckNext, m.state === 'future' && styles.msCheckFuture]}>
                <Text style={styles.msCheckText}>{m.state === 'done' ? '✓' : m.state === 'next' ? '→' : '○'}</Text>
              </View>
              <View style={styles.msInfo}>
                <Text style={styles.msTitle}>{m.label}</Text>
                <Text style={styles.msSub}>{m.sub}</Text>
              </View>
              {m.date ? (
                <Text style={[styles.msDate, m.state === 'next' && styles.msDateNext]}>
                  {m.date}
                </Text>
              ) : null}
            </View>
          ))}
        </View>

        <View style={styles.spacer} />
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
    paddingBottom: 16,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginHorizontal: 16,
    marginTop: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 12,
    paddingHorizontal: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 10,
    color: colors.muted,
    fontWeight: '500',
    marginTop: 2,
    textAlign: 'center',
  },
  progressCard: {
    marginHorizontal: 16,
    marginTop: 10,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  progressCardMt: {
    marginTop: 10,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  progressPct: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.accent,
  },
  progressBarBg: {
    backgroundColor: '#E8F5EE',
    borderRadius: 10,
    height: 10,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 10,
    borderRadius: 10,
    minWidth: 4,
  },
  progressSub: {
    fontSize: 11,
    color: colors.muted,
    marginTop: 6,
  },
  sectionHeading: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 6,
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  milestoneList: {
    marginHorizontal: 16,
    gap: 8,
  },
  milestoneItem: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  milestoneItemNext: {
    borderWidth: 2,
    borderColor: '#F0B429',
  },
  milestoneItemFuture: {
    opacity: 0.6,
  },
  msCheck: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  msCheckDone: {
    backgroundColor: colors.accent,
  },
  msCheckNext: {
    backgroundColor: colors.gold,
  },
  msCheckFuture: {
    backgroundColor: '#E8F5EE',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#E2EDE8',
  },
  msCheckText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.white,
  },
  msInfo: {
    flex: 1,
  },
  msTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  msSub: {
    fontSize: 11,
    color: colors.muted,
    marginTop: 1,
  },
  msDate: {
    fontSize: 10,
    color: colors.accent,
    fontWeight: '600',
  },
  msDateNext: {
    color: colors.gold,
  },
  spacer: { height: 12 },
})
