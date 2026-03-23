import Svg, {
  Circle,
  Defs,
  Ellipse,
  Line,
  Path,
  RadialGradient,
  Rect,
  Stop,
} from 'react-native-svg'

type BudMood = 'normal' | 'happy'

interface BudSVGProps {
  width?: number
  height?: number
  mood?: BudMood
}

export function BudSVG({ width = 110, height = 118, mood = 'normal' }: BudSVGProps) {
  const gradientId = `bg_${mood}`

  return (
    <Svg width={width} height={height} viewBox="0 0 120 130">
      <Defs>
        <RadialGradient id={gradientId} cx="38%" cy="32%" r="70%">
          <Stop offset="0%" stopColor={mood === 'happy' ? '#7FDCB0' : '#6DD4A0'} />
          <Stop offset="100%" stopColor="#2D6A4F" />
        </RadialGradient>
      </Defs>

      {/* Shadow */}
      <Ellipse cx="60" cy="118" rx="30" ry="8" fill="#C8855A" opacity="0.25" />

      {/* Pot body */}
      <Path d="M38 90 Q38 122 60 122 Q82 122 82 90 Z" fill="#C8855A" />
      <Rect x="34" y="86" width="52" height="10" rx="5" fill="#B87350" />
      <Ellipse cx="60" cy="86" rx="26" ry="6" fill="#5C3D2E" />

      {/* Stem */}
      <Line x1="60" y1="86" x2="60" y2="52" stroke="#52B788" strokeWidth="4" strokeLinecap="round" />

      {/* Leaves */}
      <Ellipse cx="44" cy="68" rx="16" ry="9" fill="#2D6A4F" transform="rotate(-25, 44, 68)" />
      <Ellipse cx="76" cy="62" rx="16" ry="9" fill="#52B788" transform="rotate(25, 76, 62)" />

      {/* Head */}
      <Circle cx="60" cy="40" r="22" fill={`url(#${gradientId})`} />

      {mood === 'happy' ? (
        <>
          {/* Happy eyes — crescent arcs */}
          <Path d="M47 37 Q52 32 57 37" stroke="#1A1A1A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <Path d="M63 37 Q68 32 73 37" stroke="#1A1A1A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          {/* Big smile */}
          <Path d="M50 48 Q60 57 70 48" stroke="#1A1A1A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          {/* Arms */}
          <Path d="M38 72 Q28 66 22 70" stroke="#52B788" strokeWidth="5" strokeLinecap="round" fill="none" />
          <Path d="M82 72 Q92 66 98 70" stroke="#52B788" strokeWidth="5" strokeLinecap="round" fill="none" />
        </>
      ) : (
        <>
          {/* Normal eyes */}
          <Circle cx="52" cy="38" r="5" fill="white" />
          <Circle cx="68" cy="38" r="5" fill="white" />
          <Circle cx="53" cy="39" r="3" fill="#1A1A1A" />
          <Circle cx="69" cy="39" r="3" fill="#1A1A1A" />
          <Circle cx="54" cy="38" r="1.2" fill="white" />
          <Circle cx="70" cy="38" r="1.2" fill="white" />
          {/* Smile */}
          <Path d="M52 48 Q60 55 68 48" stroke="#1A1A1A" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        </>
      )}

      {/* Cheeks */}
      <Ellipse cx="46" cy="45" rx="5" ry="3" fill="#E07A36" opacity="0.4" />
      <Ellipse cx="74" cy="45" rx="5" ry="3" fill="#E07A36" opacity="0.4" />
    </Svg>
  )
}
