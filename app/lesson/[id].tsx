import { useEffect, useRef, useState } from 'react'
import {
  Animated,
  Dimensions,
  Easing,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { LESSON_REGISTRY, LESSON_SECTIONS } from '@/content/lessons'
import { useLessonsStore } from '@/store/lessonsStore'
import { BudSVG } from '@/components/mascot/BudSVG'
import { colors } from '@/constants/colors'
import type { ChoiceCard, InfoCard, LessonCard, ReflectionCard, TrueFalseCard } from '@/types/lesson'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

// --- Confetti particle ---
interface Particle {
  x: Animated.Value
  y: Animated.Value
  opacity: Animated.Value
  rotate: Animated.Value
  color: string
  size: number
}

const CONFETTI_COLORS = ['#F0B429', '#52B788', '#E07A36', '#2D6A4F', '#FF6B6B', '#4ECDC4']

function useConfetti(active: boolean) {
  const particles = useRef<Particle[]>([])

  if (particles.current.length === 0) {
    particles.current = Array.from({ length: 30 }, () => ({
      x: new Animated.Value(Math.random() * SCREEN_WIDTH),
      y: new Animated.Value(-20),
      opacity: new Animated.Value(1),
      rotate: new Animated.Value(0),
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      size: 6 + Math.random() * 8,
    }))
  }

  useEffect(() => {
    if (!active) return
    const anims = particles.current.map((p) => {
      p.x.setValue(Math.random() * SCREEN_WIDTH)
      p.y.setValue(-20)
      p.opacity.setValue(1)
      p.rotate.setValue(0)
      return Animated.parallel([
        Animated.timing(p.y, {
          toValue: 700,
          duration: 2000 + Math.random() * 1000,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(p.opacity, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(p.rotate, {
          toValue: 6,
          duration: 2000 + Math.random() * 1000,
          useNativeDriver: true,
        }),
      ])
    })
    Animated.stagger(60, anims).start()
  }, [active])

  return particles.current
}

// --- Progress bar ---
function ProgressBar({ total, current }: { total: number; current: number }) {
  return (
    <View style={styles.progressRow}>
      {Array.from({ length: total }, (_, i) => (
        <View
          key={i}
          style={[
            styles.progressSegment,
            i < current ? styles.progressFilled : styles.progressEmpty,
          ]}
        />
      ))}
    </View>
  )
}

// --- Card renderers ---
function InfoCardView({ card, onNext }: { card: InfoCard; onNext: () => void }) {
  return (
    <View style={styles.cardBody}>
      {card.emoji ? <Text style={styles.cardEmoji}>{card.emoji}</Text> : null}
      <Text style={styles.cardHeading}>{card.heading}</Text>
      <Text style={styles.cardBodyText}>{card.body}</Text>
      <TouchableOpacity style={styles.primaryBtn} onPress={onNext} activeOpacity={0.8}>
        <LinearGradient
          colors={[colors.primary, '#3A8563']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.primaryBtnGradient}
        >
          <Text style={styles.primaryBtnText}>Got it →</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  )
}

function ChoiceCardView({ card, onNext }: { card: ChoiceCard; onNext: () => void }) {
  const [selected, setSelected] = useState<number | null>(null)
  const autoRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function handleSelect(idx: number) {
    if (selected !== null) return
    setSelected(idx)
    if (card.options[idx].correct) {
      autoRef.current = setTimeout(onNext, 900)
    }
  }

  useEffect(() => () => { if (autoRef.current) clearTimeout(autoRef.current) }, [])

  const answered = selected !== null
  const isCorrect = answered && card.options[selected].correct

  return (
    <View style={styles.cardBody}>
      <Text style={styles.questionText}>{card.question}</Text>
      {card.options.map((opt, i) => {
        let optStyle: StyleProp<ViewStyle> = styles.optionDefault
        let textStyle: StyleProp<TextStyle> = styles.optionTextDefault
        if (answered && i === selected) {
          optStyle = opt.correct ? styles.optionCorrect : styles.optionWrong
          textStyle = styles.optionTextSelected
        } else if (answered && opt.correct) {
          optStyle = styles.optionCorrect
          textStyle = styles.optionTextSelected
        }
        return (
          <TouchableOpacity
            key={i}
            style={[styles.option, optStyle]}
            onPress={() => handleSelect(i)}
            activeOpacity={0.75}
            disabled={answered}
          >
            <Text style={[styles.optionText, textStyle]}>{opt.text}</Text>
          </TouchableOpacity>
        )
      })}
      {answered && card.explanation ? (
        <View style={[styles.explanationBox, isCorrect ? styles.explanationGreen : styles.explanationRed]}>
          <Text style={styles.explanationText}>
            {isCorrect ? '✓ ' : '✗ '}{card.explanation}
          </Text>
        </View>
      ) : null}
      {answered && !isCorrect ? (
        <TouchableOpacity style={styles.primaryBtn} onPress={onNext} activeOpacity={0.8}>
          <LinearGradient
            colors={[colors.primary, '#3A8563']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.primaryBtnGradient}
          >
            <Text style={styles.primaryBtnText}>Continue →</Text>
          </LinearGradient>
        </TouchableOpacity>
      ) : null}
    </View>
  )
}

function TrueFalseCardView({ card, onNext }: { card: TrueFalseCard; onNext: () => void }) {
  const [selected, setSelected] = useState<boolean | null>(null)
  const autoRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function handleSelect(val: boolean) {
    if (selected !== null) return
    setSelected(val)
    if (val === card.answer) {
      autoRef.current = setTimeout(onNext, 900)
    }
  }

  useEffect(() => () => { if (autoRef.current) clearTimeout(autoRef.current) }, [])

  const answered = selected !== null
  const isCorrect = answered && selected === card.answer

  function btnStyle(val: boolean) {
    if (!answered) return styles.tfBtn
    if (val === selected) return val === card.answer ? styles.tfBtnCorrect : styles.tfBtnWrong
    if (val === card.answer) return styles.tfBtnCorrect
    return styles.tfBtn
  }

  function btnTextStyle(val: boolean) {
    if (!answered) return styles.tfBtnText
    if (val === selected || val === card.answer) return styles.tfBtnTextSelected
    return styles.tfBtnText
  }

  return (
    <View style={styles.cardBody}>
      <Text style={styles.questionText}>{card.statement}</Text>
      <View style={styles.tfRow}>
        <TouchableOpacity
          style={[styles.tfBtn, btnStyle(true)]}
          onPress={() => handleSelect(true)}
          disabled={answered}
          activeOpacity={0.75}
        >
          <Text style={[styles.tfBtnText, btnTextStyle(true)]}>TRUE</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tfBtn, btnStyle(false)]}
          onPress={() => handleSelect(false)}
          disabled={answered}
          activeOpacity={0.75}
        >
          <Text style={[styles.tfBtnText, btnTextStyle(false)]}>FALSE</Text>
        </TouchableOpacity>
      </View>
      {answered && card.explanation ? (
        <View style={[styles.explanationBox, isCorrect ? styles.explanationGreen : styles.explanationRed]}>
          <Text style={styles.explanationText}>
            {isCorrect ? '✓ ' : '✗ '}{card.explanation}
          </Text>
        </View>
      ) : null}
      {answered && !isCorrect ? (
        <TouchableOpacity style={styles.primaryBtn} onPress={onNext} activeOpacity={0.8}>
          <LinearGradient
            colors={[colors.primary, '#3A8563']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.primaryBtnGradient}
          >
            <Text style={styles.primaryBtnText}>Continue →</Text>
          </LinearGradient>
        </TouchableOpacity>
      ) : null}
    </View>
  )
}

function ReflectionCardView({ card, onNext }: { card: ReflectionCard; onNext: () => void }) {
  const [text, setText] = useState('')
  return (
    <View style={styles.cardBody}>
      <Text style={styles.reflectionLabel}>REFLECTION</Text>
      <Text style={styles.questionText}>{card.prompt}</Text>
      <TextInput
        style={styles.reflectionInput}
        placeholder="Write your thoughts here…"
        placeholderTextColor={colors.muted}
        multiline
        value={text}
        onChangeText={setText}
        maxLength={500}
      />
      <Text style={styles.charCount}>{text.length}/500</Text>
      <TouchableOpacity style={styles.primaryBtn} onPress={onNext} activeOpacity={0.8}>
        <LinearGradient
          colors={[colors.primary, '#3A8563']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.primaryBtnGradient}
        >
          <Text style={styles.primaryBtnText}>Continue →</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  )
}

function CardRenderer({ card, onNext }: { card: LessonCard; onNext: () => void }) {
  switch (card.type) {
    case 'info':        return <InfoCardView card={card} onNext={onNext} />
    case 'choice':      return <ChoiceCardView card={card} onNext={onNext} />
    case 'true_false':  return <TrueFalseCardView card={card} onNext={onNext} />
    case 'reflection':  return <ReflectionCardView card={card} onNext={onNext} />
  }
}

// --- Completion screen ---
function CompletionScreen({
  lessonId,
  xp,
  onBack,
  onNext,
}: {
  lessonId: string
  xp: number
  onBack: () => void
  onNext: (() => void) | null
}) {
  const particles = useConfetti(true)
  const scaleAnim = useRef(new Animated.Value(0)).current
  const xpAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 1, friction: 5, tension: 80, useNativeDriver: true }),
      Animated.spring(xpAnim, { toValue: 1, friction: 6, tension: 100, useNativeDriver: true }),
    ]).start()
  }, [])

  return (
    <View style={styles.completionContainer}>
      {/* Confetti */}
      {particles.map((p, i) => (
        <Animated.View
          key={i}
          style={[
            styles.confettiPiece,
            {
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              transform: [
                { translateX: p.x },
                { translateY: p.y },
                {
                  rotate: p.rotate.interpolate({
                    inputRange: [0, 6],
                    outputRange: ['0deg', '1080deg'],
                  }),
                },
              ],
              opacity: p.opacity,
            },
          ]}
          pointerEvents="none"
        />
      ))}

      <Animated.View style={{ transform: [{ scale: scaleAnim }], alignItems: 'center' }}>
        <BudSVG width={120} height={130} mood="happy" />
      </Animated.View>

      <Text style={styles.completionTitle}>Lesson complete!</Text>
      <Text style={styles.completionSub}>Great work — keep building that streak 🔥</Text>

      <Animated.View style={[styles.xpBadge, { transform: [{ scale: xpAnim }] }]}>
        <LinearGradient
          colors={['#F0B429', '#E8A020']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.xpBadgeGradient}
        >
          <Text style={styles.xpBadgeText}>⚡ +{xp} XP</Text>
        </LinearGradient>
      </Animated.View>

      <View style={styles.completionBtns}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.8}>
          <Text style={styles.backBtnText}>← Back to lessons</Text>
        </TouchableOpacity>
        {onNext ? (
          <TouchableOpacity style={styles.nextLessonBtn} onPress={onNext} activeOpacity={0.8}>
            <LinearGradient
              colors={[colors.primary, '#3A8563']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.nextLessonBtnGradient}
            >
              <Text style={styles.nextLessonBtnText}>Next lesson →</Text>
            </LinearGradient>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  )
}

