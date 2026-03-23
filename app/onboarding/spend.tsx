import { useState } from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useStreakStore } from '@/store/streakStore'
import { colors } from '@/constants/colors'
import { spacing, fontSize, fontWeight, shadow } from '@/constants/theme'
import { strings } from '@/constants/strings'

export default function SpendScreen() {
  const router = useRouter()
  const { setDailySpend } = useStreakStore()
  const [amount, setAmount] = useState('')

  function handleConfirm() {
    const parsed = parseFloat(amount)
    setDailySpend(isNaN(parsed) ? 0 : parsed)
    router.replace('/(tabs)')
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.kav}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.content}>
          <Text style={styles.title}>{strings.onboarding.spendTitle}</Text>
          <Text style={styles.body}>{strings.onboarding.spendBody}</Text>

          <View style={styles.inputRow}>
            <Text style={styles.dollarSign}>$</Text>
            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              placeholder="0.00"
              placeholderTextColor={colors.muted}
              autoFocus
            />
            <Text style={styles.perDay}>/day</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleConfirm}>
          <Text style={styles.buttonText}>{strings.onboarding.spendButton}</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  kav: {
    flex: 1,
    padding: spacing.xl,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    gap: spacing.xl,
  },
  title: {
    fontSize: fontSize.title,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginTop: spacing.xl,
  },
  body: {
    fontSize: fontSize.body,
    color: colors.muted,
    lineHeight: 22,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.lg,
    gap: spacing.sm,
    ...shadow,
  },
  dollarSign: {
    fontSize: fontSize.title,
    fontWeight: fontWeight.bold,
    color: colors.primary,
  },
  input: {
    flex: 1,
    fontSize: fontSize.hero,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  perDay: {
    fontSize: fontSize.body,
    color: colors.muted,
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
