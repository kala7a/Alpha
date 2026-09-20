import { useEffect, useRef, useState } from 'react'
import KidButton from './KidButton'
import { LETTER_STROKES, type Point, type Stroke } from '../data/letterStrokes'

const SIZE = 320
const INK_WIDTH = 26
const GUIDE_WIDTH = 40
const DEMO_WIDTH = 16
const DEMO_COLOR = '#fb923c'
const DEMO_STROKE_MS = 380
const DEMO_PAUSE_MS = 140
// How far (px) to look for nearby ink when checking whether a point on the
// letter got covered — this is the tolerance for imprecise strokes. Applied
// to the ink side of the comparison, not the target: the target stays the
// real letter shape, so 100% is actually reachable by a full, careful trace.
const HIT_TOLERANCE = [-10, -5, 0, 5, 10]
const DONE_THRESHOLD = 0.7
const MIN_TO_FINISH = 0.15

interface Props {
  letter: string
  /** Bumped by the parent to force a redraw/reset when moving to a new letter. */
  resetKey: number
  onCoverageChange: (coverage: number) => void
}

export interface TraceCanvasHandle {
  clear: () => void
}

function scaledStrokes(letter: string): Stroke[] {
  const strokes = LETTER_STROKES[letter] ?? []
  return strokes.map((stroke) => stroke.map((p) => ({ x: (p.x / 100) * SIZE, y: (p.y / 100) * SIZE })))
}

function strokePath(ctx: CanvasRenderingContext2D, points: Point[]) {
  if (points.length === 0) return
  ctx.beginPath()
  ctx.moveTo(points[0].x, points[0].y)
  for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y)
  ctx.stroke()
}

function drawStrokes(ctx: CanvasRenderingContext2D, letter: string, color: string, width: number) {
  ctx.strokeStyle = color
  ctx.lineWidth = width
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  for (const stroke of scaledStrokes(letter)) strokePath(ctx, stroke)
}

/** Pixel indices (x + y*SIZE, not byte offsets) making up the target letter shape. */
function buildMask(letter: string): Uint32Array {
  const off = document.createElement('canvas')
  off.width = SIZE
  off.height = SIZE
  const ctx = off.getContext('2d')!
  ctx.clearRect(0, 0, SIZE, SIZE)
  drawStrokes(ctx, letter, '#000', GUIDE_WIDTH)
  const { data } = ctx.getImageData(0, 0, SIZE, SIZE)
  const indices: number[] = []
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] > 40) indices.push(i / 4)
  }
  return Uint32Array.from(indices)
}

/** Draws the light guide letter behind whatever ink the child has painted so far. */
function drawGuide(ctx: CanvasRenderingContext2D, letter: string) {
  ctx.clearRect(0, 0, SIZE, SIZE)
  drawStrokes(ctx, letter, '#e9e3ff', GUIDE_WIDTH)
}

/** Length of a point up to a given fraction of the stroke's total length. */
function pointAlong(points: Point[], t: number): Point[] {
  if (points.length === 0) return []
  const lens = [0]
  for (let i = 1; i < points.length; i++) {
    lens.push(lens[i - 1] + Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y))
  }
  const target = lens[lens.length - 1] * t
  const result: Point[] = [points[0]]
  for (let i = 1; i < points.length; i++) {
    if (lens[i] <= target) {
      result.push(points[i])
    } else {
      const segLen = lens[i] - lens[i - 1]
      const segT = segLen === 0 ? 0 : (target - lens[i - 1]) / segLen
      result.push({
        x: points[i - 1].x + (points[i].x - points[i - 1].x) * segT,
        y: points[i - 1].y + (points[i].y - points[i - 1].y) * segT,
      })
      break
    }
  }
  return result
}

