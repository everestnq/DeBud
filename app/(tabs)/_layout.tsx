import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '@/constants/colors'
import { strings } from '@/constants/strings'

type IoniconsName = keyof typeof Ionicons.glyphMap

interface TabIconProps {
  name: IoniconsName
  focused: boolean
}

function TabIcon({ name, focused }: TabIconProps) {
  return (
    <Ionicons
      name={focused ? name : (`${name}-outline` as IoniconsName)}
      size={24}
      color={focused ? colors.primary : colors.muted}
    />
  )
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: '#E8F0EC',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: strings.tabs.home,
          tabBarIcon: ({ focused }) => (
            <TabIcon name="home" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="lessons"
        options={{
          title: strings.tabs.lessons,
          tabBarIcon: ({ focused }) => (
            <TabIcon name="book" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="journal"
        options={{
          title: strings.tabs.journal,
          tabBarIcon: ({ focused }) => (
            <TabIcon name="journal" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: strings.tabs.progress,
          tabBarIcon: ({ focused }) => (
            <TabIcon name="bar-chart" focused={focused} />
          ),
        }}
      />
    </Tabs>
  )
}
