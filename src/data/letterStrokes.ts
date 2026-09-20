export interface Point {
  x: number
  y: number
}

/** One stroke = one continuous pen path, drawn without lifting. */
export type Stroke = Point[]

/**
 * Simplified stroke paths for each letter, in the order a child should
 * draw them — not calligraphically precise, but a reasonable "draw this
 * part, then this part" breakdown for a big block-letter tracing game.
 * Coordinates are in a 0-100 box (scaled to the canvas at render time).
 *
 * Proportions are checked against real bold sans glyphs (DejaVu Sans and
 * Liberation Sans agree within a few percent): each letter's ink bounding
 * box aims to be within ~10% of the real width/height ratio, capped where
 * the canvas edge is the limit (Ж, Ф, Ш, Щ, Ю are wider than tall in real
 * type, so they run nearly edge to edge here).
 */
function arc(cx: number, cy: number, rx: number, ry: number, startDeg: number, endDeg: number, steps = 8): Stroke {
  const pts: Stroke = []
  for (let i = 0; i <= steps; i++) {
    const deg = startDeg + ((endDeg - startDeg) * i) / steps
    const rad = (deg * Math.PI) / 180
    pts.push({ x: cx + rx * Math.cos(rad), y: cy + ry * Math.sin(rad) })
  }
  return pts
}

/**
 * A "D" bowl hanging off a vertical stem at x=stemX: flat top out from the
 * stem, a half-ellipse down the right side, flat bottom back to the stem.
 * Real bowls (Б В Р Ь Ъ) are this shape, not a half-ellipse centered on the
 * stem — a centered ellipse the same width has a much shallower, pointier
 * curve and reads as a different letter at a glance.
 */
function bowl(stemX: number, top: number, bottom: number, right: number): Stroke {
  const cy = (top + bottom) / 2
  const ry = (bottom - top) / 2
  const rx = Math.min(right - stemX, ry * 1.15)
  const cx = right - rx
  return [{ x: stemX, y: top }, ...arc(cx, cy, rx, ry, -90, 90, 8), { x: stemX, y: bottom }]
}

/** Mirror image of `bowl`: hangs off the LEFT of a stem (for Я). */
function bowlLeft(stemX: number, top: number, bottom: number, left: number): Stroke {
  const cy = (top + bottom) / 2
  const ry = (bottom - top) / 2
  const rx = Math.min(stemX - left, ry * 1.15)
  const cx = left + rx
  return [{ x: stemX, y: top }, ...arc(cx, cy, rx, ry, 270, 90, 8), { x: stemX, y: bottom }]
}

