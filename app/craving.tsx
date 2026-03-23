import { useRef, useState } from 'react'
import {
  Animated,
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
import { colors } from '@/constants/colors'

type Step = 'breathing' | 'distraction' | 'log' | 'mascot'

const DISTRACTIONS = [
  { icon: '🚶', act: 'Go for a 5-minute walk', why: 'Physical movement floods your brain with dopamine and quickly interrupts the craving cycle.' },
  { icon: '💧', act: 'Drink a glass of cold water', why: 'Hydration immediately shifts your body state and gives your hands something to do.' },
  { icon: '💪', act: 'Do 10 push-ups', why: 'Exercise triggers the same reward pathways cannabis activates — without the side effects.' },
  { icon: '📱', act: 'Text a friend right now', why: 'Social connection releases oxytocin and gets your mind off the craving fast.' },
  { icon: '🎵', act: 'Listen to your favourite song', why: 'Music activates the brain\'s reward system and gives the craving a chance to pass.' },
  { icon: '🍵', act: 'Make a cup of tea', why: 'A warm ritual gives you something comforting to do while the craving peaks and fades.' },
]

const TRIGGERS = ['😤 Stress', '👥 Social', '😴 Boredom', '🌆 Evening', '😢 Emotions', '🍺 Alcohol']

export default function CravingScreen() {
  const router = useRouter()
  const { addCravingEntry } = useJournalStore()
  const { quitDate } = useStreakStore()
  const streakDays = getStreakDays(quitDate)

  const [step, setStep] = useState<Step>('breathing')
  const [distractIdx, setDistractionIdx] = useState(0)
  const [intensity, setIntensity] = useState<1 | 2 | 3 | 4 | 5>(3)
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([])
  const [note, setNote] = useState('')
  const cravingsBeaten = useJournalStore((s) => s.cravingLog.length)

  const distraction = DISTRACTIONS[distractIdx % DISTRACTIONS.length]

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
    setStep('mascot')
  }

  const stepDots: Step[] = ['breathing', 'distraction', 'log', 'mascot']

  return (
    <SafeAreaView style={styles.container}>
      {/* Modal handle */}
      <View style={styles.handleWrap}>
        <View style={styles.handle} />
      </View>

      {/* Progress dots */}
      <View style={styles.progressRow}>
        {stepDots.map((s, i) => {
          const currentIdx = stepDots.indexOf(step)
          const isDone = i < currentIdx
          const isActive = i === currentIdx
          return (
            <View
              key={s}
              style={[
                styles.stepDot,
                isDone && styles.stepDotDone,
                isActive && styles.stepDotActive,
              ]}
            />
          )
        })}
      </View>

      {/* ── STEP 1: BREATHING ── */}
      {step === 'breathing' && (
        <View style={styles.centerFlex}>
          <Text style={styles.bigTitle}>You've got this.</Text>
          <Text style={styles.bodyText}>
            Let's slow things down.{'\n'}Follow Bud's breathing.
          </Text>
          <View style={styles.breatheCircleWrap}>
            <View style={styles.breatheOuter} />
            <View style={styles.breatheMid} />
            <LinearGradient
              colors={[colors.accent, colors.primary]}
              style={styles.breatheInner}
            >
              <Text style={styles.breatheText}>Breathe{'\n'}in…</Text>
            </LinearGradient>
          </View>
          <Text style={styles.breatheCount}>Round 1 of 3 · 4-7-8 breathing</Text>
          <TouchableOpacity onPress={() => setStep('distraction')} style={styles.skipBtn}>
            <Text style={styles.skipText}>Skip →</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ── STEP 2: DISTRACTION ── */}
      {step === 'distraction' && (
        <View style={styles.stepFlex}>
          <Text style={styles.bigTitle}>Try this right now.</Text>
          <Text style={styles.bodyTextSm}>
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
                <Text style={styles.distractIcon}>{distraction.icon}</Text>
                <Text style={styles.distractAct}>{distraction.act}</Text>
                <Text style={styles.distractWhy}>{distraction.why}</Text>
              </View>
              <TouchableOpacity
                style={styles.nextIdeaBtn}
                onPress={() => setDistractionIdx((i) => i + 1)}
              >
                <Text style={styles.nextIdeaText}>↻ Give me another idea</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => setStep('log')}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryBtnText}>That helped ✓ Next</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ── STEP 3: LOG ── */}
      {step === 'log' && (
        <ScrollView contentContainerStyle={styles.logScroll} showsVerticalScrollIndicator={false}>
          <Text style={styles.bigTitle}>Log this craving</Text>
          <Text style={styles.bodyTextSm}>
            Optional — helps you spot your patterns over time.
          </Text>

          <Text style={styles.logLabel}>How intense was it?</Text>
          <View style={styles.intensityRow}>
            {([
              { v: 1, l: 'Mild' },
              { v: 2, l: '' },
              { v: 3, l: 'Medium' },
              { v: 4, l: '' },
              { v: 5, l: 'Strong' },
            ] as { v: 1 | 2 | 3 | 4 | 5; l: string }[]).map(({ v, l }) => (
              <TouchableOpacity
                key={v}
                style={[styles.intensityBtn, intensity === v && styles.intensityBtnActive]}
                onPress={() => setIntensity(v)}
              >
                <Text style={[styles.intensityNum, intensity === v && styles.intensityNumActive]}>
                  {v}
                </Text>
                <Text style={styles.intensityLbl}>{l}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.logLabel}>What triggered it?</Text>
          <View style={styles.triggerChips}>
            {TRIGGERS.map((t) => (
              <TouchableOpacity
                key={t}
                style={[styles.triggerChip, selectedTriggers.includes(t) && styles.triggerChipActive]}
                onPress={() => toggleTrigger(t)}
              >
                <Text style={[styles.triggerChipText, selectedTriggers.includes(t) && styles.triggerChipTextActive]}>
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
          />

          <TouchableOpacity style={styles.primaryBtn} onPress={handleSave} activeOpacity={0.85}>
            <Text style={styles.primaryBtnText}>Save & Finish →</Text>
          </TouchableOpacity>

          <View style={{ height: 24 }} />
        </ScrollView>
      )}

      {/* ── STEP 4: MASCOT ── */}
      {step === 'mascot' && (
        <View style={styles.centerFlex}>
          <View style={styles.respBadge}>
            <Text style={styles.respBadgeText}>✓ CRAVING SURVIVED</Text>
          </View>
          <BudSVG width={100} height={108} mood="happy" />
          <Text style={styles.respTitle}>You just beat a craving. 💪</Text>
          <Text style={styles.respMsg}>
            That takes real strength. Every time you push through, you're literally rewiring your brain. Bud is proud of you.
          </Text>
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
            style={[styles.primaryBtn, { marginTop: 4 }]}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  handleWrap: {
    alignItems: 'center',
    paddingTop: 10,
  },
  handle: {
    width: 36,
    height: 4,
    backgroundColor: '#E2EDE8',
    borderRadius: 2,
  },
  progressRow: {
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  stepDot: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E2EDE8',
  },
  stepDotDone: {
    backgroundColor: colors.accent,
  },
  stepDotActive: {
    backgroundColor: colors.warm,
  },
  centerFlex: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 14,
  },
  stepFlex: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    gap: 12,
  },
  bigTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
  },
  bodyText: {
    fontSize: 13,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 20,
  },
  bodyTextSm: {
    fontSize: 13,
    color: colors.muted,
    lineHeight: 19,
  },
  // Breathing circle
  breatheCircleWrap: {
    width: 180,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  breatheOuter: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 3,
    borderColor: colors.accent,
    opacity: 0.3,
  },
  breatheMid: {
    position: 'absolute',
    width: 148,
    height: 148,
    borderRadius: 74,
    backgroundColor: 'rgba(82,183,136,0.12)',
  },
  breatheInner: {
    width: 108,
    height: 108,
    borderRadius: 54,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 4,
  },
  breatheText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.white,
    textAlign: 'center',
    lineHeight: 18,
  },
  breatheCount: {
    fontSize: 13,
    color: colors.muted,
    fontWeight: '600',
  },
  skipBtn: {
    padding: 10,
  },
  skipText: {
    fontSize: 13,
    color: colors.muted,
  },
  // Distraction
  distractCardWrap: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#2D6A4F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 5,
  },
  distractCard: {
    flex: 1,
    padding: 24,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  distractIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  distractAct: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.white,
    lineHeight: 26,
  },
  distractWhy: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 8,
    lineHeight: 18,
  },
  nextIdeaBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  nextIdeaText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.white,
  },
  // Log
  logScroll: {
    paddingHorizontal: 20,
    paddingTop: 8,
    gap: 12,
  },
  logLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  intensityRow: {
    flexDirection: 'row',
    gap: 8,
  },
  intensityBtn: {
    flex: 1,
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: '#E2EDE8',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  intensityBtnActive: {
    borderColor: colors.warm,
    backgroundColor: '#FFF5EE',
  },
  intensityNum: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  intensityNumActive: {
    color: colors.warm,
  },
  intensityLbl: {
    fontSize: 9,
    color: colors.muted,
    fontWeight: '600',
    marginTop: 2,
  },
  triggerChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  triggerChip: {
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: '#E2EDE8',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  triggerChipActive: {
    backgroundColor: '#E8F5EE',
    borderColor: colors.accent,
  },
  triggerChipText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text,
  },
  triggerChipTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  noteInput: {
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: '#E2EDE8',
    borderRadius: 12,
    padding: 12,
    paddingHorizontal: 14,
    fontSize: 13,
    color: colors.text,
    minHeight: 60,
  },
  // Mascot response
  respBadge: {
    backgroundColor: '#E8F5EE',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  respBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 0.8,
  },
  respTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    lineHeight: 28,
  },
  respMsg: {
    fontSize: 14,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 21,
  },
  respStatRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  respStat: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  respStatVal: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primary,
  },
  respStatLbl: {
    fontSize: 10,
    color: colors.muted,
    fontWeight: '500',
    marginTop: 2,
    textAlign: 'center',
  },
  // Shared
  primaryBtn: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    width: '100%',
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
