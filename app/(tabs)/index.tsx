import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { useStreakStore, getMoneySaved, getStreakDays } from '@/store/streakStore'
import { useLessonsStore } from '@/store/lessonsStore'
import { BudSVG } from '@/components/mascot/BudSVG'
import { colors } from '@/constants/colors'

export default function HomeScreen() {
  const router = useRouter()
  const { quitDate, dailySpend } = useStreakStore()
  const { completedLessons } = useLessonsStore()
  const streakDays = getStreakDays(quitDate)
  const moneySaved = getMoneySaved(quitDate, dailySpend)
  const weeksFree = Math.floor(streakDays / 7)
  const hoursFree = streakDays * 4 // rough estimate

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greetingSub}>Good morning,</Text>
            <Text style={styles.greetingName}>Welcome back 🌿</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarEmoji}>🧑</Text>
          </View>
        </View>

        {/* Mascot */}
        <View style={styles.mascotArea}>
          <BudSVG width={110} height={118} mood="normal" />
          <View style={styles.mascotCaption}>
            <Text style={styles.mascotCaptionText}>
              {streakDays < 3 ? 'Seedling' :
               streakDays < 7 ? 'Growing' :
               streakDays < 30 ? 'Blooming' : 'Thriving'} · Day {streakDays} 🌸
            </Text>
          </View>
        </View>

        {/* Streak card */}
        <LinearGradient
          colors={['#2D6A4F', '#3A8563']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.streakCard}
        >
          <View>
            <Text style={styles.streakNum}>{streakDays}</Text>
            <Text style={styles.streakLabel}>days clean 🔥</Text>
          </View>
          <View style={styles.streakRing}>
            <Text style={styles.streakRingNum}>{weeksFree}</Text>
            <Text style={styles.streakRingLabel}>weeks</Text>
          </View>
        </LinearGradient>

        {/* Savings row */}
        <View style={styles.savingsRow}>
          <View style={styles.savingsCard}>
            <Text style={styles.savingsIcon}>💰</Text>
            <Text style={styles.savingsValue}>${moneySaved.toFixed(0)}</Text>
            <Text style={styles.savingsLabel}>Money saved</Text>
          </View>
          <View style={styles.savingsCard}>
            <Text style={styles.savingsIcon}>⏱</Text>
            <Text style={styles.savingsValue}>{hoursFree}h</Text>
            <Text style={styles.savingsLabel}>Time free</Text>
          </View>
          <View style={styles.savingsCard}>
            <Text style={styles.savingsIcon}>🧠</Text>
            <Text style={styles.savingsValue}>{completedLessons.length}</Text>
            <Text style={styles.savingsLabel}>Lessons done</Text>
          </View>
        </View>

        {/* Craving button */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.push('/craving')}
          style={styles.cravingBtnWrap}
        >
          <LinearGradient
            colors={['#E07A36', '#D06A28']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.cravingBtn}
          >
            <Text style={styles.cravingBtnText}>🚨 I'm Craving Right Now</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Daily lesson card */}
        <View style={styles.dailyCard}>
          <View style={styles.dailyCardLeft}>
            <Text style={styles.dailyCardTitle}>📖 Today's Lesson Ready</Text>
            <Text style={styles.dailyCardSub}>Managing social triggers</Text>
          </View>
          <View style={styles.dailyCardChip}>
            <Text style={styles.dailyCardChipText}>+20 XP</Text>
          </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  greetingSub: {
    fontSize: 13,
    color: colors.muted,
    fontWeight: '500',
  },
  greetingName: {
    fontSize: 17,
    color: colors.text,
    fontWeight: '700',
    marginTop: 1,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E8F5EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 18,
  },
  mascotArea: {
    alignItems: 'center',
    paddingTop: 4,
    paddingBottom: 0,
  },
  mascotCaption: {
    backgroundColor: '#E8F5EE',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 4,
  },
  mascotCaptionText: {
    fontSize: 12,
    color: colors.accent,
    fontWeight: '600',
  },
  streakCard: {
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 20,
    padding: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#2D6A4F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  streakNum: {
    fontSize: 48,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 52,
    letterSpacing: -2,
  },
  streakLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
  },
  streakRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakRingNum: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 22,
  },
  streakRingLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
  },
  savingsRow: {
    flexDirection: 'row',
    gap: 10,
    marginHorizontal: 16,
    marginTop: 10,
  },
  savingsCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 12,
    paddingHorizontal: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  savingsIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  savingsValue: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primary,
  },
  savingsLabel: {
    fontSize: 10,
    color: colors.muted,
    fontWeight: '500',
    marginTop: 1,
  },
  cravingBtnWrap: {
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#E07A36',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 5,
  },
  cravingBtn: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cravingBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.white,
  },
  dailyCard: {
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  dailyCardLeft: {
    flex: 1,
  },
  dailyCardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  dailyCardSub: {
    fontSize: 11,
    color: colors.muted,
    marginTop: 2,
  },
  dailyCardChip: {
    backgroundColor: '#E8F5EE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  dailyCardChipText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primary,
  },
  spacer: {
    height: 12,
  },
})