const CAPITALS: Record<string, Stroke[]> = {
  А: [
    [{ x: 50, y: 12 }, { x: 14, y: 88 }],
    [{ x: 50, y: 12 }, { x: 86, y: 88 }],
    [{ x: 27, y: 62 }, { x: 73, y: 62 }],
  ],
  Б: [
    [{ x: 18, y: 12 }, { x: 18, y: 88 }],
    [{ x: 18, y: 12 }, { x: 76, y: 12 }],
    bowl(18, 42, 88, 82),
  ],
  В: [
    [{ x: 18, y: 12 }, { x: 18, y: 88 }],
    bowl(18, 12, 46, 76),
    bowl(18, 46, 88, 80),
  ],
  Г: [
    [{ x: 22, y: 12 }, { x: 22, y: 88 }],
    [{ x: 22, y: 12 }, { x: 76, y: 12 }],
  ],
  Д: [
    [{ x: 27, y: 12 }, { x: 73, y: 12 }],
    [{ x: 27, y: 12 }, { x: 20, y: 84 }],
    [{ x: 73, y: 12 }, { x: 80, y: 84 }],
    [{ x: 12, y: 84 }, { x: 88, y: 84 }],
    // Small feet sticking down past the bottom bar, like real Д.
    [{ x: 12, y: 84 }, { x: 12, y: 94 }],
    [{ x: 88, y: 84 }, { x: 88, y: 94 }],
  ],
  Е: [
    [{ x: 22, y: 12 }, { x: 22, y: 88 }],
    [{ x: 22, y: 12 }, { x: 76, y: 12 }],
    [{ x: 22, y: 50 }, { x: 64, y: 50 }],
    [{ x: 22, y: 88 }, { x: 76, y: 88 }],
  ],
  Ж: [
    [{ x: 50, y: 12 }, { x: 50, y: 88 }],
    // Spine plus two full corner-to-corner diagonals (same construction
    // as Х) — the real glyph's diagonals actually cross and overlap each
    // other through the middle, not just touch the spine at separate
    // points. It's the added spine, not gapped-apart arms, that tells it
    // apart from a plain Х.
    [{ x: 10, y: 12 }, { x: 90, y: 88 }],
    [{ x: 90, y: 12 }, { x: 10, y: 88 }],
  ],
  З: [
    // Top bowl is smaller than the bottom one, as in the real glyph. Each
    // bowl ends/starts at the same waist tip on the left, joined by a short
    // flat bar — two plain arcs that both curl past the middle cross each
    // other there instead of meeting.
    [...arc(50, 28, 28, 16, -150, 90, 8), { x: 34, y: 44 }],
    [{ x: 34, y: 44 }, ...arc(49, 66, 29, 22, -90, 150, 8)],
  ],
  И: [
    [{ x: 20, y: 12 }, { x: 20, y: 88 }],
    [{ x: 20, y: 88 }, { x: 80, y: 12 }],
    [{ x: 80, y: 12 }, { x: 80, y: 88 }],
  ],
  Й: [
    // The И part sits lower so the breve fits inside the box above it —
    // drawn at the very top it was mostly clipped off the canvas.
    [{ x: 20, y: 32 }, { x: 20, y: 88 }],
    [{ x: 20, y: 88 }, { x: 80, y: 32 }],
    [{ x: 80, y: 32 }, { x: 80, y: 88 }],
    // Breve is a cup (˘), so it sweeps through the bottom (90°), not the top.
    arc(50, 11, 13, 5, 160, 20, 6),
  ],
  К: [
    [{ x: 22, y: 12 }, { x: 22, y: 88 }],
    [{ x: 22, y: 50 }, { x: 80, y: 12 }],
    [{ x: 22, y: 50 }, { x: 80, y: 88 }],
  ],
  Л: [
    [{ x: 50, y: 12 }, { x: 15, y: 88 }],
    [{ x: 50, y: 12 }, { x: 85, y: 88 }],
  ],
  М: [
    [{ x: 14, y: 88 }, { x: 14, y: 12 }],
    // Zigzag dips to y:72, not just past the midpoint — in the real glyph
    // the V reaches down near the baseline, not halfway down the stems.
    [{ x: 14, y: 12 }, { x: 50, y: 72 }],
    [{ x: 50, y: 72 }, { x: 86, y: 12 }],
    [{ x: 86, y: 12 }, { x: 86, y: 88 }],
  ],
  Н: [
    [{ x: 20, y: 12 }, { x: 20, y: 88 }],
    [{ x: 80, y: 12 }, { x: 80, y: 88 }],
    [{ x: 20, y: 50 }, { x: 80, y: 50 }],
  ],
  О: [arc(50, 50, 36, 38, 0, 360, 12)],
  П: [
    [{ x: 18, y: 88 }, { x: 18, y: 12 }],
    [{ x: 18, y: 12 }, { x: 82, y: 12 }],
    [{ x: 82, y: 12 }, { x: 82, y: 88 }],
  ],
  Р: [
    [{ x: 18, y: 12 }, { x: 18, y: 88 }],
    bowl(18, 12, 58, 78),
  ],
  С: [arc(50, 50, 34, 38, 35, 325, 10)],
  Т: [
    [{ x: 17, y: 12 }, { x: 83, y: 12 }],
    [{ x: 50, y: 12 }, { x: 50, y: 88 }],
  ],
  У: [
    [{ x: 16, y: 12 }, { x: 50, y: 55 }],
    [{ x: 84, y: 12 }, { x: 50, y: 55 }, { x: 32, y: 92 }],
  ],
  Ф: [
    [{ x: 50, y: 10 }, { x: 50, y: 90 }],
    // Wider than tall, like the real glyph; the stem pokes out top and bottom.
    arc(50, 50, 42, 28, 0, 360, 12),
  ],
  Х: [
    [{ x: 16, y: 12 }, { x: 84, y: 88 }],
    [{ x: 84, y: 12 }, { x: 16, y: 88 }],
  ],
  Ц: [
    [{ x: 22, y: 12 }, { x: 22, y: 85 }],
    [{ x: 78, y: 12 }, { x: 78, y: 85 }],
    [{ x: 18, y: 85 }, { x: 84, y: 85 }],
    [{ x: 84, y: 85 }, { x: 84, y: 94 }],
  ],
  Ч: [
    [{ x: 20, y: 12 }, { x: 20, y: 44 }, { x: 80, y: 44 }],
    [{ x: 80, y: 12 }, { x: 80, y: 88 }],
  ],
  Ш: [
    [{ x: 10, y: 12 }, { x: 10, y: 85 }],
    [{ x: 50, y: 12 }, { x: 50, y: 85 }],
    [{ x: 90, y: 12 }, { x: 90, y: 85 }],
    [{ x: 10, y: 85 }, { x: 90, y: 85 }],
  ],
  Щ: [
    [{ x: 10, y: 12 }, { x: 10, y: 85 }],
    [{ x: 48, y: 12 }, { x: 48, y: 85 }],
    [{ x: 86, y: 12 }, { x: 86, y: 85 }],
    [{ x: 10, y: 85 }, { x: 90, y: 85 }],
    [{ x: 90, y: 85 }, { x: 90, y: 94 }],
  ],
  Ъ: [
    [{ x: 40, y: 12 }, { x: 40, y: 88 }],
    // Flag points LEFT off the stem, opposite of Б's rightward flag — in
    // the real letterform the top serif and the loop open away from each
    // other, not the same direction. (Checked against DejaVu Sans's actual
    // Ъ glyph pixel-by-pixel: the stem carrying the loop sits well right
    // of the flag's left tip, unlike Б where flag and stem share an edge.)
    [{ x: 40, y: 12 }, { x: 12, y: 12 }],
    bowl(40, 42, 88, 88),
  ],
  Ь: [
    [{ x: 18, y: 12 }, { x: 18, y: 88 }],
    bowl(18, 42, 88, 82),
  ],
  Ю: [
    [{ x: 10, y: 12 }, { x: 10, y: 88 }],
    [{ x: 10, y: 50 }, { x: 28, y: 50 }],
    // The ring is the full stem height and as round as the box allows —
    // it's the main body of the letter, not an ornament on the stem.
    arc(59, 50, 31, 38, 0, 360, 12),
  ],
  Я: [
    [{ x: 82, y: 12 }, { x: 82, y: 88 }],
    bowlLeft(82, 12, 56, 20),
    [{ x: 40, y: 56 }, { x: 18, y: 88 }],
  ],
}

