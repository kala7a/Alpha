interface Props {
  className?: string
}

/**
 * The mark: азъ and вѣди, the first two letters of the Glagolitic alphabet
 * and the two the app is named after — азъ вѣди, "I know".
 *
 * Drawn as monoline strokes in the same round-capped pen the game draws its
 * letters with, rather than set in a typeface: no Glagolitic face is
 * bundled, and a mark has to render identically everywhere. The paths were
 * traced from the Unicode glyphs (U+2C00 and U+2C02) by the same
 * skeletonising the handwritten alphabet came from, with азъ redrawn as a
 * plain cross — the serif face's flared terminals thin into bulges that
 * read as wobble at this size.
 *
 * Coordinates are the app icon's, so `public/icon.svg` carries these two
 * paths unchanged on its coloured tile. Change one and change the other.
 */
const AZ = 'M121.88 149 L121.88 363 M29.47 226.82 L214.29 226.82 M29.47 226.82 L29.47 275.45 M214.29 226.82 L214.29 275.45'
const VEDI = 'M244.29 230.75 Q247.62 206.45 255.72 196.08 Q263.82 185.72 275.38 182.86 Q286.93 180 293.84 182.26 Q300.75 184.53 308.26 195.49 Q315.76 206.45 321.48 258.86 Q327.2 311.27 338.16 321.04 Q349.11 330.81 361.74 331.4 Q374.37 332 380.09 330.21 Q385.8 328.43 393.9 317.59 Q402 306.75 408.32 253.14 Q414.63 199.54 423.21 191.55 Q431.79 183.57 447.99 184.05 Q464.19 184.53 470.5 192.03 Q476.81 199.54 479.67 211.09 Q482.53 222.65 476.22 241.59 Q469.9 260.53 460.14 265.77 Q450.37 271.01 431.9 264.1 Q413.44 257.19 406.53 260.53 M244.29 230.75 Q250 251.47 259.18 259.45 Q268.35 267.44 283.36 268.63 Q298.37 269.82 317.9 260.53'

/** Tight around the ink, pen included, so a container needs no guesswork. */
const VIEW_BOX = '11.5 131 489.1 250'
const PEN = 36

export default function Logo({ className }: Props) {
  return (
    <svg viewBox={VIEW_BOX} className={className} role="img" aria-label="Азъ Веди">
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth={PEN}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={AZ} />
        <path d={VEDI} />
      </g>
    </svg>
  )
}
