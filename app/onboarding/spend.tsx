import { useState } from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { useStreakStore, getStreakDays } from '@/store/streakStore'
import { colors } from '@/constants/colors'

const QUICK_AMOUNTS = [5, 10, 15, 20, 30, 40]
const DAYS_PREVIEW = 30

function ProgressDots({ active }: { active: number }) {
  return (
    <View style={styles.dots}>
      {[0, 1, 2].map((i) => (
        <View
          key={i}
          style={[
            styles.dot,
            i <= active && styles.dotDone,
          ]}
        />
      ))}
    </View>
  )
}

export default function SpendScreen() {
  const router = useRouter()
  const { setDailySpend, quitDate } = useStreakStore()
  const [amount, setAmount] = useState(15)

  const streakDays = getStreakDays(quitDate)
  const projectedSavings = amount * DAYS_PREVIEW

  function handleConfirm() {
    setDailySpend(amount)
    router.replace('/(tabs)')
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.kav}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.body}>
          <ProgressDots active={2} />

          <Text style={styles.title}>Daily spend?</Text>
          <Text style={styles.sub}>
            We'll show you how much money you're saving in real time — it's surprisingly motivating.
          </Text>

          {/* Big input display */}
          <View style={styles.inputWrap}>
            <Text style={styles.currency}>$</Text>
            <Text style={styles.amountValue}>{amount}</Text>
            <Text style={styles.perDay}>/day</Text>
          </View>

          {/* Quick chips */}
          <View style={styles.chips}>
            {QUICK_AMOUNTS.map((n) => (
              <TouchableOpacity
                key={n}
                style={[styles.chip, amount === n && styles.chipSelected]}
                onPress={() => setAmount(n)}
                activeOpacity={0.7}
              >
                <Text style={[styles.chipText, amount === n && styles.chipTextSelected]}>
                  {n === 40 ? '$40+' : `$${n}`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Savings preview */}
          <LinearGradient
            colors={['#2D6A4F', '#3A8563']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.savingsPreview}
          >
            <Text style={styles.savingsPreviewLabel}>
              At ${amount}/day, after {DAYS_PREVIEW} days you'll have saved:
            </Text>
            <Text style={styles.savingsPreviewVal}>${projectedSavings.toFixed(2)} 💰</Text>
            <Text style={styles.savingsPreviewSub}>That's a weekend trip or new gear</Text>
          </LinearGradient>

          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={handleConfirm}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryBtnText}>Let's do this 🌿</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  kav: {
    flex: 1,
  },
  body: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 16,
  },
  dots: {
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E2EDE8',
  },
  dotDone: {
    backgroundColor: colors.accent,
    width: 20,
    borderRadius: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
  },
  sub: {
    fontSize: 13,
    color: colors.muted,
    lineHeight: 19,
    marginTop: -8,
  },
  inputWrap: {
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: '#E2EDE8',
    borderRadius: 16,
    padding: 16,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  currency: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.muted,
  },
  amountValue: {
    fontSize: 40,
    fontWeight: '800',
    color: colors.text,
    flex: 1,
  },
  perDay: {
    fontSize: 13,
    color: colors.muted,
    fontWeight: '500',
    alignSelf: 'flex-end',
    paddingBottom: 6,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: '#E2EDE8',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 7,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  chipSelected: {
    backgroundColor: '#E8F5EE',
    borderColor: colors.accent,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  chipTextSelected: {
    color: colors.primary,
  },
  savingsPreview: {
    borderRadius: 14,
    padding: 14,
    paddingHorizontal: 16,
    shadowColor: '#2D6A4F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  savingsPreviewLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
  },
  savingsPreviewVal: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.white,
  },
  savingsPreviewSub: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  primaryBtn: {
    width: '100%',
    backgroundColor: colors.primary,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    marginTop: 'auto',
    shadowColor: '#2D6A4F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  primaryBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.white,
  },
})
