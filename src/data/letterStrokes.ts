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
    arc(28, 31, 24, 19, -90, 90, 6),
    arc(28, 69, 27, 21, -90, 90, 6),
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
  ],
  Е: [
    [{ x: 25, y: 12 }, { x: 25, y: 88 }],
    [{ x: 25, y: 12 }, { x: 70, y: 12 }],
    [{ x: 25, y: 50 }, { x: 58, y: 50 }],
    [{ x: 25, y: 88 }, { x: 70, y: 88 }],
  ],
  Ж: [
    [{ x: 50, y: 12 }, { x: 50, y: 88 }],
    // Four short diagonals attaching to the spine at two different
    // heights (42 and 58), not one shared center point — otherwise each
    // pair of opposite arms is collinear (same slope through the same
    // vertex) and the whole thing visually collapses into a plain X.
    [{ x: 15, y: 15 }, { x: 50, y: 42 }],
    [{ x: 50, y: 58 }, { x: 15, y: 85 }],
    [{ x: 85, y: 15 }, { x: 50, y: 42 }],
    [{ x: 50, y: 58 }, { x: 85, y: 85 }],
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
    arc(28, 30, 26, 18, -90, 90, 6),
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
    [{ x: 22, y: 12 }, { x: 22, y: 88 }],
    [{ x: 22, y: 12 }, { x: 42, y: 12 }],
    // Loop deliberately smaller and lower than Ь's — at the guide's thick
    // stroke width, a loop sized/placed like Б's or Ь's made Ъ render as a
    // near-duplicate of Б instead of a recognizably different hard-sign
    // shape.
    arc(22, 76, 16, 13, -80, 90, 7),
  ],
  Ь: [
    [{ x: 25, y: 12 }, { x: 25, y: 88 }],
    arc(25, 68, 22, 18, -80, 90, 7),
  ],
  Ю: [
    [{ x: 20, y: 12 }, { x: 20, y: 88 }],
    [{ x: 20, y: 50 }, { x: 35, y: 50 }],
    arc(60, 50, 22, 26, 0, 360, 10),
  ],
  Я: [
    [{ x: 60, y: 12 }, { x: 60, y: 88 }],
    arc(60, 30, 22, 18, 90, 270, 6),
    [{ x: 38, y: 45 }, { x: 20, y: 88 }],
  ],
}
