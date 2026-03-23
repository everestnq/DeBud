import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { useLessonsStore } from '@/store/lessonsStore'
import { colors } from '@/constants/colors'

const LESSON_CATALOG = [
  {
    category: 'Understanding Cravings',
    lessons: [
      { id: 'understanding-cravings-01', title: 'Why Cravings Feel Overwhelming', duration: '2 min', xp: 20, icon: '🧠', iconBg: '#E8F5EE', completedDate: null },
      { id: 'craving-window-01', title: 'The 20-Minute Window', duration: '3 min', xp: 20, icon: '⏱', iconBg: '#E8F5EE', completedDate: null },
    ],
  },
  {
    category: 'Trigger Mapping',
    lessons: [
      { id: 'trigger-mapping-01', title: 'Mapping Your High-Risk Times', duration: '4 min', xp: 25, icon: '🗺', iconBg: '#FFF8E1', completedDate: null },
      { id: 'after-work-habit-01', title: 'Breaking the After-Work Habit', duration: '3 min', xp: 25, icon: '🔒', iconBg: '#F0F0F0', locked: true, completedDate: null },
    ],
  },
  {
    category: 'Habit Replacement',
    lessons: [
      { id: 'habit-replacement-01', title: 'Rewiring Your Reward Loop', duration: '4 min', xp: 30, icon: '🔒', iconBg: '#F0F0F0', locked: true, completedDate: null },
    ],
  },
] as const

type Lesson = typeof LESSON_CATALOG[number]['lessons'][number]

export default function LessonsScreen() {
  const { completedLessons, xp, lessonStreak } = useLessonsStore()

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Lessons</Text>
            <Text style={styles.subtitle}>{lessonStreak}-day lesson streak 🔥</Text>
          </View>
          <LinearGradient
            colors={['#F0B429', '#E8A020']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.xpBadge}
          >
            <Text style={styles.xpBadgeText}>⚡ {xp} XP</Text>
          </LinearGradient>
        </View>

        {/* Today's featured lesson */}
        <View style={styles.todayWrap}>
          <LinearGradient
            colors={['#2D6A4F', '#3A8563']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.todayCard}
          >
            <View style={styles.todayChip}>
              <Text style={styles.todayChipText}>TODAY'S LESSON</Text>
            </View>
            <Text style={styles.todayTitle}>Managing Social Triggers</Text>
            <Text style={styles.todayBody}>
              How to handle situations where others are using — without feeling left out.
            </Text>
            <View style={styles.todayFooter}>
              <Text style={styles.todayMeta}>3 min · +20 XP</Text>
              <TouchableOpacity style={styles.startBtn} activeOpacity={0.8}>
                <Text style={styles.startBtnText}>Start →</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        {/* Lesson categories */}
        {LESSON_CATALOG.map((cat) => (
          <View key={cat.category}>
            <Text style={styles.sectionHeading}>{cat.category}</Text>
            {cat.lessons.map((lesson) => {
              const done = completedLessons.includes(lesson.id)
              const locked = 'locked' in lesson && lesson.locked
              return (
                <LessonItem
                  key={lesson.id}
                  lesson={lesson as unknown as Lesson & { locked?: boolean }}
                  done={done}
                  locked={!!locked}
                />
              )
            })}
          </View>
        ))}

        <View style={styles.spacer} />
      </ScrollView>
    </SafeAreaView>
  )
}

interface LessonItemProps {
  lesson: { id: string; title: string; duration: string; xp: number; icon: string; iconBg: string; locked?: boolean }
  done: boolean
  locked: boolean
}

function LessonItem({ lesson, done, locked }: LessonItemProps) {
  return (
    <TouchableOpacity
      style={[styles.lessonItem, done && styles.lessonItemDone, locked && styles.lessonItemLocked]}
      activeOpacity={locked ? 1 : 0.7}
      disabled={locked}
    >
      <View style={[styles.lessonIconWrap, { backgroundColor: lesson.iconBg }]}>
        <Text style={styles.lessonIcon}>{lesson.icon}</Text>
      </View>
      <View style={styles.lessonInfo}>
        <Text style={[styles.lessonTitle, locked && styles.lessonTitleMuted]}>{lesson.title}</Text>
        <Text style={styles.lessonSub}>
          {locked ? 'Complete previous lesson' : `${lesson.duration} · ${done ? 'Completed' : 'Available now'}`}
        </Text>
      </View>
      <View style={styles.lessonState}>
        {done ? (
          <Text style={styles.stateDone}>✓</Text>
        ) : locked ? (
          <Text style={styles.stateLock}>🔒</Text>
        ) : (
          <View style={styles.xpPill}>
            <Text style={styles.xpPillText}>+{lesson.xp} XP</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 10,
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
  xpBadge: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    shadowColor: '#F0B429',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 3,
  },
  xpBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.white,
  },
  todayWrap: {
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#2D6A4F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 5,
  },
  todayCard: {
    padding: 18,
    paddingBottom: 14,
  },
  todayChip: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    marginBottom: 8,
  },
  todayChipText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: 0.5,
  },
  todayTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 4,
  },
  todayBody: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 17,
  },
  todayFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  todayMeta: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.75)',
  },
  startBtn: {
    backgroundColor: colors.white,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 7,
  },
  startBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  sectionHeading: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 6,
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  lessonItem: {
    marginHorizontal: 16,
    marginBottom: 8,
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
  lessonItemDone: {
    opacity: 0.75,
  },
  lessonItemLocked: {
    opacity: 0.7,
  },
  lessonIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lessonIcon: {
    fontSize: 20,
  },
  lessonInfo: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  lessonTitleMuted: {
    color: colors.muted,
  },
  lessonSub: {
    fontSize: 11,
    color: colors.muted,
    marginTop: 2,
  },
  lessonState: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  stateDone: {
    fontSize: 18,
    color: colors.accent,
    fontWeight: '700',
  },
  stateLock: {
    fontSize: 16,
  },
  xpPill: {
    backgroundColor: '#E8F5EE',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  xpPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primary,
  },
  spacer: { height: 12 },
})
