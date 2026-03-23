import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors } from '@/constants/colors'
import { spacing, fontSize, fontWeight, shadow } from '@/constants/theme'
import { strings } from '@/constants/strings'

export default function WelcomeScreen() {
  const router = useRouter()

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.mascot}>🌱</Text>
        <Text style={styles.title}>{strings.onboarding.welcome}</Text>
        <Text style={styles.body}>{strings.onboarding.welcomeBody}</Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/onboarding/quit-date')}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>{strings.onboarding.getStarted}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: spacing.xl,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xl,
  },
  mascot: {
    fontSize: 96,
  },
  title: {
    fontSize: fontSize.title,
    fontWeight: fontWeight.bold,
    color: colors.text,
    textAlign: 'center',
  },
  body: {
    fontSize: fontSize.body,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 22,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: spacing.lg,
    alignItems: 'center',
    ...shadow,
  },
  buttonText: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.semibold,
    color: colors.white,
  },
})
