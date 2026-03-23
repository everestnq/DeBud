import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { colors } from '@/constants/colors'

interface Props {
  children: React.ReactNode
  fallback?: React.ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  reset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback
      return (
        <View style={styles.container}>
          <Text style={styles.emoji}>😕</Text>
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.body}>{this.state.error?.message ?? 'An unexpected error occurred.'}</Text>
          <TouchableOpacity style={styles.btn} onPress={this.reset}>
            <Text style={styles.btnText}>Try again</Text>
          </TouchableOpacity>
        </View>
      )
    }
    return this.props.children
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 12,
  },
  emoji: { fontSize: 48 },
  title: { fontSize: 18, fontWeight: '700', color: colors.text, textAlign: 'center' },
  body: { fontSize: 13, color: colors.muted, textAlign: 'center', lineHeight: 19 },
  btn: {
    marginTop: 8,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  btnText: { fontSize: 14, fontWeight: '700', color: colors.white },
})