// --- Main screen ---
export default function LessonScreen() {
  const insets = useSafeAreaInsets()
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const { completeLesson, completedLessons } = useLessonsStore()

  const lesson = id ? LESSON_REGISTRY[id] : null

  const [cardIndex, setCardIndex] = useState(0)
  const [completed, setCompleted] = useState(false)
  const slideAnim = useRef(new Animated.Value(0)).current

  // Find next lesson id
  const nextLessonId = (() => {
    if (!id) return null
    for (const section of LESSON_SECTIONS) {
      const idx = section.lessons.indexOf(id)
      if (idx !== -1 && idx + 1 < section.lessons.length) {
        return section.lessons[idx + 1]
      }
      // Check next section
      const sectionIdx = LESSON_SECTIONS.indexOf(section)
      if (idx === section.lessons.length - 1 && sectionIdx + 1 < LESSON_SECTIONS.length) {
        return LESSON_SECTIONS[sectionIdx + 1].lessons[0]
      }
    }
    return null
  })()

  function advanceCard() {
    if (!lesson) return
    const isLast = cardIndex === lesson.cards.length - 1
    if (isLast) {
      completeLesson(lesson.id, lesson.xp)
      setCompleted(true)
      return
    }
    // Slide out left, jump right, spring in
    Animated.timing(slideAnim, {
      toValue: -SCREEN_WIDTH,
      duration: 200,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start(() => {
      slideAnim.setValue(SCREEN_WIDTH)
      setCardIndex((prev) => prev + 1)
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 100,
        useNativeDriver: true,
      }).start()
    })
  }

  function handleBack() {
    router.back()
  }

  function handleNextLesson() {
    if (nextLessonId) {
      router.replace(`/lesson/${nextLessonId}`)
    }
  }

  if (!lesson) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Text style={styles.errorText}>Lesson not found.</Text>
        <TouchableOpacity onPress={handleBack}>
          <Text style={styles.errorBack}>← Back</Text>
        </TouchableOpacity>
      </View>
    )
  }

  if (completed) {
    return (
      <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <CompletionScreen
          lessonId={lesson.id}
          xp={lesson.xp}
          onBack={handleBack}
          onNext={nextLessonId ? handleNextLesson : null}
        />
      </View>
    )
  }

  const card = lesson.cards[cardIndex]
  const alreadyDone = completedLessons.includes(lesson.id)

  return (
    <View style={styles.container}>
      {/* Top bar — paddingTop uses live inset so it clears Dynamic Island / notch / status bar on all devices */}
      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={handleBack} style={styles.closeBtn} activeOpacity={0.7}>
          <Text style={styles.closeBtnText}>✕</Text>
        </TouchableOpacity>
        <ProgressBar total={lesson.cards.length} current={cardIndex} />
        <View style={styles.xpPill}>
          <Text style={styles.xpPillText}>+{lesson.xp} XP</Text>
        </View>
      </View>

      {/* Card */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View style={{ transform: [{ translateX: slideAnim }] }}>
          {alreadyDone && (
            <View style={styles.reviewBadge}>
              <Text style={styles.reviewBadgeText}>REVIEW MODE</Text>
            </View>
          )}
          <View style={styles.card}>
            <CardRenderer card={card} onNext={advanceCard} />
          </View>
        </Animated.View>
      </ScrollView>

      {/* Card counter */}
      <View style={[styles.cardCounter, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <Text style={styles.cardCounterText}>
          {cardIndex + 1} / {lesson.cards.length}
        </Text>
      </View>
    </View>
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
    paddingHorizontal: 16,
    paddingBottom: 10,
    gap: 10,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 14,
    color: colors.muted,
    fontWeight: '600',
  },
  progressRow: {
    flex: 1,
    flexDirection: 'row',
    gap: 4,
  },
  progressSegment: {
    flex: 1,
    height: 6,
    borderRadius: 3,
  },
  progressFilled: {
    backgroundColor: colors.accent,
  },
  progressEmpty: {
    backgroundColor: '#D5E8DC',
  },
  xpPill: {
    backgroundColor: '#E8F5EE',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  xpPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  reviewBadge: {
    backgroundColor: '#FFF3CD',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  reviewBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#856404',
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  cardBody: {
    padding: 20,
    paddingBottom: 24,
  },
  cardEmoji: {
    fontSize: 36,
    marginBottom: 12,
    textAlign: 'center',
  },
  cardHeading: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
    lineHeight: 26,
  },
  cardBodyText: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 24,
    marginBottom: 24,
  },
  questionText: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
    lineHeight: 25,
    marginBottom: 16,
  },
  primaryBtn: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
  },
  primaryBtnGradient: {
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 12,
  },
  primaryBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.white,
  },
  option: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 2,
  },
  optionDefault: {
    backgroundColor: colors.bg,
    borderColor: '#D5E8DC',
  },
  optionCorrect: {
    backgroundColor: '#E8F5EE',
    borderColor: colors.accent,
  },
  optionWrong: {
    backgroundColor: '#FEE8E8',
    borderColor: '#E05A5A',
  },
  optionText: {
    fontSize: 14,
    lineHeight: 20,
  },
  optionTextDefault: {
    color: colors.text,
    fontWeight: '500',
  },
  optionTextSelected: {
    fontWeight: '700',
    color: colors.text,
  },
  explanationBox: {
    borderRadius: 10,
    padding: 12,
    marginTop: 8,
    marginBottom: 4,
  },
  explanationGreen: {
    backgroundColor: '#E8F5EE',
  },
  explanationRed: {
    backgroundColor: '#FEE8E8',
  },
  explanationText: {
    fontSize: 13,
    color: colors.text,
    lineHeight: 20,
  },
  tfRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
  },
  tfBtn: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    backgroundColor: colors.bg,
    borderColor: '#D5E8DC',
  },
  tfBtnCorrect: {
    backgroundColor: '#E8F5EE',
    borderColor: colors.accent,
  },
  tfBtnWrong: {
    backgroundColor: '#FEE8E8',
    borderColor: '#E05A5A',
  },
  tfBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  tfBtnTextSelected: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
  },
  reflectionLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.muted,
    letterSpacing: 1,
    marginBottom: 8,
  },
  reflectionInput: {
    backgroundColor: colors.bg,
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    color: colors.text,
    lineHeight: 22,
    minHeight: 120,
    textAlignVertical: 'top',
    marginTop: 8,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#D5E8DC',
  },
  charCount: {
    fontSize: 11,
    color: colors.muted,
    textAlign: 'right',
    marginBottom: 12,
  },
  cardCounter: {
    alignItems: 'center',
    paddingBottom: 12,
    paddingTop: 4,
  },
  cardCounterText: {
    fontSize: 12,
    color: colors.muted,
    fontWeight: '500',
  },
  errorText: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    margin: 24,
  },
  errorBack: {
    fontSize: 14,
    color: colors.primary,
    textAlign: 'center',
  },
  // Completion screen
  completionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  confettiPiece: {
    position: 'absolute',
    top: 0,
    borderRadius: 3,
  },
  completionTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginTop: 16,
    textAlign: 'center',
  },
  completionSub: {
    fontSize: 15,
    color: colors.muted,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 22,
  },
  xpBadge: {
    marginTop: 20,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#F0B429',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  xpBadgeGradient: {
    paddingHorizontal: 28,
    paddingVertical: 12,
    alignItems: 'center',
  },
  xpBadgeText: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.white,
  },
  completionBtns: {
    width: '100%',
    gap: 10,
    marginTop: 32,
  },
  backBtn: {
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D5E8DC',
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: colors.card,
  },
  backBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
  },
  nextLessonBtn: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  nextLessonBtnGradient: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  nextLessonBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.white,
  },
})
