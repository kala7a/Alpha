import { CURSIVE_STROKES } from '../data/cursiveStrokes'

interface Props {
  glyph: string
  className?: string
}

/** Pen width for a letter shown rather than traced, in box units. */
const PEN = 7

/**
 * A handwritten letter drawn from the same traced paths the child follows in
 * the tracing rounds, instead of set in a script typeface. No typeface we
 * could bundle agrees with the Bulgarian school chart everywhere — ж is the
 * plainest disagreement — and a child picking a letter here should be
 * looking at the very shape they are being taught to write.
 *
 * The box keeps its full height so a tall letter still looks tall next to a
 * short one, but is trimmed to the letter's own width so narrow letters are
 * not left swimming in space.
 */
export default function CursiveGlyph({ glyph, className }: Props) {
  const strokes = CURSIVE_STROKES[glyph]
  // Bulgarian writes no capital ь; anything else missing would be a bug, but
  // a letter the child can still read beats an empty box either way.
  if (!strokes?.length) return <span className={className}>{glyph}</span>

  const xs = strokes.flat().map((p) => p.x)
  const pad = PEN / 2 + 1
  const left = Math.min(...xs) - pad
  const width = Math.max(...xs) + pad - left

  return (
    <svg
      viewBox={`${left} 0 ${width} 100`}
      className={className}
      role="img"
      aria-label={glyph}
    >
      {strokes.map((stroke, i) => (
        <path
          key={i}
          d={stroke.map((p, j) => `${j ? 'L' : 'M'}${p.x} ${p.y}`).join(' ')}
          fill="none"
          stroke="currentColor"
          strokeWidth={PEN}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </svg>
  )
}
