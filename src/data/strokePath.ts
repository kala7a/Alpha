import type { Point } from './letterStrokes'

/** One step of a path: a straight line, or a curve bending around `control`. */
interface Segment {
  control?: Point
  to: Point
}

/**
 * The points of a stroke are samples taken along a curve, not corners of it.
 * Joining them with straight lines leaves visible flat facets around every
 * bend — plain on the handwritten letters, which are nearly all curve.
 * Bending each segment around the sampled point and ending it halfway to
 * the next one puts the curve back, and costs nothing at draw time.
 *
 * Printed letters are built from real corners (the zigzag of М, the
 * diagonals of Ж) and are drawn unsmoothed, or the corners would soften.
 */
export function strokeSegments(points: Point[], smooth: boolean): Segment[] {
  if (!smooth || points.length < 3) return points.slice(1).map((to) => ({ to }))
  const segments: Segment[] = []
  let i = 1
  for (; i < points.length - 2; i++) {
    segments.push({
      control: points[i],
      to: { x: (points[i].x + points[i + 1].x) / 2, y: (points[i].y + points[i + 1].y) / 2 },
    })
  }
  return [...segments, { control: points[i], to: points[i + 1] }]
}

/** Lays a stroke into the current canvas path. */
export function tracePath(ctx: CanvasRenderingContext2D, points: Point[], smooth: boolean) {
  if (points.length === 0) return
  ctx.beginPath()
  ctx.moveTo(points[0].x, points[0].y)
  for (const seg of strokeSegments(points, smooth)) {
    if (seg.control) ctx.quadraticCurveTo(seg.control.x, seg.control.y, seg.to.x, seg.to.y)
    else ctx.lineTo(seg.to.x, seg.to.y)
  }
}

/** The same path as an SVG `d` attribute. */
export function svgPath(points: Point[], smooth: boolean, scale = 1): string {
  if (points.length === 0) return ''
  const n = (v: number) => +(v * scale).toFixed(2)
  const parts = [`M${n(points[0].x)} ${n(points[0].y)}`]
  for (const seg of strokeSegments(points, smooth)) {
    parts.push(
      seg.control
        ? `Q${n(seg.control.x)} ${n(seg.control.y)} ${n(seg.to.x)} ${n(seg.to.y)}`
        : `L${n(seg.to.x)} ${n(seg.to.y)}`,
    )
  }
  return parts.join(' ')
}
