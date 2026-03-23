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
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import Svg, { Line } from 'react-native-svg'
import { useLessonsStore } from '@/store/lessonsStore'
import { LESSON_SECTIONS } from '@/content/lessons'
import { colors } from '@/constants/colors'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

// Layout constants
const NODE_SIZE = 72
const H_PADDING = 40
const INNER_WIDTH = SCREEN_WIDTH - H_PADDING * 2
// Zigzag: left / right alternating columns
const LEFT_X = H_PADDING + NODE_SIZE / 2
const RIGHT_X = SCREEN_WIDTH - H_PADDING - NODE_SIZE / 2
const CENTER_X = SCREEN_WIDTH / 2
const ROW_HEIGHT = 110

type NodeState = 'completed' | 'current' | 'locked' | 'milestone'

interface LessonNode {
  lessonId: string
  title: string
  xp: number
  state: NodeState
  x: number
  y: number
  sectionTitle?: string   // set on first node of each section
}

interface PathPoint { x: number; y: number }

function buildNodes(completedLessons: string[]): { nodes: LessonNode[]; totalHeight: number } {
  const nodes: LessonNode[] = []
  let row = 0

  LESSON_SECTIONS.forEach((section, sIdx) => {
    section.lessons.forEach((lessonId, lIdx) => {
      const isMilestone = lIdx === section.lessons.length - 1
      // Zigzag: even rows go left, odd rows go right
      const x = row % 2 === 0 ? LEFT_X : RIGHT_X

      let state: NodeState
      if (completedLessons.includes(lessonId)) {
        state = isMilestone ? 'milestone' : 'completed'
      } else {
        // Unlock if all previous lessons are done
        const allPrev = nodes.every((n) => completedLessons.includes(n.lessonId))
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
        y: 80 + row * ROW_HEIGHT,
        sectionTitle: lIdx === 0 ? section.title : undefined,
      })
      row++
    })
  })

  return { nodes, totalHeight: 80 + row * ROW_HEIGHT + 80 }
}

function getLessonTitle(id: string): string {
  const TITLES: Record<string, string> = {
    'understanding-cravings-01': 'Why Cravings Feel Overwhelming',
    'understanding-cravings-02': 'The 20-Minute Window',
    'understanding-cravings-03': 'Why You\'ll Feel Better',
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

// Pulsing ring animation for current node
function PulseRing({ size }: { size: number }) {
  const scale = useRef(new Animated.Value(1)).current
  const opacity = useRef(new Animated.Value(0.6)).current

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scale, { toValue: 1.5, duration: 900, easing: Easing.out(Easing.ease), useNativeDriver: true }),
          Animated.timing(scale, { toValue: 1, duration: 900, easing: Easing.in(Easing.ease), useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(opacity, { toValue: 0, duration: 900, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0.6, duration: 900, useNativeDriver: true }),
        ]),
      ])
    ).start()
  }, [])

  return (
    <Animated.View
      style={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 3,
        borderColor: colors.accent,
        transform: [{ scale }],
        opacity,
      }}
      pointerEvents="none"
    />
  )
}

function LessonNodeView({ node, onPress }: { node: LessonNode; onPress: () => void }) {
  const { state, title, xp } = node

  const isLeft = node.x < SCREEN_WIDTH / 2
  const isCompleted = state === 'completed' || (state === 'milestone' && true)
  const isCurrent = state === 'current'
  const isMilestone = state === 'milestone'
  const isLocked = state === 'locked'
  const done = isCompleted && !isMilestone

  // Done milestone: treat as completed
  const lessonDone = done || (isMilestone && isCompleted)

  let nodeColor = '#D5E8DC'
  let borderColor = '#B0C4B8'
  let emoji = '🔒'
  if (state === 'completed') { nodeColor = colors.accent; borderColor = colors.primary; emoji = '✓' }
  if (state === 'milestone' && isCompleted) { nodeColor = colors.gold; borderColor = '#D4900A'; emoji = '⭐' }
  if (state === 'milestone' && !isCompleted) { nodeColor = '#FFF3CD'; borderColor = '#F0B429'; emoji = '⭐' }
  if (state === 'current') { nodeColor = colors.primary; borderColor = '#1E4D38'; emoji = '▶' }

  const labelRight = isLeft

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
      {isCurrent && <PulseRing size={NODE_SIZE} />}
      <View
        style={[
          styles.nodeCircle,
          {
            width: NODE_SIZE,
            height: NODE_SIZE,
            borderRadius: NODE_SIZE / 2,
            backgroundColor: nodeColor,
            borderColor,
            borderWidth: isCurrent ? 3 : 2,
            opacity: isLocked ? 0.55 : 1,
          },
        ]}
      >
        <Text style={[styles.nodeEmoji, state === 'completed' && styles.nodeCheckmark]}>
          {emoji}
        </Text>
      </View>
      {/* Label */}
      <View
        style={[
          styles.nodeLabel,
          labelRight
            ? { left: NODE_SIZE + 8 }
            : { right: NODE_SIZE + 8 },
        ]}
      >
        <Text style={styles.nodeLabelTitle} numberOfLines={2}>{title}</Text>
        {!isLocked && (
          <Text style={styles.nodeLabelXp}>+{xp} XP</Text>
        )}
      </View>
    </TouchableOpacity>
  )
}

export default function LessonsScreen() {
  const { completedLessons, xp, lessonStreak } = useLessonsStore()
  const router = useRouter()
  const scrollRef = useRef<ScrollView>(null)

  const { nodes, totalHeight } = buildNodes(completedLessons)

  // Find current node to auto-scroll
  const currentNode = nodes.find((n) => n.state === 'current')

  useEffect(() => {
    if (currentNode && scrollRef.current) {
      setTimeout(() => {
        scrollRef.current?.scrollTo({ y: Math.max(0, currentNode.y - 200), animated: true })
      }, 400)
    }
  }, [])

  // Build SVG path lines between consecutive nodes
  const lines: Array<{ x1: number; y1: number; x2: number; y2: number }> = []
  for (let i = 0; i < nodes.length - 1; i++) {
    lines.push({
      x1: nodes[i].x,
      y1: nodes[i].y,
      x2: nodes[i + 1].x,
      y2: nodes[i + 1].y,
    })
  }

  // Section header positions: first node of each section
  const sectionHeaders = nodes.filter((n) => n.sectionTitle)

  return (
    <SafeAreaView style={styles.container}>
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
        {/* SVG dashed connecting lines */}
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
              stroke="#C5DDD0"
              strokeWidth={3}
              strokeDasharray="8,6"
              strokeLinecap="round"
            />
          ))}
        </Svg>

        {/* Section header banners */}
        {sectionHeaders.map((node) => (
          <View
            key={node.lessonId + '-header'}
            style={[styles.sectionBanner, { top: node.y - NODE_SIZE / 2 - 36 }]}
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
    paddingBottom: 8,
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
    fontSize: 12,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  nodeWrap: {
    position: 'absolute',
    width: NODE_SIZE,
    height: NODE_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  nodeEmoji: {
    fontSize: 24,
  },
  nodeCheckmark: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.white,
  },
  nodeLabel: {
    position: 'absolute',
    width: 120,
    top: 0,
  },
  nodeLabelTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.text,
    lineHeight: 15,
  },
  nodeLabelXp: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.accent,
    marginTop: 2,
  },
})
