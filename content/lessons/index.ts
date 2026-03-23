import type { LessonData } from '@/types/lesson'

// Static imports required by Metro bundler — no dynamic requires
import uc01 from './understanding-cravings-01.json'
import uc02 from './understanding-cravings-02.json'
import uc03 from './understanding-cravings-03.json'
import tm01 from './trigger-mapping-01.json'
import tm02 from './trigger-mapping-02.json'
import tm03 from './trigger-mapping-03.json'
import hr01 from './habit-replacement-01.json'
import hr02 from './habit-replacement-02.json'

export const LESSON_REGISTRY: Record<string, LessonData> = {
  'understanding-cravings-01': uc01 as LessonData,
  'understanding-cravings-02': uc02 as LessonData,
  'understanding-cravings-03': uc03 as LessonData,
  'trigger-mapping-01': tm01 as LessonData,
  'trigger-mapping-02': tm02 as LessonData,
  'trigger-mapping-03': tm03 as LessonData,
  'habit-replacement-01': hr01 as LessonData,
  'habit-replacement-02': hr02 as LessonData,
}

export interface LessonSection {
  id: string
  title: string
  lessons: string[]
}

export const LESSON_SECTIONS: LessonSection[] = [
  {
    id: 'understanding-cravings',
    title: 'Understanding Cravings',
    lessons: [
      'understanding-cravings-01',
      'understanding-cravings-02',
      'understanding-cravings-03',
    ],
  },
  {
    id: 'trigger-mapping',
    title: 'Trigger Mapping',
    lessons: [
      'trigger-mapping-01',
      'trigger-mapping-02',
      'trigger-mapping-03',
    ],
  },
  {
    id: 'habit-replacement',
    title: 'Habit Replacement',
    lessons: [
      'habit-replacement-01',
      'habit-replacement-02',
    ],
  },
]
