import { useRef, useState } from 'react'
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { useJournalStore, type MoodEntry } from '@/store/journalStore'
import { colors } from '@/constants/colors'

const MOODS = [
  { value: 1 as const, emoji: '😔', label: 'Rough', bg: '#FEE8E8', border: '#F5C2C2' },
  { value: 2 as const, emoji: '😕', label: 'Low',   bg: '#FFF0E6', border: '#F5D5B8' },
  { value: 3 as const, emoji: '😐', label: 'Okay',  bg: '#F4F9F6', border: '#D5E8DC' },
  { value: 4 as const, emoji: '🙂', label: 'Good',  bg: '#E8F5EE', border: '#52B788' },
  { value: 5 as const, emoji: '😄', label: 'Great', bg: '#E8F5EE', border: '#2D6A4F' },
]

const TAGS = [
  '💪 Craving resisted',
  '😴 Bad sleep',
  '🏃 Exercised',
  '👥 Social situation',
  '💼 Work stress',
  '🧘 Mindful moment',
  '🍎 Ate well',
  '✨ Small win',
  '😰 Anxiety',
  '🌊 Urge surfed',
]

const STEP_LABELS = ['Mood', 'Note', 'Tags']

export default function NewJournalScreen() {
  const router = useRouter()
  const { addMoodEntry } = useJournalStore()

  const [step, setStep] = useState(0)
  const [mood, setMood] = useState<1 | 2 | 3 | 4 | 5 | null>(null)
  const [note, setNote] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  // Scale animations for mood buttons
  const scaleAnims = useRef(MOODS.map(() => new Animated.Value(1))).current

  function animateMoodPress(idx: number) {
    const anim = scaleAnims[idx]
    Animated.sequence([
      Animated.spring(anim, { toValue: 1.2, friction: 4, tension: 200, useNativeDriver: true }),
      Animated.spring(anim, { toValue: 1, friction: 5, tension: 150, useNativeDriver: true }),
    ]).start()
  }

  function handleMoodSelect(val: 1 | 2 | 3 | 4 | 5, idx: number) {
    setMood(val)
    animateMoodPress(idx)
  }

  function toggleTag(tag: string) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  function handleSave() {
    if (mood === null) return
    const entry: MoodEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      mood,
      note: [note, ...selectedTags].filter(Boolean).join('\n') || undefined,
    }
    addMoodEntry(entry)
    router.back()
  }

  function nextStep() {
    if (step < 2) setStep((s) => s + 1)
    else handleSave()
  }

  const canProceed = step === 0 ? mood !== null : true

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Top bar */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.cancelBtn} activeOpacity={0.7}>
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.topTitle}>New Entry</Text>
          <View style={styles.cancelBtn} />
        </View>

        {/* Step indicators */}
        <View style={styles.stepRow}>
          {STEP_LABELS.map((label, i) => (
            <View key={i} style={styles.stepItem}>
              <View style={[styles.stepDot, i === step && styles.stepDotActive, i < step && styles.stepDotDone]}>
                {i < step ? (
                  <Text style={styles.stepDotCheck}>✓</Text>
                ) : (
                  <Text style={[styles.stepDotNum, i === step && styles.stepDotNumActive]}>
                    {i + 1}
                  </Text>
                )}
              </View>
              <Text style={[styles.stepLabel, i === step && styles.stepLabelActive]}>{label}</Text>
            </View>
          ))}
          <View style={styles.stepConnector} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Step 0: Mood */}
          {step === 0 && (
            <View style={styles.stepContent}>
              <Text style={styles.stepHeading}>How are you feeling?</Text>
              <Text style={styles.stepSubheading}>Tap the emoji that best describes your mood right now.</Text>
              <View style={styles.moodGrid}>
                {MOODS.map((m, i) => {
                  const selected = mood === m.value
                  return (
                    <Animated.View key={m.value} style={{ transform: [{ scale: scaleAnims[i] }] }}>
                      <TouchableOpacity
                        style={[
                          styles.moodCard,
                          { backgroundColor: m.bg, borderColor: selected ? m.border : '#E0E0E0' },
                          selected && styles.moodCardSelected,
                        ]}
                        onPress={() => handleMoodSelect(m.value, i)}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.moodEmoji}>{m.emoji}</Text>
                        <Text style={[styles.moodLabel, selected && { color: colors.primary, fontWeight: '700' }]}>
                          {m.label}
                        </Text>
                      </TouchableOpacity>
                    </Animated.View>
                  )
                })}
              </View>
            </View>
          )}

          {/* Step 1: Note */}
          {step === 1 && (
            <View style={styles.stepContent}>
              <Text style={styles.stepHeading}>Add a note</Text>
              <Text style={styles.stepSubheading}>What's on your mind? This is private — no judgement.</Text>
              <View style={styles.noteWrap}>
                {mood !== null && (
                  <View style={styles.moodPreviewRow}>
                    <Text style={styles.moodPreviewEmoji}>{MOODS[mood - 1].emoji}</Text>
                    <Text style={styles.moodPreviewLabel}>{MOODS[mood - 1].label}</Text>
                  </View>
                )}
                <TextInput
                  style={styles.noteInput}
                  placeholder="Write something… or skip if you'd prefer."
                  placeholderTextColor={colors.muted}
                  multiline
                  value={note}
                  onChangeText={setNote}
                  maxLength={500}
                  autoFocus
                />
                <Text style={styles.charCount}>{note.length}/500</Text>
              </View>
            </View>
          )}

          {/* Step 2: Tags */}
          {step === 2 && (
            <View style={styles.stepContent}>
              <Text style={styles.stepHeading}>Tag this entry</Text>
              <Text style={styles.stepSubheading}>Select anything that applies — helps track patterns over time.</Text>
              <View style={styles.tagsWrap}>
                {TAGS.map((tag) => {
                  const active = selectedTags.includes(tag)
                  return (
                    <TouchableOpacity
                      key={tag}
                      style={[styles.tag, active && styles.tagActive]}
                      onPress={() => toggleTag(tag)}
                      activeOpacity={0.75}
                    >
                      <Text style={[styles.tagText, active && styles.tagTextActive]}>{tag}</Text>
                    </TouchableOpacity>
                  )
                })}
              </View>
            </View>
          )}
        </ScrollView>

        {/* CTA */}
        <View style={styles.ctaWrap}>
          <TouchableOpacity
            style={[styles.ctaBtn, !canProceed && styles.ctaBtnDisabled]}
            onPress={nextStep}
            activeOpacity={0.85}
            disabled={!canProceed}
          >
            <LinearGradient
              colors={canProceed ? [colors.primary, '#3A8563'] : ['#B0C4B8', '#B0C4B8']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.ctaBtnGradient}
            >
              <Text style={styles.ctaBtnText}>
                {step < 2 ? 'Continue →' : 'Save Entry'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          {step < 2 && step > 0 && (
            <TouchableOpacity onPress={nextStep} style={styles.skipBtn} activeOpacity={0.7}>
              <Text style={styles.skipBtnText}>Skip</Text>
            </TouchableOpacity>
          )}
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  cancelBtn: {
    width: 70,
  },
  cancelBtnText: {
    fontSize: 15,
    color: colors.muted,
    fontWeight: '500',
  },
  topTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  stepRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 28,
    paddingVertical: 12,
    paddingHorizontal: 24,
    position: 'relative',
  },
  stepConnector: {
    position: 'absolute',
    top: '50%',
    left: '20%',
    right: '20%',
    height: 1,
    backgroundColor: '#D5E8DC',
    zIndex: -1,
  },
  stepItem: {
    alignItems: 'center',
    gap: 4,
  },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E8F0EC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#D5E8DC',
  },
  stepDotActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  stepDotDone: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  stepDotNum: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.muted,
  },
  stepDotNumActive: {
    color: colors.white,
  },
  stepDotCheck: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.white,
  },
  stepLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.muted,
  },
  stepLabelActive: {
    color: colors.primary,
  },
  scroll: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  stepContent: {
    paddingTop: 4,
  },
  stepHeading: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 6,
  },
  stepSubheading: {
    fontSize: 14,
    color: colors.muted,
    lineHeight: 21,
    marginBottom: 20,
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  moodCard: {
    width: 62,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    gap: 6,
    borderWidth: 2,
  },
  moodCardSelected: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  moodEmoji: {
    fontSize: 28,
  },
  moodLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.muted,
  },
  noteWrap: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  moodPreviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF3F0',
  },
  moodPreviewEmoji: {
    fontSize: 18,
  },
  moodPreviewLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  noteInput: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 24,
    minHeight: 140,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 11,
    color: colors.muted,
    textAlign: 'right',
    marginTop: 6,
  },
  tagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: '#D5E8DC',
  },
  tagActive: {
    backgroundColor: '#E8F5EE',
    borderColor: colors.accent,
  },
  tagText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.muted,
  },
  tagTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  ctaWrap: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 8,
    gap: 6,
  },
  ctaBtn: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  ctaBtnDisabled: {
    opacity: 0.6,
  },
  ctaBtnGradient: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  ctaBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
  },
  skipBtn: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  skipBtnText: {
    fontSize: 13,
    color: colors.muted,
    fontWeight: '500',
  },
})