/**
 * Lowercase metrics, in the same 0-100 box. Taken from the real font's own
 * metrics (x-height 0.545em, ascender 0.79em, descender 0.205em) but with
 * the ascenders and descenders compressed to ~80% of true, since a capital
 * already fills this box top to bottom and a true 1em lowercase span would
 * not fit. The x-height band stays honest at about 0.68 of the capitals'
 * height, so a small letter still reads as clearly smaller than its capital
 * — which for ж з к and friends is the *only* thing telling the two apart.
 */
const X_TOP = 25
const BASE = 71
const ASC = 7
const DESC = 87
/** Shallower descender, for the feet of д and the tails of ц and щ. */
const TAIL = 82
/** Box units per em, derived from the x-height band above. */
const EM = 107
/** Guide stroke width as the canvas draws it, in box units. */
const STROKE = 12.5

/**
 * Most Cyrillic lowercase letters are simply their capital drawn smaller.
 * This maps a capital's path into the x-height band and scales its width to
 * the real lowercase glyph's proportions — `emWidth` is that glyph's ink box
 * width, measured off the font. Widths are capped so the widest letters
 * (ж ш щ) stay inside the box rather than running off its edges.
 */
function shrink(capital: string, emWidth: number): Stroke[] {
  const src = CAPITALS[capital]
  const xs = src.flat().map((p) => p.x)
  const left = Math.min(...xs)
  const srcWidth = Math.max(...xs) - left
  const want = Math.min(emWidth * EM, 96) - STROKE
  const k = want / srcWidth
  return src.map((stroke) =>
    stroke.map((p) => ({
      x: 50 + (p.x - (left + srcWidth / 2)) * k,
      y: X_TOP + ((p.y - 12) * (BASE - X_TOP)) / 76,
    })),
  )
}

