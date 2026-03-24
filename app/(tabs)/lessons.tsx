import { useEffect, useRef } from 'react'
import {
  Animated,
  Dimensions,
  Easing,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import Svg, { Line } from 'react-native-svg'
import { Check, Lock, Play } from 'lucide-react-native'
import { useLessonsStore } from '@/store/lessonsStore'
import { LESSON_SECTIONS } from '@/content/lessons'
import { BudSVG } from '@/components/mascot/BudSVG'
import { colors } from '@/constants/colors'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

// Layout constants
const NODE_SIZE = 64
const H_PADDING = 44
const LEFT_X = H_PADDING + NODE_SIZE / 2
const RIGHT_X = SCREEN_WIDTH - H_PADDING - NODE_SIZE / 2
const ROW_HEIGHT = 112
// Space above the first node row for section banners + mascot
const TOP_OFFSET = 88

type NodeState = 'completed' | 'current' | 'locked' | 'milestone'

interface LessonNode {
  lessonId: string
  title: string
  xp: number
  state: NodeState
  x: number
  y: number
  sectionTitle?: string
}

function buildNodes(completedLessons: string[]): { nodes: LessonNode[]; totalHeight: number } {
  const nodes: LessonNode[] = []
  let row = 0

  LESSON_SECTIONS.forEach((section) => {
    section.lessons.forEach((lessonId, lIdx) => {
      const isMilestone = lIdx === section.lessons.length - 1
      const x = row % 2 === 0 ? LEFT_X : RIGHT_X

      let state: NodeState
      if (completedLessons.includes(lessonId)) {
        state = isMilestone ? 'milestone' : 'completed'
      } else {
        const prevDone = row === 0 || completedLessons.includes(nodes[row - 1]?.lessonId)
        if (prevDone) {
          state = isMilestone ? 'milestone' : 'current'
        } else {
          state = 'locked'
        }
      }

      nodes.push({
        lessonId,
        title: getLessonTitle(lessonId),
        xp: getLessonXp(lessonId),
        state,
        x,
        y: TOP_OFFSET + row * ROW_HEIGHT,
        sectionTitle: lIdx === 0 ? section.title : undefined,
      })
      row++
    })
  })

  return { nodes, totalHeight: TOP_OFFSET + row * ROW_HEIGHT + 60 }
}

function getLessonTitle(id: string): string {
  const TITLES: Record<string, string> = {
    'understanding-cravings-01': 'Why Cravings Feel Overwhelming',
    'understanding-cravings-02': 'The 20-Minute Window',
    'understanding-cravings-03': "Why You'll Feel Better",
    'trigger-mapping-01': 'Mapping Your Triggers',
    'trigger-mapping-02': 'High-Risk Times',
    'trigger-mapping-03': 'People & Place Triggers',
    'habit-replacement-01': 'Rewiring Your Reward Loop',
    'habit-replacement-02': 'Building the New Normal',
  }
  return TITLES[id] ?? id
}

function getLessonXp(id: string): number {
  const XP: Record<string, number> = {
    'understanding-cravings-01': 20,
    'understanding-cravings-02': 20,
    'understanding-cravings-03': 25,
    'trigger-mapping-01': 25,
    'trigger-mapping-02': 25,
    'trigger-mapping-03': 25,
    'habit-replacement-01': 25,
    'habit-replacement-02': 30,
  }
  return XP[id] ?? 20
}

// --- Mascot bubble above current node ---
function BudBubble({ node }: { node: LessonNode }) {
  const fadeAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start()
  }, [])

  // Position: centered on the node's x, sitting above the node
  const MASCOT_SIZE = 48
  const BUBBLE_HEIGHT = 28
  const BUBBLE_MARGIN = 6
  const totalHeight = MASCOT_SIZE + BUBBLE_HEIGHT + BUBBLE_MARGIN
  const topY = node.y - NODE_SIZE / 2 - totalHeight - 8

  return (
    <Animated.View
      style={[styles.budBubbleWrap, { left: node.x - 60, top: topY, opacity: fadeAnim }]}
      pointerEvents="none"
    >
      {/* Speech bubble */}
      <View style={styles.speechBubble}>
        <Text style={styles.speechBubbleText}>Keep going!</Text>
      </View>
      <View style={styles.speechBubbleTail} />
      {/* Mascot */}
      <BudSVG width={MASCOT_SIZE} height={MASCOT_SIZE} mood="normal" />
    </Animated.View>
  )
}

