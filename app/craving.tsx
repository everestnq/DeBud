import { useEffect, useRef, useState } from 'react'
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
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { useJournalStore, type CravingEntry } from '@/store/journalStore'
import { useStreakStore, getStreakDays } from '@/store/streakStore'
import { BudSVG } from '@/components/mascot/BudSVG'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { colors } from '@/constants/colors'

// ─── Distractions ────────────────────────────────────────────────────────────

const DISTRACTIONS = [
  { icon: '🚶', title: 'Go for a 5-minute walk', why: 'Physical movement floods your brain with dopamine and interrupts the craving cycle fast.', category: 'physical' },
  { icon: '💧', title: 'Drink a full glass of water', why: 'Slowly. Cravings are often confused with dehydration. This buys you 3 minutes.', category: 'physical' },
  { icon: '🧊', title: 'Hold something cold', why: 'Temperature change snaps your nervous system out of craving mode.', category: 'physical' },
  { icon: '🤸', title: 'Do 20 jumping jacks', why: 'Quick exercise changes your body chemistry almost immediately.', category: 'physical' },
  { icon: '🧹', title: 'Clean one small thing', why: 'Redirects the urge to "do something" into something productive.', category: 'physical' },
  { icon: '📱', title: 'Text someone you trust', why: 'Just say hi. Connection is a powerful craving interrupter.', category: 'social' },
  { icon: '🎵', title: 'Put on a favourite song', why: 'Music activates the same reward pathways as the substance. Hijack it.', category: 'mindful' },
  { icon: '😮‍💨', title: 'Do box breathing', why: '4 counts in, 4 hold, 4 out, 4 hold. Repeat 4 times. Resets your nervous system.', category: 'mindful' },
  { icon: '👀', title: 'Name 5 things you can see', why: 'Grounding technique. Forces your brain into the present moment.', category: 'mindful' },
  { icon: '🧘', title: 'Sit outside for 3 minutes', why: 'Fresh air and a change of scene is often all it takes.', category: 'mindful' },
  { icon: '📓', title: 'Write down what triggered this', why: 'The act of writing creates distance between you and the craving.', category: 'mindful' },
  { icon: '🎮', title: 'Play a quick phone game', why: 'Engages your hands and brain simultaneously — craving blocker.', category: 'mindful' },
  { icon: '🍎', title: 'Eat something flavourful', why: 'Strong flavours — apple, gum, citrus — compete for your brain\'s attention.', category: 'physical' },
  { icon: '☕', title: 'Make a hot drink', why: 'The ritual of making tea or coffee gives your hands something to do.', category: 'physical' },
  { icon: '🛁', title: 'Take a cold or hot shower', why: 'Temperature shock is one of the fastest craving interrupters known.', category: 'physical' },
  { icon: '📺', title: 'Watch something funny', why: 'Laughter releases the same feel-good chemicals you\'re craving.', category: 'mindful' },
  { icon: '🎨', title: 'Doodle for 3 minutes', why: 'Keeps your hands busy and puts your brain in a calm, focused state.', category: 'creative' },
  { icon: '📚', title: 'Read 2 pages of anything', why: 'Shifts your brain fully into another world for a few minutes.', category: 'mindful' },
  { icon: '🐶', title: 'Pet an animal if you can', why: 'Stroking a pet lowers cortisol almost instantly.', category: 'social' },
  { icon: '🏋️', title: 'Do a 5-minute YouTube workout', why: 'Search "5 minute workout" right now. Just start it.', category: 'physical' },
]

const TRIGGERS = ['😤 Stress', '👥 Social', '😴 Boredom', '🌆 Evening', '😢 Emotions', '🍺 Alcohol', '💼 Work', '😰 Anxiety', '🔄 Habit', '✨ Other']

const AFFIRMATIONS = [
  'You just beat a craving. That\'s real strength.',
  'Every craving you survive makes the next one weaker.',
  'That wasn\'t easy. But you did it anyway.',
  'Each time you resist, your brain rewires a little more.',
]

// ─── Main screen ─────────────────────────────────────────────────────────────

