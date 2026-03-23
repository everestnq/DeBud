import { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useStreakStore } from '@/store/streakStore'
import { colors } from '@/constants/colors'
import { spacing, fontSize, fontWeight, shadow } from '@/constants/theme'
import { strings } from '@/constants/strings'
import { format, subDays } from 'date-fns'

const DATE_OPTIONS = [0, 1, 2, 3, 7, 14, 30].map((daysAgo) => {
  const date = subDays(new Date(), daysAgo)
  return {
    label: daysAgo === 0 ? 'Today' : daysAgo === 1 ? 'Yesterday' : `${daysAgo} days ago`,
    value: date.toISOString(),
  }
})

export default function QuitDateScreen() {
  const router = useRouter()
  const { setQuitDate } = useStreakStore()
  const [selected, setSelected] = useState<string | null>(null)

  function handleConfirm() {
    if (!selected) return
    setQuitDate(selected)
    router.push('/onboarding/spend')
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{strings.onboarding.quitDateTitle}</Text>
        <Text style={styles.body}>{strings.onboarding.quitDateBody}</Text>

        <View style={styles.optionsList}>
          {DATE_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              style={[styles.option, selected === opt.value && styles.optionSelected]}
              onPress={() => setSelected(opt.value)}
            >
              <Text
                style={[
                  styles.optionText,
                  selected === opt.value && styles.optionTextSelected,
                ]}
              >
                {opt.label}
              </Text>
              <Text
                style={[
                  styles.optionDate,
                  selected === opt.value && styles.optionTextSelected,
                ]}
              >
                {format(new Date(opt.value), 'MMM d')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={[styles.button, !selected && styles.buttonDisabled]}
        onPress={handleConfirm}
        disabled={!selected}
      >
        <Text style={styles.buttonText}>{strings.onboarding.setDateButton}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: spacing.xl,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    gap: spacing.xl,
  },
  title: {
    fontSize: fontSize.title,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginTop: spacing.xl,
  },
  body: {
    fontSize: fontSize.body,
    color: colors.muted,
    lineHeight: 22,
  },
  optionsList: {
    gap: spacing.sm,
  },
  option: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    ...shadow,
  },
  optionSelected: {
    borderColor: colors.primary,
    backgroundColor: '#EAF4EE',
  },
  optionText: {
    fontSize: fontSize.body,
    color: colors.text,
  },
  optionDate: {
    fontSize: fontSize.caption,
    color: colors.muted,
  },
  optionTextSelected: {
    color: colors.primary,
    fontWeight: fontWeight.semibold,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: spacing.lg,
    alignItems: 'center',
    ...shadow,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
    color: colors.white,
  },
})
