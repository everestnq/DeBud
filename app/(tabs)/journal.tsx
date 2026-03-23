import { FlatList, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { format, parseISO } from 'date-fns'
import { useJournalStore } from '@/store/journalStore'
import { colors } from '@/constants/colors'
import { spacing, fontSize, fontWeight, shadow } from '@/constants/theme'
import { strings } from '@/constants/strings'

const MOOD_EMOJI: Record<number, string> = {
  1: '😔',
  2: '😕',
  3: '😐',
  4: '🙂',
  5: '😄',
}

export default function JournalScreen() {
  const { moodEntries } = useJournalStore()

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{strings.tabs.journal}</Text>
      </View>

      {moodEntries.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No entries yet.</Text>
          <Text style={styles.emptySubtext}>
            Check in after surviving a craving to log your mood.
          </Text>
        </View>
      ) : (
        <FlatList
          data={moodEntries}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.entryCard}>
              <Text style={styles.moodEmoji}>{MOOD_EMOJI[item.mood]}</Text>
              <View style={styles.entryInfo}>
                <Text style={styles.entryDate}>
                  {format(parseISO(item.date), 'EEE, MMM d')}
                </Text>
                {item.note ? (
                  <Text style={styles.entryNote}>{item.note}</Text>
                ) : null}
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    fontSize: fontSize.title,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl,
  },
  emptyText: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  emptySubtext: {
    fontSize: fontSize.body,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 22,
  },
  list: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  entryCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    ...shadow,
  },
  moodEmoji: {
    fontSize: 32,
  },
  entryInfo: {
    flex: 1,
  },
  entryDate: {
    fontSize: fontSize.caption,
    color: colors.muted,
    marginBottom: spacing.xs,
  },
  entryNote: {
    fontSize: fontSize.body,
    color: colors.text,
  },
})
