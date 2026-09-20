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

export const LETTER_STROKES: Record<string, Stroke[]> = {
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
