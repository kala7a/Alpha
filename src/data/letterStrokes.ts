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

export const LETTER_STROKES: Record<string, Stroke[]> = {
  А: [
    [{ x: 50, y: 12 }, { x: 20, y: 88 }],
    [{ x: 50, y: 12 }, { x: 80, y: 88 }],
    [{ x: 32, y: 62 }, { x: 68, y: 62 }],
  ],
  Б: [
    [{ x: 28, y: 12 }, { x: 28, y: 88 }],
    [{ x: 28, y: 12 }, { x: 60, y: 12 }],
    arc(30, 65, 30, 23, -85, 85, 8),
  ],
  В: [
    [{ x: 28, y: 12 }, { x: 28, y: 88 }],
    arc(28, 25, 32, 22, -90, 90, 6),
    arc(28, 72, 34, 25, -90, 90, 6),
  ],
  Г: [
    [{ x: 25, y: 12 }, { x: 25, y: 88 }],
    [{ x: 25, y: 12 }, { x: 75, y: 12 }],
  ],
  Д: [
    [{ x: 25, y: 12 }, { x: 75, y: 12 }],
    [{ x: 25, y: 12 }, { x: 20, y: 84 }],
    [{ x: 75, y: 12 }, { x: 80, y: 84 }],
    [{ x: 14, y: 84 }, { x: 86, y: 84 }],
    // Small feet sticking down past the bottom bar, like real Д.
    [{ x: 14, y: 84 }, { x: 14, y: 96 }],
    [{ x: 86, y: 84 }, { x: 86, y: 96 }],
  ],
  Е: [
    [{ x: 25, y: 12 }, { x: 25, y: 88 }],
    [{ x: 25, y: 12 }, { x: 70, y: 12 }],
    [{ x: 25, y: 50 }, { x: 58, y: 50 }],
    [{ x: 25, y: 88 }, { x: 70, y: 88 }],
  ],
  Ж: [
    [{ x: 50, y: 12 }, { x: 50, y: 88 }],
    // Spine plus two full corner-to-corner diagonals (same construction
    // as Х) — the real glyph's diagonals actually cross and overlap each
    // other through the middle, not just touch the spine at separate
    // points. It's the added spine, not gapped-apart arms, that tells it
    // apart from a plain Х.
    [{ x: 20, y: 12 }, { x: 80, y: 88 }],
    [{ x: 80, y: 12 }, { x: 20, y: 88 }],
  ],
  З: [arc(40, 32, 20, 18, -100, 100, 7), arc(40, 68, 20, 18, -100, 100, 7)],
  И: [
    [{ x: 25, y: 12 }, { x: 25, y: 88 }],
    [{ x: 25, y: 88 }, { x: 75, y: 12 }],
    [{ x: 75, y: 12 }, { x: 75, y: 88 }],
  ],
  Й: [
    [{ x: 25, y: 12 }, { x: 25, y: 88 }],
    [{ x: 25, y: 88 }, { x: 75, y: 12 }],
    [{ x: 75, y: 12 }, { x: 75, y: 88 }],
    arc(50, 2, 14, 5, 180, 360, 6),
  ],
  К: [
    [{ x: 25, y: 12 }, { x: 25, y: 88 }],
    [{ x: 25, y: 50 }, { x: 75, y: 12 }],
    [{ x: 25, y: 50 }, { x: 75, y: 88 }],
  ],
  Л: [
    [{ x: 50, y: 12 }, { x: 18, y: 88 }],
    [{ x: 50, y: 12 }, { x: 82, y: 88 }],
  ],
  М: [
    [{ x: 18, y: 88 }, { x: 18, y: 12 }],
    [{ x: 18, y: 12 }, { x: 50, y: 58 }],
    [{ x: 50, y: 58 }, { x: 82, y: 12 }],
    [{ x: 82, y: 12 }, { x: 82, y: 88 }],
  ],
  Н: [
    [{ x: 25, y: 12 }, { x: 25, y: 88 }],
    [{ x: 75, y: 12 }, { x: 75, y: 88 }],
    [{ x: 25, y: 50 }, { x: 75, y: 50 }],
  ],
  О: [arc(50, 50, 32, 38, 0, 360, 12)],
  П: [
    [{ x: 22, y: 88 }, { x: 22, y: 12 }],
    [{ x: 22, y: 12 }, { x: 78, y: 12 }],
    [{ x: 78, y: 12 }, { x: 78, y: 88 }],
  ],
  Р: [
    [{ x: 28, y: 12 }, { x: 28, y: 88 }],
    arc(28, 37, 34, 25, -90, 90, 6),
  ],
  С: [arc(50, 50, 32, 38, 35, 325, 10)],
  Т: [
    [{ x: 20, y: 12 }, { x: 80, y: 12 }],
    [{ x: 50, y: 12 }, { x: 50, y: 88 }],
  ],
  У: [
    [{ x: 20, y: 12 }, { x: 50, y: 55 }],
    [{ x: 80, y: 12 }, { x: 50, y: 55 }, { x: 35, y: 92 }],
  ],
  Ф: [
    [{ x: 50, y: 8 }, { x: 50, y: 92 }],
    arc(50, 45, 30, 26, 0, 360, 10),
  ],
  Х: [
    [{ x: 20, y: 12 }, { x: 80, y: 88 }],
    [{ x: 80, y: 12 }, { x: 20, y: 88 }],
  ],
  Ц: [
    [{ x: 25, y: 12 }, { x: 25, y: 85 }],
    [{ x: 75, y: 12 }, { x: 75, y: 85 }],
    [{ x: 20, y: 85 }, { x: 82, y: 85 }],
    [{ x: 82, y: 85 }, { x: 82, y: 95 }],
  ],
  Ч: [
    [{ x: 25, y: 12 }, { x: 25, y: 42 }, { x: 75, y: 42 }],
    [{ x: 75, y: 12 }, { x: 75, y: 88 }],
  ],
  Ш: [
    [{ x: 20, y: 12 }, { x: 20, y: 85 }],
    [{ x: 50, y: 12 }, { x: 50, y: 85 }],
    [{ x: 80, y: 12 }, { x: 80, y: 85 }],
    [{ x: 14, y: 85 }, { x: 86, y: 85 }],
  ],
  Щ: [
    [{ x: 20, y: 12 }, { x: 20, y: 85 }],
    [{ x: 50, y: 12 }, { x: 50, y: 85 }],
    [{ x: 80, y: 12 }, { x: 80, y: 85 }],
    [{ x: 14, y: 85 }, { x: 86, y: 85 }],
    [{ x: 86, y: 85 }, { x: 86, y: 95 }],
  ],
  Ъ: [
    [{ x: 38, y: 12 }, { x: 38, y: 88 }],
    // Flag points LEFT off the stem, opposite of Б's rightward flag — in
    // the real letterform the top serif and the loop open away from each
    // other, not the same direction. (Checked against DejaVu Sans's actual
    // Ъ glyph pixel-by-pixel: the stem carrying the loop sits well right
    // of the flag's left tip, unlike Б where flag and stem share an edge.)
    [{ x: 38, y: 12 }, { x: 14, y: 12 }],
    arc(38, 68, 34, 22, -80, 90, 7),
  ],
  Ь: [
    [{ x: 25, y: 12 }, { x: 25, y: 88 }],
    arc(25, 68, 34, 22, -80, 90, 7),
  ],
  Ю: [
    [{ x: 20, y: 12 }, { x: 20, y: 88 }],
    [{ x: 20, y: 50 }, { x: 35, y: 50 }],
    arc(60, 50, 22, 26, 0, 360, 10),
  ],
  Я: [
    [{ x: 60, y: 12 }, { x: 60, y: 88 }],
    arc(60, 34, 38, 22, 90, 270, 6),
    [{ x: 30, y: 50 }, { x: 20, y: 88 }],
  ],
}
