# DeBud — Claude Code Project Guide

> Quit cannabis companion app for iOS & Android.
> Duolingo-style mascot + daily lessons + sobriety tracker.

---

## Stack

| Layer | Tool |
|---|---|
| Framework | React Native + Expo (managed workflow) |
| Routing | Expo Router (file-based) |
| State | Zustand + MMKV persistence |
| Backend | Supabase (auth + cloud sync) |
| In-App Purchase | RevenueCat |
| Animations | Lottie (mascot), React Native Reanimated 3 |
| Charts | Victory Native |
| Notifications | Expo Notifications |
| Forms | React Hook Form + Zod |
| Styling | StyleSheet (no Tailwind — RN doesn't support it natively) |
| Language | TypeScript (strict mode) |

---

## Project Structure

```
DeBud/
├── app/                        # Expo Router screens (file = route)
│   ├── (tabs)/                 # Bottom tab navigator
│   │   ├── index.tsx           # Home: mascot + streak + savings
│   │   ├── lessons.tsx         # Daily lesson hub
│   │   ├── journal.tsx         # Mood log + journal entries
│   │   └── progress.tsx        # Stats, milestones, heatmap
│   ├── craving.tsx             # Panic button flow (modal)
│   ├── onboarding/
│   │   ├── index.tsx           # Welcome screen
│   │   ├── quit-date.tsx       # Set quit date
│   │   └── spend.tsx           # Set daily spend for savings calc
│   └── _layout.tsx             # Root layout
├── components/
│   ├── mascot/
│   │   ├── Mascot.tsx          # Lottie mascot wrapper
│   │   └── mascotConfig.ts     # Maps streak -> animation state
│   ├── cards/
│   │   ├── StreakCard.tsx
│   │   ├── SavingsCard.tsx
│   │   └── LessonCard.tsx
│   └── ui/                     # Shared primitives (Button, Card, etc.)
├── store/
│   ├── streakStore.ts          # Quit date, streak, relapse history
│   ├── journalStore.ts         # Mood entries, craving log
│   └── lessonsStore.ts         # XP, completed lessons, mascot level
├── lib/
│   ├── supabase.ts             # Supabase client
│   ├── revenuecat.ts           # RevenueCat init + hooks
│   ├── notifications.ts        # Schedule + handle notifications
│   └── streak.ts               # Streak calculation utilities
├── content/
│   └── lessons/                # Static lesson JSON files
│       ├── understanding-cravings.json
│       ├── trigger-mapping.json
│       └── habit-replacement.json
├── assets/
│   ├── lottie/                 # Mascot animation JSON files
│   │   ├── seed.json
│   │   ├── seedling.json
│   │   ├── growing.json
│   │   ├── blooming.json
│   │   └── wilted.json
│   └── images/
└── constants/
    ├── colors.ts               # Design token colours
    └── theme.ts                # Spacing, font sizes, border radii
```

---

## Key Commands

```bash
# Start dev server
npx expo start

# Run on iOS simulator
npx expo run:ios

# Run on Android emulator
npx expo run:android

# Build for production (EAS)
eas build --platform all

# Push OTA update
eas update --branch production

# Type check
npx tsc --noEmit

# Lint
npx eslint . --ext .ts,.tsx
```

---

## Design System

### Colours (`constants/colors.ts`)

```ts
export const colors = {
  primary:    '#2D6A4F',  // Deep forest green — headers, CTAs
  accent:     '#52B788',  // Sage green — progress bars, active states
  warm:       '#E07A36',  // Earthy orange — milestones, panic button
  gold:       '#F0B429',  // Streak counter, XP badges
  bg:         '#F4F9F6',  // Soft sage white — screen backgrounds
  card:       '#FDFAF6',  // Warm white — cards, modals
  text:       '#1A1A1A',  // Near-black — body text
  muted:      '#555F6B',  // Cool grey — subtext, placeholders
  white:      '#FFFFFF',
}
```

### Spacing & Radii

- Base spacing unit: 8px (use multiples: 4, 8, 12, 16, 24, 32)
- Card border radius: 16px
- Button border radius: 12px
- Shadow: `shadowOpacity: 0.08`, `elevation: 3`

### Typography (Inter font via `expo-google-fonts`)

- Hero/streak numbers: 36pt Bold
- Screen titles: 24pt SemiBold
- Body: 15pt Regular, line height 1.5
- Labels/captions: 12pt Medium

---

## State Management

Three Zustand stores, all persisted to MMKV.

### streakStore

```ts
interface StreakState {
  quitDate: string | null        // ISO date string
  relapseHistory: string[]       // ISO date strings of relapses
  dailySpend: number             // USD, used for savings calc
  setQuitDate: (date: string) => void
  logRelapse: () => void
  resetStreak: () => void
}
// Computed (not stored): streakDays, moneySaved, currentMascotLevel
```

### journalStore

```ts
interface JournalState {
  moodEntries: MoodEntry[]       // { date, mood (1-5), note? }
  cravingLog: CravingEntry[]     // { date, trigger?, intensity (1-5) }
  addMoodEntry: (entry: MoodEntry) => void
  addCravingEntry: (entry: CravingEntry) => void
}
```

### lessonsStore

```ts
interface LessonsState {
  completedLessons: string[]     // lesson IDs
  xp: number
  lessonStreak: number           // consecutive days with a completed lesson
  lastLessonDate: string | null
  completeLesson: (id: string, xpEarned: number) => void
}
```

---

## Mascot System

The mascot ("Bud") is a Lottie animation whose state is driven by streak length.

```ts
// lib/mascot.ts
export function getMascotState(streakDays: number, hasCheckedInToday: boolean) {
  if (!hasCheckedInToday && streakDays > 0) return 'worried'
  if (streakDays === 0)  return 'seed'
  if (streakDays < 3)   return 'seedling'
  if (streakDays < 7)   return 'growing'
  if (streakDays < 30)  return 'blooming'
  return 'thriving'
}
```

**Animation states:** `seed`, `seedling`, `growing`, `blooming`, `thriving`, `wilted`, `worried`, `happy`, `celebrating`

Each maps to a Lottie JSON in `assets/lottie/`.

---

## Monetization (RevenueCat)

**Free tier:** streak tracker, basic craving button, 5 journal entries/week, first 10 lessons, 2 mascot states.

**Premium entitlement (`debudPremium`):** unlimited journal, all lessons, all mascot states, craving analytics, cloud sync.

**Products:**
- `debudMonthly` — $3.99/month
- `debudAnnual` — $24.99/year
- `debudLifetime` — $49.99 one-time

Gate features with a `usePremium()` hook that reads the RevenueCat entitlement.

---

## Backend (Supabase)

Only used for:
1. **Auth** — magic link / email (no passwords)
2. **Cloud sync** — premium only; syncs streak, journal, and lesson progress

All core data lives locally in MMKV first. Supabase is an optional sync layer, not a hard dependency.

**Tables:** `profiles`, `streaks`, `journal_entries`, `craving_log`, `lesson_progress`

Row-level security: users can only read/write their own rows.

---

## Lesson Content Format

Lessons are static JSON in `content/lessons/`. No network needed.

```json
{
  "id": "understanding-cravings-01",
  "category": "understanding-cravings",
  "title": "Why Cravings Feel Overwhelming",
  "xp": 20,
  "cards": [
    {
      "type": "info",
      "heading": "Your brain on THC",
      "body": "Cannabis triggers dopamine release in the brain's reward centre..."
    },
    {
      "type": "info",
      "heading": "The craving window",
      "body": "Most cravings peak at 20 minutes then fade, even without using."
    },
    {
      "type": "reflection",
      "prompt": "Think of the last time you had a craving. What were you doing?"
    }
  ]
}
```

---

## Craving Panic Flow

Route: `app/craving.tsx` (full-screen modal)

1. **Breathing** — 4-7-8 animated circle, 3 rounds (~60s)
2. **Distraction** — random activity card, "give me another" option
3. **Log it** — optional trigger input + intensity slider (1–5)
4. **Mascot response** — Bud with an affirmation message

On completion, write a `CravingEntry` to `journalStore`.

---

## Notifications

| Notification | Trigger | Message |
|---|---|---|
| Daily check-in | User-set time (default 8pm) | "Hey! How are you feeling today?" |
| Streak at risk | 10pm if no check-in | "Don't break your streak — Bud is worried" |
| Milestone | On detection | "You've hit [X] days! Open to celebrate" |
| Lesson reminder | 24h after last lesson | "Your daily lesson is ready" |

---

## App Store Details

- **iOS name:** DeBud – Quit Cannabis & Stay Clean
- **Android name:** DeBud – Quit Weed & Stay Free
- **Bundle ID:** `com.debudapp.mobile`
- **Age rating:** 17+ (iOS) / Mature (Android)
- **Category:** Health & Fitness

---

## Conventions

- All components are functional with typed props interfaces
- Prefer `StyleSheet.create()` over inline styles
- No `any` types — use `unknown` and narrow explicitly
- Dates: store as ISO strings, parse with `date-fns`
- Supabase fetches: wrap with `@tanstack/query`
- Error boundaries around all screens
- User-facing strings in `constants/strings.ts` (prep for future i18n)
