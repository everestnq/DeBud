import { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { format, subDays } from 'date-fns'
import { useStreakStore } from '@/store/streakStore'
import { colors } from '@/constants/colors'

const DATE_OPTIONS = [
  { label: 'Today', sub: format(new Date(), 'MMM d, yyyy'), value: new Date().toISOString() },
  { label: 'Yesterday', sub: format(subDays(new Date(), 1), 'MMM d, yyyy'), value: subDays(new Date(), 1).toISOString() },
  { label: '2–3 days ago', sub: `${format(subDays(new Date(), 3), 'MMM d')}–${format(subDays(new Date(), 2), 'MMM d, yyyy')}`, value: subDays(new Date(), 2).toISOString() },
  { label: 'Pick a specific date', sub: 'Use the calendar', value: null },
]

function ProgressDots({ active }: { active: number }) {
  return (
    <View style={styles.dots}>
      {[0, 1, 2].map((i) => (
        <View
          key={i}
          style={[
            styles.dot,
            i < active && styles.dotDone,
            i === active && styles.dotActive,
          ]}
        />
      ))}
    </View>
  )
}

export default function QuitDateScreen() {
  const router = useRouter()
  const { setQuitDate } = useStreakStore()
  const [selected, setSelected] = useState<string | null>(null)

  function handleContinue() {
    if (!selected) return
    setQuitDate(selected)
    router.push('/onboarding/spend')
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.body}>
        <ProgressDots active={1} />

        <Text style={styles.title}>When did you last use?</Text>
        <Text style={styles.sub}>
          We'll use this to calculate your streak and track your progress from day one.
        </Text>

        <View style={styles.options}>
          {DATE_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.label}
              style={[styles.option, selected === opt.value && styles.optionSelected]}
              onPress={() => opt.value && setSelected(opt.value)}
              activeOpacity={0.7}
            >
              <View>
                <Text style={styles.optionLabel}>{opt.label}</Text>
                <Text style={styles.optionSub}>{opt.sub}</Text>
              </View>
              <View style={[styles.radio, selected === opt.value && styles.radioSelected]}>
                {selected === opt.value && <View style={styles.radioInner} />}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.noJudgement}>
          <Text style={styles.noJudgementText}>
            🌱 No judgement here. Be honest with yourself — your streak is for you, not us.
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.primaryBtn, !selected && styles.primaryBtnDisabled]}
          onPress={handleContinue}
          disabled={!selected}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryBtnText}>Continue →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  body: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  dots: {
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    marginBottom: 24,
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
  dotActive: {
    backgroundColor: colors.accent,
    width: 20,
    borderRadius: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 6,
  },
  sub: {
    fontSize: 13,
    color: colors.muted,
    lineHeight: 19,
    marginBottom: 20,
  },
  options: {
    gap: 10,
    marginBottom: 16,
  },
  option: {
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: '#E2EDE8',
    borderRadius: 14,
    padding: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  optionSelected: {
    borderColor: colors.accent,
    backgroundColor: '#E8F5EE',
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  optionSub: {
    fontSize: 11,
    color: colors.muted,
    marginTop: 2,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E2EDE8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: colors.accent,
    backgroundColor: colors.accent,
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.white,
  },
  noJudgement: {
    backgroundColor: '#E8F5EE',
    borderRadius: 12,
    padding: 12,
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  noJudgementText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
    lineHeight: 18,
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
  primaryBtnDisabled: {
    opacity: 0.5,
  },
  primaryBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.white,
  },
})
