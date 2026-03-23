export interface InfoCard {
  type: 'info'
  heading: string
  body: string
  emoji?: string
}

export interface ChoiceOption {
  text: string
  correct: boolean
}

export interface ChoiceCard {
  type: 'choice'
  question: string
  options: ChoiceOption[]
  explanation?: string
}

export interface TrueFalseCard {
  type: 'true_false'
  statement: string
  answer: boolean
  explanation?: string
}

export interface ReflectionCard {
  type: 'reflection'
  prompt: string
}

export type LessonCard = InfoCard | ChoiceCard | TrueFalseCard | ReflectionCard

export interface LessonData {
  id: string
  title: string
  category: string
  xp: number
  cards: LessonCard[]
}
