// User-facing strings — single source of truth for future i18n

export const strings = {
  // Tabs
  tabs: {
    home:     'Home',
    lessons:  'Lessons',
    journal:  'Journal',
    progress: 'Progress',
  },

  // Home screen
  home: {
    greeting:    'Hey there!',
    streakLabel: 'Day Streak',
    savingsLabel: 'Saved',
  },

  // Streak
  streak: {
    daysLabel: (days: number) => `${days} day${days === 1 ? '' : 's'}`,
  },

  // Craving flow
  craving: {
    title:           'Craving Support',
    breathingTitle:  'Let\'s breathe',
    breathingBody:   'Follow the circle — in for 4, hold for 7, out for 8.',
    distractionTitle: 'Try this instead',
    logTitle:        'How was that?',
    triggerLabel:    'What triggered it?',
    intensityLabel:  'Intensity',
    doneButton:      'I\'m feeling better',
    mascotMessage:   'You handled that craving like a champ. Bud is proud of you!',
  },

  // Onboarding
  onboarding: {
    welcome:       'Welcome to DeBud',
    welcomeBody:   'Your companion for quitting cannabis and staying free.',
    getStarted:    'Get Started',
    quitDateTitle: 'When did you quit?',
    quitDateBody:  'This is the start of your streak.',
    setDateButton: 'Set My Quit Date',
    spendTitle:    'How much did you spend?',
    spendBody:     'Daily spend in USD — we\'ll track your savings.',
    spendButton:   'Start Tracking',
  },

  // Notifications
  notifications: {
    dailyCheckIn:   'Hey! How are you feeling today?',
    streakAtRisk:   "Don't break your streak — Bud is worried",
    milestone:      (days: number) => `You've hit ${days} days! Open to celebrate`,
    lessonReady:    'Your daily lesson is ready',
  },

  // General
  general: {
    save:   'Save',
    cancel: 'Cancel',
    next:   'Next',
    back:   'Back',
    done:   'Done',
  },
} as const