export default function TraceCanvas({ letter, resetKey, onCoverageChange }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const demoCanvasRef = useRef<HTMLCanvasElement>(null)
  const inkCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const maskRef = useRef<Uint32Array>(new Uint32Array())
  const demoCancelledRef = useRef(false)
  // Only this one pointer is currently drawing — a second, simultaneous
  // touch (a sibling's finger, a resting hand) is ignored outright rather
  // than tracked alongside it. Without this, a second finger touching down
  // overwrites lastPointRef with its own position, and the next move from
  // *either* finger draws a stray line connecting the two touch points.
  const activePointerIdRef = useRef<number | null>(null)
  const lastPointRef = useRef<{ x: number; y: number } | null>(null)
  const [hasInk, setHasInk] = useState(false)

  function playDemo() {
    const canvas = demoCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    demoCancelledRef.current = false
    const strokes = scaledStrokes(letter)
    ctx.clearRect(0, 0, SIZE, SIZE)

    function renderFrame(completedCount: number, currentPoints: Point[] | null) {
      ctx.clearRect(0, 0, SIZE, SIZE)
      ctx.strokeStyle = DEMO_COLOR
      ctx.lineWidth = DEMO_WIDTH
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      for (let i = 0; i < completedCount; i++) strokePath(ctx, strokes[i])
      if (currentPoints) strokePath(ctx, currentPoints)
    }

    let index = 0
    function playNext() {
      if (demoCancelledRef.current || index >= strokes.length) return
      const points = strokes[index]
      const start = performance.now()
      function frame(now: number) {
        if (demoCancelledRef.current) return
        const t = Math.min(1, (now - start) / DEMO_STROKE_MS)
        renderFrame(index, pointAlong(points, t))
        if (t < 1) {
          requestAnimationFrame(frame)
        } else {
          index++
          setTimeout(playNext, DEMO_PAUSE_MS)
        }
      }
      requestAnimationFrame(frame)
    }
    playNext()
  }

  function stopDemo() {
    demoCancelledRef.current = true
    const canvas = demoCanvasRef.current
    if (canvas) canvas.getContext('2d')!.clearRect(0, 0, SIZE, SIZE)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const demoCanvas = demoCanvasRef.current
    if (!canvas || !demoCanvas) return
    canvas.width = SIZE
    canvas.height = SIZE
    demoCanvas.width = SIZE
    demoCanvas.height = SIZE
    drawGuide(canvas.getContext('2d')!, letter)

    const ink = document.createElement('canvas')
    ink.width = SIZE
    ink.height = SIZE
    inkCanvasRef.current = ink

    maskRef.current = buildMask(letter)
    setHasInk(false)
    onCoverageChange(0)

    const t = setTimeout(playDemo, 300)
    return () => {
      clearTimeout(t)
      stopDemo()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [letter, resetKey])

  function computeCoverage() {
    const ink = inkCanvasRef.current
    const mask = maskRef.current
    if (!ink || mask.length === 0) return 0
    const data = ink.getContext('2d')!.getImageData(0, 0, SIZE, SIZE).data
    let covered = 0
    for (let i = 0; i < mask.length; i++) {
      const px = mask[i]
      const x = px % SIZE
      const y = (px / SIZE) | 0
      for (const dy of HIT_TOLERANCE) {
        const ny = y + dy
        if (ny < 0 || ny >= SIZE) continue
        let hit = false
        for (const dx of HIT_TOLERANCE) {
          const nx = x + dx
          if (nx < 0 || nx >= SIZE) continue
          if (data[(ny * SIZE + nx) * 4 + 3] > 40) {
            hit = true
            break
          }
        }
        if (hit) {
          covered++
          break
        }
      }
    }
    return covered / mask.length
  }

  function toPoint(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current!
    const rect = canvas.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * SIZE
    const y = ((e.clientY - rect.top) / rect.height) * SIZE
    return { x, y }
  }

  function strokeSegment(from: { x: number; y: number }, to: { x: number; y: number }) {
    const visible = canvasRef.current!.getContext('2d')!
    const ink = inkCanvasRef.current!.getContext('2d')!
    for (const ctx of [visible, ink]) {
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.lineWidth = INK_WIDTH
      ctx.strokeStyle = ctx === visible ? '#ff3d9a' : '#000'
      ctx.beginPath()
      ctx.moveTo(from.x, from.y)
      ctx.lineTo(to.x, to.y)
      ctx.stroke()
    }
  }

  function handlePointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    if (activePointerIdRef.current !== null) return // already drawing with another finger
    stopDemo()
    activePointerIdRef.current = e.pointerId
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    setHasInk(true)
    const p = toPoint(e)
    lastPointRef.current = p
    strokeSegment(p, { x: p.x + 0.1, y: p.y + 0.1 })
  }

  function handlePointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (e.pointerId !== activePointerIdRef.current) return
    const p = toPoint(e)
    if (lastPointRef.current) strokeSegment(lastPointRef.current, p)
    lastPointRef.current = p
  }

  function handlePointerUp(e: React.PointerEvent<HTMLCanvasElement>) {
    if (e.pointerId !== activePointerIdRef.current) return
    activePointerIdRef.current = null
    lastPointRef.current = null
    onCoverageChange(computeCoverage())
  }

  function handleClear() {
    const canvas = canvasRef.current
    if (!canvas) return
    drawGuide(canvas.getContext('2d')!, letter)
    const ink = inkCanvasRef.current
    if (ink) ink.getContext('2d')!.clearRect(0, 0, SIZE, SIZE)
    setHasInk(false)
    onCoverageChange(0)
    playDemo()
  }

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Relative wrapper shrink-wraps to the drawing canvas's own natural
          replaced-element size (aspect-square + w-full + max-w-xs +
          max-h-[36vh] on a plain div doesn't reliably resolve to a
          non-zero size in this flex chain — canvas does). The demo
          overlay is absolutely positioned to match it exactly instead of
          carrying its own independent sizing. */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="aspect-square w-full max-w-xs max-h-[36vh] touch-none rounded-3xl bg-white shadow-inner"
          style={{ touchAction: 'none' }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onPointerCancel={handlePointerUp}
        />
        <canvas ref={demoCanvasRef} className="pointer-events-none absolute inset-0 h-full w-full rounded-3xl" />
      </div>
      {hasInk && (
        <KidButton
          onPress={handleClear}
          className="rounded-full bg-white/70 px-5 py-2 text-sm font-bold text-violet-700 shadow active:scale-95"
        >
          ↺ Изчисти
        </KidButton>
      )}
    </div>
  )
}

export { DONE_THRESHOLD, MIN_TO_FINISH }