function CravingScreen() {
  const router = useRouter()
  const { addCravingEntry } = useJournalStore()
  const { quitDate } = useStreakStore()
  const streakDays = getStreakDays(quitDate)
  const cravingsBeaten = useJournalStore((s) => s.cravingLog.length)

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)

  // Step 1 — breathing state
  const [breathRound, setBreathRound] = useState(1)
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale')
  const breathScale = useRef(new Animated.Value(1)).current
  const ringOpacity = useRef(new Animated.Value(0.3)).current
  const ringScale = useRef(new Animated.Value(1)).current

  // Step 2 — distraction
  const [distractIdx, setDistractIdx] = useState(() => Math.floor(Math.random() * DISTRACTIONS.length))

  // Step 3 — log
  const [intensity, setIntensity] = useState<1 | 2 | 3 | 4 | 5>(3)
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([])
  const [note, setNote] = useState('')

  // Step 4 — affirmation (set on save)
  const [affirmation, setAffirmation] = useState('')

  // ── Breathing animation ──────────────────────────────────────────────────

  useEffect(() => {
    if (step !== 1) return

    let active = true
    let holdTimeout: ReturnType<typeof setTimeout> | null = null

    // Ring pulse loop
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(ringOpacity, { toValue: 0.06, duration: 2000, useNativeDriver: true }),
          Animated.timing(ringScale, { toValue: 1.18, duration: 2000, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(ringOpacity, { toValue: 0.3, duration: 2000, useNativeDriver: true }),
          Animated.timing(ringScale, { toValue: 1, duration: 2000, useNativeDriver: true }),
        ]),
      ]),
    )
    pulse.start()

    function runCycle(cycleNum: number) {
      if (!active) return
      setBreathPhase('inhale')

      Animated.timing(breathScale, {
        toValue: 1.3,
        duration: 4000,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (!finished || !active) return
        setBreathPhase('hold')

        holdTimeout = setTimeout(() => {
          if (!active) return
          setBreathPhase('exhale')

          Animated.timing(breathScale, {
            toValue: 1,
            duration: 8000,
            useNativeDriver: true,
          }).start(({ finished: f }) => {
            if (!f || !active) return
            if (cycleNum < 3) {
              setBreathRound(cycleNum + 1)
              runCycle(cycleNum + 1)
            } else {
              active = false
              setStep(2)
            }
          })
        }, 7000)
      })
    }

    runCycle(1)

    return () => {
      active = false
      if (holdTimeout) clearTimeout(holdTimeout)
      pulse.stop()
      breathScale.stopAnimation()
      breathScale.setValue(1)
      ringOpacity.setValue(0.3)
      ringScale.setValue(1)
    }
  }, [step]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Helpers ──────────────────────────────────────────────────────────────

  function getNextDistraction(currentIdx: number) {
    let next = Math.floor(Math.random() * DISTRACTIONS.length)
    if (next === currentIdx) next = (next + 1) % DISTRACTIONS.length
    return next
  }

  function toggleTrigger(t: string) {
    setSelectedTriggers((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t],
    )
  }

  function handleSave() {
    const entry: CravingEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      trigger: selectedTriggers.join(', ') || undefined,
      intensity,
    }
    addCravingEntry(entry)
    const aff = AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)]
    setAffirmation(aff)
    setStep(4)
  }

  // ── Progress dots ─────────────────────────────────────────────────────────

  const STEPS = [1, 2, 3, 4] as const

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.handleWrap}>
        <View style={styles.handle} />
      </View>

      <View style={styles.progressRow}>
        {STEPS.map((s) => (
          <View
            key={s}
            style={[
              styles.stepDot,
              s < step && styles.stepDotDone,
              s === step && styles.stepDotActive,
            ]}
          />
        ))}
      </View>

      {/* ── STEP 1: BREATHE ── */}
      {step === 1 && (
        <View style={styles.centerFlex}>
          <Text style={styles.bigTitle}>You've got this.</Text>
          <Text style={styles.bodyText}>
            Let's slow things down.{'\n'}Follow Bud's breathing.
          </Text>

          <View style={styles.breathWrap}>
            <Animated.View
              style={[
                styles.breathRing,
                { opacity: ringOpacity, transform: [{ scale: ringScale }] },
              ]}
            />
            <View style={styles.breathMid} />
            <Animated.View style={[styles.breathInnerWrap, { transform: [{ scale: breathScale }] }]}>
              <LinearGradient
                colors={[colors.accent, colors.primary]}
                style={styles.breathInner}
              >
                <Text style={styles.breathPhaseText}>
                  {breathPhase === 'inhale' ? 'Breathe\nin…' : breathPhase === 'hold' ? 'Hold…' : 'Breathe\nout…'}
                </Text>
              </LinearGradient>
            </Animated.View>
          </View>

          <Text style={styles.breathCount}>
            Round {breathRound} of 3 · 4-7-8 breathing
          </Text>

          <TouchableOpacity
            onPress={() => setStep(2)}
            style={styles.skipBtn}
          >
            <Text style={styles.skipText}>Skip →</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ── STEP 2: DISTRACTION ── */}
      {step === 2 && (
        <View style={styles.stepFlex}>
          <Text style={styles.bigTitle}>Try this right now.</Text>
          <Text style={styles.bodyTextLeft}>
            Most cravings peak at 20 minutes then pass. Let's get through it.
          </Text>

          <View style={styles.distractCardWrap}>
            <LinearGradient
              colors={['#2D6A4F', '#3A8563']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.distractCard}
            >
              <View>
                <Text style={styles.distractIcon}>{DISTRACTIONS[distractIdx].icon}</Text>
                <Text style={styles.distractTitle}>{DISTRACTIONS[distractIdx].title}</Text>
                <Text style={styles.distractWhy}>{DISTRACTIONS[distractIdx].why}</Text>
              </View>
              <TouchableOpacity
                style={styles.nextIdeaBtn}
                onPress={() => setDistractIdx((i) => getNextDistraction(i))}
              >
                <Text style={styles.nextIdeaText}>↻ Give me another idea</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>

          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => setStep(3)}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryBtnText}>That helped ✓ Next</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ── STEP 3: LOG ── */}
      {step === 3 && (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            contentContainerStyle={styles.logScroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.bigTitle}>Log this craving</Text>
            <Text style={styles.bodyTextLeft}>
              Optional — helps you spot your patterns over time.
            </Text>

            <Text style={styles.logLabel}>How intense was it?</Text>
            <View style={styles.intensityRow}>
              {([
                { v: 1 as const, l: 'Mild' },
                { v: 2 as const, l: '' },
                { v: 3 as const, l: 'Medium' },
                { v: 4 as const, l: '' },
                { v: 5 as const, l: 'Strong' },
              ]).map(({ v, l }) => (
                <TouchableOpacity
                  key={v}
                  style={[styles.intensityBtn, intensity === v && styles.intensityBtnActive]}
                  onPress={() => setIntensity(v)}
                >
                  <Text style={[styles.intensityNum, intensity === v && styles.intensityNumActive]}>
                    {v}
                  </Text>
                  {l ? <Text style={styles.intensityLbl}>{l}</Text> : null}
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.logLabel}>What triggered it?</Text>
            <View style={styles.triggerChips}>
              {TRIGGERS.map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[
                    styles.triggerChip,
                    selectedTriggers.includes(t) && styles.triggerChipActive,
                  ]}
                  onPress={() => toggleTrigger(t)}
                >
                  <Text
                    style={[
                      styles.triggerChipText,
                      selectedTriggers.includes(t) && styles.triggerChipTextActive,
                    ]}
                  >
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.logLabel}>Add a note (optional)</Text>
            <TextInput
              style={styles.noteInput}
              value={note}
              onChangeText={setNote}
              placeholder="What was going on…"
              placeholderTextColor={colors.muted}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />

            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={handleSave}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryBtnText}>Save & Finish →</Text>
            </TouchableOpacity>

            <View style={{ height: 24 }} />
          </ScrollView>
        </KeyboardAvoidingView>
      )}

      {/* ── STEP 4: MASCOT RESPONSE ── */}
      {step === 4 && (
        <View style={styles.centerFlex}>
          <View style={styles.respBadge}>
            <Text style={styles.respBadgeText}>✓ CRAVING SURVIVED</Text>
          </View>

          <BudSVG width={100} height={108} mood="happy" />

          <Text style={styles.respTitle}>You did it. 💪</Text>
          <Text style={styles.respMsg}>{affirmation}</Text>

          <View style={styles.respStatRow}>
            <View style={styles.respStat}>
              <Text style={styles.respStatVal}>{cravingsBeaten}</Text>
              <Text style={styles.respStatLbl}>Cravings beaten</Text>
            </View>
            <View style={styles.respStat}>
              <Text style={styles.respStatVal}>{streakDays}</Text>
              <Text style={styles.respStatLbl}>Day streak</Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.primaryBtn, styles.primaryBtnFull]}
            onPress={() => router.back()}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryBtnText}>Back home 🌿</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  )
}

