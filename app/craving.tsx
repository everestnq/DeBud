import { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View, TextInput } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useJournalStore, type CravingEntry } from '@/store/journalStore'
import { colors } from '@/constants/colors'
import { spacing, fontSize, fontWeight, shadow } from '@/constants/theme'
import { strings } from '@/constants/strings'

type Step = 'breathing' | 'distraction' | 'log' | 'mascot'

const DISTRACTIONS = [
  'Take a 5-minute walk outside',
  'Drink a glass of cold water',
  'Do 10 push-ups',
  'Text a friend',
  'Watch a funny video',
  'Make a cup of tea',
  'Listen to your favourite song',
  'Stretch for 2 minutes',
]

function randomDistraction(): string {
  return DISTRACTIONS[Math.floor(Math.random() * DISTRACTIONS.length)]
}

export default function CravingScreen() {
  const router = useRouter()
  const { addCravingEntry } = useJournalStore()

  const [step, setStep] = useState<Step>('breathing')
  const [distraction, setDistraction] = useState(randomDistraction)
  const [trigger, setTrigger] = useState('')
  const [intensity, setIntensity] = useState<1 | 2 | 3 | 4 | 5>(3)

  function handleLog() {
    const entry: CravingEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      trigger: trigger.trim() || undefined,
      intensity,
    }
    addCravingEntry(entry)
    setStep('mascot')
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
        <Text style={styles.closeText}>✕</Text>
      </TouchableOpacity>

      {step === 'breathing' && (
        <View style={styles.stepContainer}>
          <Text style={styles.stepTitle}>{strings.craving.breathingTitle}</Text>
          <Text style={styles.stepBody}>{strings.craving.breathingBody}</Text>
          <View style={styles.breathCircle}>
            <Text style={styles.breathText}>Breathe</Text>
          </View>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => setStep('distraction')}
          >
            <Text style={styles.primaryButtonText}>I feel calmer</Text>
          </TouchableOpacity>
        </View>
      )}

      {step === 'distraction' && (
        <View style={styles.stepContainer}>
          <Text style={styles.stepTitle}>{strings.craving.distractionTitle}</Text>
          <View style={styles.distractionCard}>
            <Text style={styles.distractionText}>{distraction}</Text>
          </View>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => setDistraction(randomDistraction())}
          >
            <Text style={styles.secondaryButtonText}>Give me another</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => setStep('log')}
          >
            <Text style={styles.primaryButtonText}>Done with this</Text>
          </TouchableOpacity>
        </View>
      )}

      {step === 'log' && (
        <View style={styles.stepContainer}>
          <Text style={styles.stepTitle}>{strings.craving.logTitle}</Text>

          <Text style={styles.inputLabel}>{strings.craving.triggerLabel}</Text>
          <TextInput
            style={styles.textInput}
            value={trigger}
            onChangeText={setTrigger}
            placeholder="e.g. stress, boredom, social..."
            placeholderTextColor={colors.muted}
          />

          <Text style={styles.inputLabel}>{strings.craving.intensityLabel}</Text>
          <View style={styles.intensityRow}>
            {([1, 2, 3, 4, 5] as const).map((n) => (
              <TouchableOpacity
                key={n}
                style={[
                  styles.intensityButton,
                  intensity === n && styles.intensityButtonActive,
                ]}
                onPress={() => setIntensity(n)}
              >
                <Text
                  style={[
                    styles.intensityButtonText,
                    intensity === n && styles.intensityButtonTextActive,
                  ]}
                >
                  {n}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.primaryButton} onPress={handleLog}>
            <Text style={styles.primaryButtonText}>{strings.general.done}</Text>
          </TouchableOpacity>
        </View>
      )}

      {step === 'mascot' && (
        <View style={styles.stepContainer}>
          <Text style={styles.mascotEmoji}>🌟</Text>
          <Text style={styles.stepTitle}>You did it!</Text>
          <Text style={styles.stepBody}>{strings.craving.mascotMessage}</Text>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.back()}
          >
            <Text style={styles.primaryButtonText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  closeButton: {
    position: 'absolute',
    top: 56,
    right: spacing.lg,
    zIndex: 10,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 18,
    color: colors.muted,
  },
  stepContainer: {
    flex: 1,
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
  },
  stepTitle: {
    fontSize: fontSize.title,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    textAlign: 'center',
  },
  stepBody: {
    fontSize: fontSize.body,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 22,
  },
  breathCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow,
  },
  breathText: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
    color: colors.white,
  },
  distractionCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: spacing.xl,
    width: '100%',
    ...shadow,
  },
  distractionText: {
    fontSize: fontSize.body,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 22,
  },
  inputLabel: {
    alignSelf: 'flex-start',
    fontSize: fontSize.caption,
    fontWeight: fontWeight.medium,
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  textInput: {
    width: '100%',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.md,
    fontSize: fontSize.body,
    color: colors.text,
    borderWidth: 1,
    borderColor: '#E8F0EC',
  },
  intensityRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  intensityButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E8F0EC',
  },
  intensityButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  intensityButtonText: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.medium,
    color: colors.muted,
  },
  intensityButtonTextActive: {
    color: colors.white,
  },
  primaryButton: {
    width: '100%',
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: spacing.lg,
    alignItems: 'center',
    ...shadow,
  },
  primaryButtonText: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
    color: colors.white,
  },
  secondaryButton: {
    width: '100%',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8F0EC',
  },
  secondaryButtonText: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.medium,
    color: colors.primary,
  },
  mascotEmoji: {
    fontSize: 64,
  },
})
