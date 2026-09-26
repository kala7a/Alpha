interface Props {
  className?: string
}

/**
 * The mark: a letter with the guide under it and the line part way round,
 * which is what the child is looking at for most of the game. А is the
 * first letter of the alphabet and of the app's name both.
 *
 * Drawn the way the game draws: the pale guide is the whole letter, and
 * the traced line runs it as a finger does — up one side and part way down
 * the other — so the crossbar is still waiting. The dot is where the finger
 * is.
 *
 * Coordinates are the app icon's, so `public/icon.svg` carries the same
 * geometry on its tile. Change one and change the other.
 */
const GUIDE = 'M134 379.39 L256 128.61 L378 379.39 M174.67 291.28 L337.33 291.28'
const INK = 'M134 379.39 L256 128.61 L285.28 188.8'

/** Tight around the ink, pen included: the container is the paper. */
const VIEW_BOX = '100.1 94.7 311.8 318.6'

export default function Logo({ className }: Props) {
  return (
    <svg viewBox={VIEW_BOX} className={className} role="img" aria-label="Азъ Веди">
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d={GUIDE} stroke="#e5dcff" strokeWidth={67.8} />
        <path d={INK} stroke="#fb923c" strokeWidth={39} />
      </g>
      <circle cx={285.3} cy={188.8} r={28.8} fill="#f97316" />
    </svg>
  )
}
