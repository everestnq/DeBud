import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { BudSVG } from '@/components/mascot/BudSVG'
import { colors } from '@/constants/colors'

const FEATURES = [
  { icon: '🌱', title: 'Watch Bud grow with you', sub: 'Your mascot evolves as your streak grows' },
  { icon: '🧘', title: 'Beat cravings in the moment', sub: 'Guided breathing + distraction tools' },
  { icon: '📖', title: 'Daily 3-minute lessons', sub: 'Understand your triggers, build new habits' },
]

export default function WelcomeScreen() {
  const router = useRouter()

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <BudSVG width={120} height={130} mood="normal" />

        <Text style={styles.title}>Meet Bud.{'\n'}Your quit companion.</Text>
        <Text style={styles.body}>
          DeBud helps you track your sobriety, beat cravings in the moment, and understand your triggers — one day at a time.
        </Text>

        <View style={styles.features}>
          {FEATURES.map((f) => (
            <View key={f.icon} style={styles.featureRow}>
              <Text style={styles.featureIcon}>{f.icon}</Text>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>{f.title}</Text>
                <Text style={styles.featureSub}>{f.sub}</Text>
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => router.push('/onboarding/quit-date')}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryBtnText}>Let's get started 🌿</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryBtn} activeOpacity={0.7}>
          <Text style={styles.secondaryBtnText}>I already have an account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.primary,
    textAlign: 'center',
    lineHeight: 32,
    marginBottom: 10,
    marginTop: 4,
  },
  body: {
    fontSize: 13,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  features: {
    width: '100%',
    gap: 10,
    marginBottom: 24,
  },
  featureRow: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  featureIcon: {
    fontSize: 22,
    width: 36,
    textAlign: 'center',
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  featureSub: {
    fontSize: 11,
    color: colors.muted,
    marginTop: 1,
  },
  primaryBtn: {
    width: '100%',
    backgroundColor: colors.primary,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    marginTop: 'auto',
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
  secondaryBtn: {
    padding: 12,
    marginTop: 8,
  },
  secondaryBtnText: {
    fontSize: 13,
    color: colors.muted,
    textAlign: 'center',
  },
})
