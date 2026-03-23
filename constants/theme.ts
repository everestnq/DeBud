export const spacing = {
  xs:  4,
  sm:  8,
  md:  12,
  lg:  16,
  xl:  24,
  xxl: 32,
} as const

export const radius = {
  card:   16,
  button: 12,
  sm:     8,
} as const

export const shadow = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 4,
  elevation: 3,
} as const

export const fontSize = {
  hero:    36,
  title:   24,
  body:    15,
  caption: 12,
} as const

export const fontWeight = {
  regular:  '400',
  medium:   '500',
  semibold: '600',
  bold:     '700',
} as const

export const lineHeight = {
  body: 22.5, // 15 * 1.5
} as const