// --- Node circle ---
function LessonNodeView({ node, onPress }: { node: LessonNode; onPress: () => void }) {
  const { state, title, xp } = node
  const isLeft = node.x < SCREEN_WIDTH / 2
  const isLocked = state === 'locked'
  const isCurrent = state === 'current'
  const isCompleted = state === 'completed'
  const isMilestone = state === 'milestone'

  // Pulse scale animation for current node
  const pulseScale = useRef(new Animated.Value(1)).current
  useEffect(() => {
    if (!isCurrent) return
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseScale, {
          toValue: 1.08,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseScale, {
          toValue: 1.0,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start()
    return () => pulseScale.stopAnimation()
  }, [isCurrent])

  // Node appearance
  let bgColor = '#DDE6E2'
  if (isCompleted) bgColor = colors.accent   // #52B788
  if (isCurrent)   bgColor = colors.warm     // #E07A36
  if (isMilestone) bgColor = isCompleted ? colors.gold : '#FFF3CD'

  const labelSide = isLeft ? { left: NODE_SIZE + 10 } : { right: NODE_SIZE + 10 }

  const nodeInner = (
    <View
      style={[
        styles.nodeCircle,
        {
          width: NODE_SIZE,
          height: NODE_SIZE,
          borderRadius: NODE_SIZE / 2,
          backgroundColor: bgColor,
        },
        isCurrent && styles.nodeCircleCurrent,
        (isCompleted || (isMilestone && isCompleted)) && styles.nodeCircleCompleted,
      ]}
    >
      {isCompleted && <Check size={28} color="#FFFFFF" strokeWidth={3} />}
      {isCurrent   && <Play size={26} color="#FFFFFF" fill="#FFFFFF" />}
      {isLocked    && <Lock size={24} color="#9AB0A6" strokeWidth={2} />}
      {isMilestone && !isCompleted && <Text style={styles.milestoneEmoji}>⭐</Text>}
      {isMilestone && isCompleted  && <Text style={styles.milestoneEmoji}>⭐</Text>}
    </View>
  )

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isLocked}
      activeOpacity={isLocked ? 1 : 0.75}
      style={[
        styles.nodeWrap,
        { left: node.x - NODE_SIZE / 2, top: node.y - NODE_SIZE / 2 },
      ]}
    >
      {isCurrent ? (
        <Animated.View style={{ transform: [{ scale: pulseScale }] }}>
          {nodeInner}
        </Animated.View>
      ) : (
        nodeInner
      )}

      {/* Label */}
      <View style={[styles.nodeLabel, labelSide]}>
        <Text
          style={[styles.nodeLabelTitle, isLocked && styles.nodeLabelTitleMuted]}
          numberOfLines={2}
        >
          {title}
        </Text>
        {!isLocked && (
          <Text style={styles.nodeLabelXp}>+{xp} XP</Text>
        )}
      </View>
    </TouchableOpacity>
  )
}

export default function LessonsScreen() {
  const insets = useSafeAreaInsets()
  const { completedLessons, xp, lessonStreak } = useLessonsStore()
  const router = useRouter()
  const scrollRef = useRef<ScrollView>(null)

  const { nodes, totalHeight } = buildNodes(completedLessons)
  const currentNode = nodes.find((n) => n.state === 'current')
  const sectionHeaders = nodes.filter((n) => n.sectionTitle)

  useEffect(() => {
    if (currentNode && scrollRef.current) {
      setTimeout(() => {
        scrollRef.current?.scrollTo({ y: Math.max(0, currentNode.y - 220), animated: true })
      }, 400)
    }
  }, [])

  // Build connector lines with colour based on node states
  const lines: Array<{ x1: number; y1: number; x2: number; y2: number; done: boolean }> = []
  for (let i = 0; i < nodes.length - 1; i++) {
    const a = nodes[i]
    const b = nodes[i + 1]
    const done =
      (a.state === 'completed' || a.state === 'milestone') &&
      (b.state === 'completed' || b.state === 'milestone')
    lines.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y, done })
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* XP header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Lessons</Text>
          <Text style={styles.subtitle}>{lessonStreak}-day streak 🔥</Text>
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

      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ height: totalHeight }}
        style={styles.pathScroll}
      >
        {/* SVG dashed connector lines */}
        <Svg
          width={SCREEN_WIDTH}
          height={totalHeight}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        >
          {lines.map((l, i) => (
            <Line
              key={i}
              x1={l.x1}
              y1={l.y1}
              x2={l.x2}
              y2={l.y2}
              stroke={l.done ? colors.accent : '#C8D8CE'}
              strokeWidth={3}
              strokeDasharray="8,6"
              strokeLinecap="round"
            />
          ))}
        </Svg>

        {/* Section banners */}
        {sectionHeaders.map((node) => (
          <View
            key={node.lessonId + '-header'}
            style={[styles.sectionBanner, { top: node.y - NODE_SIZE / 2 - 34 }]}
          >
            <LinearGradient
              colors={['#2D6A4F', '#3A8563']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.sectionBannerGradient}
            >
              <Text style={styles.sectionBannerText}>{node.sectionTitle}</Text>
            </LinearGradient>
          </View>
        ))}

        {/* Bud mascot above current node */}
        {currentNode && <BudBubble node={currentNode} />}

        {/* Lesson nodes */}
        {nodes.map((node) => (
          <LessonNodeView
            key={node.lessonId}
            node={node}
            onPress={() => router.push(`/lesson/${node.lessonId}`)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
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
  pathScroll: {
    flex: 1,
  },
  sectionBanner: {
    position: 'absolute',
    left: 16,
    right: 16,
    borderRadius: 10,
    overflow: 'hidden',
  },
  sectionBannerGradient: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    alignItems: 'center',
  },
  sectionBannerText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  // Mascot bubble
  budBubbleWrap: {
    position: 'absolute',
    width: 120,
    alignItems: 'center',
  },
  speechBubble: {
    backgroundColor: colors.card,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E0EDE6',
  },
  speechBubbleText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  speechBubbleTail: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 7,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: colors.card,
    marginTop: -1,
  },
  // Node
  nodeWrap: {
    position: 'absolute',
    width: NODE_SIZE,
    height: NODE_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeCircle: {
    width: NODE_SIZE,
    height: NODE_SIZE,
    borderRadius: NODE_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.14,
    shadowRadius: 6,
    elevation: 4,
  },
  nodeCircleCompleted: {
    shadowColor: colors.accent,
    shadowOpacity: 0.3,
  },
  nodeCircleCurrent: {
    shadowColor: colors.warm,
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  milestoneEmoji: {
    fontSize: 26,
  },
  nodeLabel: {
    position: 'absolute',
    width: 114,
    top: 6,
  },
  nodeLabelTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.text,
    lineHeight: 15,
  },
  nodeLabelTitleMuted: {
    color: colors.muted,
  },
  nodeLabelXp: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.accent,
    marginTop: 3,
  },
})
