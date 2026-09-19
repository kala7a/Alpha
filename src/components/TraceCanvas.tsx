import { useEffect, useRef, useState } from 'react'

const SIZE = 320
const INK_WIDTH = 26
const DILATE_STEPS = [-14, -7, 0, 7, 14]
const DONE_THRESHOLD = 0.55
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

function buildMask(letter: string): { indices: Uint32Array; imageData: ImageData } {
  const off = document.createElement('canvas')
  off.width = SIZE
  off.height = SIZE
  const ctx = off.getContext('2d')!
  ctx.clearRect(0, 0, SIZE, SIZE)
  ctx.fillStyle = '#000'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = `700 ${SIZE * 0.72}px "Baloo 2", sans-serif`
  const cx = SIZE / 2
  const cy = SIZE / 2 + SIZE * 0.04
  for (const dx of DILATE_STEPS) {
    for (const dy of DILATE_STEPS) {
      ctx.fillText(letter, cx + dx, cy + dy)
    }
  }
  const imageData = ctx.getImageData(0, 0, SIZE, SIZE)
  const indices: number[] = []
  for (let i = 0; i < imageData.data.length; i += 4) {
    if (imageData.data[i + 3] > 40) indices.push(i)
  }
  return { indices: Uint32Array.from(indices), imageData }
}

/** Draws the light guide letter behind whatever ink the child has painted so far. */
function drawGuide(ctx: CanvasRenderingContext2D, letter: string) {
  ctx.clearRect(0, 0, SIZE, SIZE)
  ctx.fillStyle = '#e9e3ff'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = `700 ${SIZE * 0.72}px "Baloo 2", sans-serif`
  ctx.fillText(letter, SIZE / 2, SIZE / 2 + SIZE * 0.04)
}

export default function TraceCanvas({ letter, resetKey, onCoverageChange }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const inkCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const maskRef = useRef<Uint32Array>(new Uint32Array())
  const drawingRef = useRef(false)
  const lastPointRef = useRef<{ x: number; y: number } | null>(null)
  const [hasInk, setHasInk] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = SIZE
    canvas.height = SIZE
    const ctx = canvas.getContext('2d')!
    drawGuide(ctx, letter)

    const ink = document.createElement('canvas')
    ink.width = SIZE
    ink.height = SIZE
    inkCanvasRef.current = ink

    maskRef.current = buildMask(letter).indices
    setHasInk(false)
    onCoverageChange(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [letter, resetKey])

  function computeCoverage() {
    const ink = inkCanvasRef.current
    const mask = maskRef.current
    if (!ink || mask.length === 0) return 0
    const ctx = ink.getContext('2d')!
    const data = ctx.getImageData(0, 0, SIZE, SIZE).data
    let covered = 0
    for (let i = 0; i < mask.length; i++) {
      if (data[mask[i] + 3] > 40) covered++
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
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    drawingRef.current = true
    setHasInk(true)
    const p = toPoint(e)
    lastPointRef.current = p
    strokeSegment(p, { x: p.x + 0.1, y: p.y + 0.1 })
  }

  function handlePointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawingRef.current) return
    const p = toPoint(e)
    if (lastPointRef.current) strokeSegment(lastPointRef.current, p)
    lastPointRef.current = p
  }

  function handlePointerUp() {
    if (!drawingRef.current) return
    drawingRef.current = false
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
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <canvas
        ref={canvasRef}
        className="aspect-square w-full max-w-xs touch-none rounded-3xl bg-white shadow-inner"
        style={{ touchAction: 'none' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onPointerCancel={handlePointerUp}
      />
      {hasInk && (
        <button
          onClick={handleClear}
          className="rounded-full bg-white/70 px-5 py-2 text-sm font-bold text-violet-700 shadow active:scale-95"
        >
          ↺ Изчисти
        </button>
      )}
    </div>
  )
}

export { DONE_THRESHOLD, MIN_TO_FINISH }
