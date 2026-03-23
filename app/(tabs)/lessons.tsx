import { FlatList, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLessonsStore } from '@/store/lessonsStore'
import { colors } from '@/constants/colors'
import { spacing, fontSize, fontWeight, shadow } from '@/constants/theme'
import { strings } from '@/constants/strings'

// Static lesson metadata — content is loaded per-lesson from JSON
const LESSON_CATALOG = [
  {
    id: 'understanding-cravings-01',
    title: 'Why Cravings Feel Overwhelming',
    category: 'Understanding Cravings',
    xp: 20,
  },
  {
    id: 'trigger-mapping-01',
    title: 'Mapping Your Triggers',
    category: 'Trigger Mapping',
    xp: 20,
  },
  {
    id: 'habit-replacement-01',
    title: 'Building Better Habits',
    category: 'Habit Replacement',
    xp: 20,
  },
] as const

export default function LessonsScreen() {
  const { completedLessons, xp, lessonStreak } = useLessonsStore()

  return (
    <SafeAreaView style={styles.container}>
      {/* XP header */}
      <View style={styles.header}>
        <Text style={styles.title}>{strings.tabs.lessons}</Text>
        <View style={styles.xpBadge}>
          <Text style={styles.xpText}>{xp} XP</Text>
        </View>
      </View>

      <Text style={styles.streakLine}>
        {lessonStreak} day lesson streak
      </Text>

      <FlatList
        data={LESSON_CATALOG}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const done = completedLessons.includes(item.id)
          return (
            <View style={[styles.lessonCard, done && styles.lessonCardDone]}>
              <View style={styles.lessonInfo}>
                <Text style={styles.lessonCategory}>{item.category}</Text>
                <Text style={styles.lessonTitle}>{item.title}</Text>
              </View>
              <View style={styles.xpPill}>
                <Text style={styles.xpPillText}>
                  {done ? '✓' : `+${item.xp} XP`}
                </Text>
              </View>
            </View>
          )
        }}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  title: {
    fontSize: fontSize.title,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  xpBadge: {
    backgroundColor: colors.gold,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  xpText: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.bold,
    color: colors.white,
  },
  streakLine: {
    fontSize: fontSize.caption,
    color: colors.muted,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  list: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  lessonCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shadow,
  },
  lessonCardDone: {
    opacity: 0.6,
  },
  lessonInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  lessonCategory: {
    fontSize: fontSize.caption,
    color: colors.muted,
    marginBottom: spacing.xs,
  },
  lessonTitle: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  xpPill: {
    backgroundColor: colors.accent,
    borderRadius: 8,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  xpPillText: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.bold,
    color: colors.white,
  },
})
