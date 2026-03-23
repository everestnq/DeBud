import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { format, parseISO } from 'date-fns'
import { useJournalStore, type MoodEntry } from '@/store/journalStore'
import { colors } from '@/constants/colors'

const MOODS = [
  { value: 1 as const, emoji: '😔', label: 'Rough' },
  { value: 2 as const, emoji: '😕', label: 'Low' },
  { value: 3 as const, emoji: '😐', label: 'Okay' },
  { value: 4 as const, emoji: '🙂', label: 'Good' },
  { value: 5 as const, emoji: '😄', label: 'Great' },
]

// Demo entries shown when store is empty
const DEMO_ENTRIES: MoodEntry[] = [
  {
    id: 'demo1',
    date: new Date(Date.now() - 86400000).toISOString(),
    mood: 4,
    note: 'Felt pretty solid today. Had a craving around 6pm but it passed. Going for a walk really helped.',
  },
  {
    id: 'demo2',
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    mood: 3,
    note: 'Tired. Sleep is still weird. But hitting this point feels surreal to say out loud.',
  },
  {
    id: 'demo3',
    date: new Date(Date.now() - 86400000 * 3).toISOString(),
    mood: 5,
    note: 'Had my best workout in months. Energy is actually coming back.',
  },
  {
    id: 'demo4',
    date: new Date(Date.now() - 86400000 * 4).toISOString(),
    mood: 2,
    note: 'Rough evening, ran into some old friends. Used the breathing thing though.',
  },
]

export default function JournalScreen() {
  const { moodEntries } = useJournalStore()
  const router = useRouter()
  const entries = moodEntries.length > 0 ? moodEntries : DEMO_ENTRIES
  const todayStr = format(new Date(), 'MMM d').toUpperCase()

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Journal</Text>
            <Text style={styles.subtitle}>How are you feeling?</Text>
          </View>
        </View>

        {/* Mood prompt */}
        <View style={styles.moodPrompt}>
          <Text style={styles.moodPromptDate}>TODAY · {todayStr}</Text>
          <Text style={styles.moodPromptQ}>How are you feeling right now?</Text>
          <View style={styles.moodRow}>
            {MOODS.map((m) => (
              <TouchableOpacity
                key={m.value}
                style={styles.moodBtn}
                activeOpacity={0.7}
                onPress={() => router.push('/journal/new')}
              >
                <Text style={styles.moodEmoji}>{m.emoji}</Text>
                <Text style={styles.moodLabel}>{m.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Text style={styles.sectionHeading}>Recent Entries</Text>

        {entries.map((entry, i) => (
          <EntryCard key={entry.id} entry={entry} index={i} />
        ))}

        {/* FAB */}
        <TouchableOpacity style={styles.fab} activeOpacity={0.85} onPress={() => router.push('/journal/new')}>
          <Text style={styles.fabText}>+ Add Entry</Text>
        </TouchableOpacity>

        <View style={styles.spacer} />
      </ScrollView>
    </SafeAreaView>
  )
}

const MOOD_EMOJI: Record<number, string> = { 1: '😔', 2: '😕', 3: '😐', 4: '🙂', 5: '😄' }

function EntryCard({ entry, index }: { entry: MoodEntry; index: number }) {
  const isFirst = index === 0
  const tag = isFirst ? { label: 'Craving resisted 💪', style: 'normal' } : null

  return (
    <View style={styles.entryCard}>
      <View style={styles.entryEmojiWrap}>
        <Text style={styles.entryEmoji}>{MOOD_EMOJI[entry.mood]}</Text>
      </View>
      <View style={styles.entryInfo}>
        <Text style={styles.entryDate}>
          {format(parseISO(entry.date), 'MMM d · h:mm a')}
        </Text>
        {entry.note ? (
          <Text style={styles.entryNote}>{entry.note}</Text>
        ) : null}
        {tag ? (
          <View style={[styles.entryTag, tag.style === 'craving' && styles.entryTagCraving]}>
            <Text style={[styles.entryTagText, tag.style === 'craving' && styles.entryTagTextCraving]}>
              {tag.label}
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scroll: {
    paddingBottom: 16,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 2,
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
  moodPrompt: {
    marginHorizontal: 16,
    marginTop: 10,
    backgroundColor: '#FFF8F0',
    borderWidth: 1.5,
    borderColor: '#F5D5B8',
    borderRadius: 20,
    padding: 16,
  },
  moodPromptDate: {
    fontSize: 12,
    color: colors.muted,
    fontWeight: '600',
    marginBottom: 10,
  },
  moodPromptQ: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  moodRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  moodBtn: {
    alignItems: 'center',
    gap: 3,
  },
  moodEmoji: {
    fontSize: 24,
  },
  moodLabel: {
    fontSize: 9,
    color: colors.muted,
    fontWeight: '600',
  },
  sectionHeading: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 6,
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  entryCard: {
    marginHorizontal: 16,
    marginBottom: 8,
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  entryEmojiWrap: {
    width: 44,
    height: 44,
    backgroundColor: '#E8F5EE',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  entryEmoji: {
    fontSize: 24,
  },
  entryInfo: {
    flex: 1,
  },
  entryDate: {
    fontSize: 10,
    color: colors.muted,
    fontWeight: '600',
    marginBottom: 3,
  },
  entryNote: {
    fontSize: 12,
    color: colors.text,
    lineHeight: 17,
  },
  entryTag: {
    alignSelf: 'flex-start',
    marginTop: 5,
    backgroundColor: '#E8F5EE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  entryTagCraving: {
    backgroundColor: '#FFF0E6',
  },
  entryTagText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.primary,
  },
  entryTagTextCraving: {
    color: colors.warm,
  },
  fab: {
    marginHorizontal: 16,
    marginTop: 10,
    backgroundColor: colors.primary,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2D6A4F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 5,
  },
  fabText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.white,
  },
  spacer: { height: 12 },
})