export default function CravingScreenWrapped() {
  return (
    <ErrorBoundary>
      <CravingScreen />
    </ErrorBoundary>
  )
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  handleWrap: { alignItems: 'center', paddingTop: 10 },
  handle: { width: 36, height: 4, backgroundColor: '#E2EDE8', borderRadius: 2 },
  progressRow: { flexDirection: 'row', gap: 6, paddingHorizontal: 20, paddingTop: 12 },
  stepDot: { flex: 1, height: 4, borderRadius: 2, backgroundColor: '#E2EDE8' },
  stepDotDone: { backgroundColor: colors.accent },
  stepDotActive: { backgroundColor: colors.warm },

  // Shared
  centerFlex: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, gap: 16 },
  stepFlex: { flex: 1, paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16, gap: 14 },
  bigTitle: { fontSize: 22, fontWeight: '800', color: colors.text, textAlign: 'center' },
  bodyText: { fontSize: 13, color: colors.muted, textAlign: 'center', lineHeight: 20 },
  bodyTextLeft: { fontSize: 13, color: colors.muted, lineHeight: 20 },
  primaryBtn: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#2D6A4F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  primaryBtnFull: { width: '100%' },
  primaryBtnText: { fontSize: 15, fontWeight: '700', color: colors.white },

  // Step 1 — breathing
  breathWrap: { width: 200, height: 200, alignItems: 'center', justifyContent: 'center' },
  breathRing: {
    position: 'absolute',
    width: 200, height: 200, borderRadius: 100,
    borderWidth: 3, borderColor: colors.accent,
  },
  breathMid: {
    position: 'absolute',
    width: 164, height: 164, borderRadius: 82,
    backgroundColor: 'rgba(82,183,136,0.1)',
  },
  breathInnerWrap: { width: 120, height: 120, alignItems: 'center', justifyContent: 'center' },
  breathInner: {
    width: 120, height: 120, borderRadius: 60,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4, shadowRadius: 20, elevation: 4,
  },
  breathPhaseText: { fontSize: 13, fontWeight: '700', color: colors.white, textAlign: 'center', lineHeight: 18 },
  breathCount: { fontSize: 13, color: colors.muted, fontWeight: '600' },
  skipBtn: { padding: 10 },
  skipText: { fontSize: 13, color: colors.muted },

  // Step 2 — distraction
  distractCardWrap: {
    flex: 1, borderRadius: 20, overflow: 'hidden',
    shadowColor: '#2D6A4F', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25, shadowRadius: 12, elevation: 5,
  },
  distractCard: { flex: 1, padding: 24, paddingHorizontal: 20, justifyContent: 'space-between' },
  distractIcon: { fontSize: 42, marginBottom: 12 },
  distractTitle: { fontSize: 20, fontWeight: '800', color: colors.white, lineHeight: 26 },
  distractWhy: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 8, lineHeight: 19 },
  nextIdeaBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12,
    padding: 12, alignItems: 'center', marginTop: 16,
  },
  nextIdeaText: { fontSize: 13, fontWeight: '600', color: colors.white },

  // Step 3 — log
  logScroll: { paddingHorizontal: 20, paddingTop: 12, gap: 12 },
  logLabel: { fontSize: 11, fontWeight: '700', color: colors.muted, textTransform: 'uppercase', letterSpacing: 0.8, marginTop: 4 },
  intensityRow: { flexDirection: 'row', gap: 8 },
  intensityBtn: {
    flex: 1, backgroundColor: colors.card, borderWidth: 2, borderColor: '#E2EDE8',
    borderRadius: 12, paddingVertical: 10, alignItems: 'center',
  },
  intensityBtnActive: { borderColor: colors.warm, backgroundColor: '#FFF5EE' },
  intensityNum: { fontSize: 16, fontWeight: '800', color: colors.text },
  intensityNumActive: { color: colors.warm },
  intensityLbl: { fontSize: 9, color: colors.muted, fontWeight: '600', marginTop: 2 },
  triggerChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  triggerChip: {
    backgroundColor: colors.card, borderWidth: 1.5, borderColor: '#E2EDE8',
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6,
  },
  triggerChipActive: { backgroundColor: '#E8F5EE', borderColor: colors.accent },
  triggerChipText: { fontSize: 12, fontWeight: '500', color: colors.text },
  triggerChipTextActive: { color: colors.primary, fontWeight: '600' },
  noteInput: {
    backgroundColor: colors.card, borderWidth: 1.5, borderColor: '#E2EDE8',
    borderRadius: 12, padding: 12, paddingHorizontal: 14,
    fontSize: 13, color: colors.text, minHeight: 72,
  },

  // Step 4 — mascot response
  respBadge: { backgroundColor: '#E8F5EE', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  respBadgeText: { fontSize: 11, fontWeight: '700', color: colors.primary, letterSpacing: 0.8 },
  respTitle: { fontSize: 22, fontWeight: '800', color: colors.text, textAlign: 'center' },
  respMsg: { fontSize: 14, color: colors.muted, textAlign: 'center', lineHeight: 21, marginHorizontal: 8 },
  respStatRow: { flexDirection: 'row', gap: 12, width: '100%' },
  respStat: {
    flex: 1, backgroundColor: colors.card, borderRadius: 14, padding: 14, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 1,
  },
  respStatVal: { fontSize: 22, fontWeight: '800', color: colors.primary },
  respStatLbl: { fontSize: 10, color: colors.muted, fontWeight: '500', marginTop: 2, textAlign: 'center' },
})