const LOWERCASE: Record<string, Stroke[]> = {
  // Bowl plus a stem down its right side — not a small А.
  а: [arc(50, 48, 23, 23, 0, 360, 12), [{ x: 73, y: X_TOP }, { x: 73, y: BASE }]],
  // Bowl at x-height with the stem carrying on up to a flag — a '6' with a
  // flag, where the capital is a stem with a bowl hung off it.
  б: [
    [{ x: 24, y: ASC }, { x: 24, y: 48 }],
    [{ x: 24, y: ASC }, { x: 54, y: ASC }],
    arc(50, 48, 26, 23, 0, 360, 12),
  ],
  в: shrink('В', 0.505),
  г: shrink('Г', 0.415),
  // Like Д, but its feet drop below the baseline instead of sitting on it.
  д: [
    [{ x: 30, y: X_TOP }, { x: 70, y: X_TOP }],
    [{ x: 30, y: X_TOP }, { x: 24, y: BASE }],
    [{ x: 70, y: X_TOP }, { x: 76, y: BASE }],
    [{ x: 18, y: BASE }, { x: 82, y: BASE }],
    [{ x: 18, y: BASE }, { x: 18, y: TAIL }],
    [{ x: 82, y: BASE }, { x: 82, y: TAIL }],
  ],
  // Bar first, then a ring around it left open at the lower right.
  е: [[{ x: 25, y: 48 }, { x: 75, y: 48 }], arc(50, 48, 25, 23, 0, -320, 12)],
  ж: shrink('Ж', 0.965),
  з: shrink('З', 0.465),
  и: shrink('И', 0.53),
  // Sits lower than plain и to leave the breve room below the ascender line.
  й: [
    [{ x: 28, y: 30 }, { x: 28, y: BASE }],
    [{ x: 28, y: BASE }, { x: 72, y: 30 }],
    [{ x: 72, y: 30 }, { x: 72, y: BASE }],
    arc(50, 10, 13, 5, 160, 20, 6),
  ],
  к: shrink('К', 0.575),
  л: shrink('Л', 0.595),
  м: shrink('М', 0.65),
  н: shrink('Н', 0.52),
  о: shrink('О', 0.6),
  п: shrink('П', 0.52),
  // Stem runs well below the baseline, with the bowl up in the x-height band.
  р: [[{ x: 24, y: X_TOP }, { x: 24, y: DESC }], bowl(24, X_TOP, BASE, 74)],
  с: shrink('С', 0.48),
  т: shrink('Т', 0.57),
  // The right arm carries on past the join and below the baseline.
  у: [
    [{ x: 23, y: X_TOP }, { x: 52, y: 65 }],
    [{ x: 76, y: X_TOP }, { x: 52, y: 65 }, { x: 36, y: DESC }],
  ],
  // Stem pokes out both ends: above the x-height and below the baseline.
  ф: [[{ x: 50, y: ASC }, { x: 50, y: DESC }], arc(50, 48, 40, 23, 0, 360, 12)],
  х: shrink('Х', 0.615),
  // Tail hangs below the baseline, where the capital's sits on it.
  ц: [
    [{ x: 24, y: X_TOP }, { x: 24, y: BASE }],
    [{ x: 70, y: X_TOP }, { x: 70, y: BASE }],
    [{ x: 22, y: BASE }, { x: 75, y: BASE }],
    [{ x: 75, y: BASE }, { x: 75, y: TAIL }],
  ],
  ч: shrink('Ч', 0.51),
  ш: shrink('Ш', 0.885),
  щ: [
    [{ x: 11, y: X_TOP }, { x: 11, y: BASE }],
    [{ x: 48, y: X_TOP }, { x: 48, y: BASE }],
    [{ x: 85, y: X_TOP }, { x: 85, y: BASE }],
    [{ x: 9, y: BASE }, { x: 89, y: BASE }],
    [{ x: 89, y: BASE }, { x: 89, y: TAIL }],
  ],
  ъ: shrink('Ъ', 0.69),
  ь: shrink('Ь', 0.505),
  ю: shrink('Ю', 0.845),
  я: shrink('Я', 0.53),
}

/** Keyed by the glyph itself, so both cases of a letter look up directly. */
export const LETTER_STROKES: Record<string, Stroke[]> = { ...CAPITALS, ...LOWERCASE }
