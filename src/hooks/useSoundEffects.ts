import { useCallback } from 'react'

type AudioCtx = typeof AudioContext

function getCtor(): AudioCtx | null {
  if (typeof window === 'undefined') return null
  return window.AudioContext ?? (window as unknown as { webkitAudioContext?: AudioCtx }).webkitAudioContext ?? null
}

// One context for the whole app. Every round mounts its own exercise screen,
// and a context per mount was never closed — a session left ten of them
// running, and browsers cap how many can be open at once.
let sharedCtx: AudioContext | null = null

function getCtx(): AudioContext | null {
  const Ctor = getCtor()
  if (!Ctor) return null
  if (!sharedCtx) sharedCtx = new Ctor()
  // Safari (and Chrome after a stretch in the background) hands back a
  // suspended context, which plays nothing until resumed.
  if (sharedCtx.state === 'suspended') sharedCtx.resume().catch(() => {})
  return sharedCtx
}

/** Tiny synthesized chimes for correct/wrong feedback, no audio files needed. */
export function useSoundEffects() {
  const tone = useCallback(
    (freq: number, start: number, duration: number, ctx: AudioContext) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = freq
      gain.gain.setValueAtTime(0, ctx.currentTime + start)
      gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + start + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(ctx.currentTime + start)
      osc.stop(ctx.currentTime + start + duration)
    },
    [],
  )

  const playCorrect = useCallback(() => {
    const ctx = getCtx()
    if (!ctx) return
    tone(523.25, 0, 0.15, ctx) // C5
    tone(659.25, 0.12, 0.15, ctx) // E5
    tone(783.99, 0.24, 0.25, ctx) // G5
  }, [tone])

  const playWrong = useCallback(() => {
    const ctx = getCtx()
    if (!ctx) return
    tone(220, 0, 0.2, ctx)
    tone(196, 0.15, 0.25, ctx)
  }, [tone])

  const playTap = useCallback(() => {
    const ctx = getCtx()
    if (!ctx) return
    tone(440, 0, 0.08, ctx)
  }, [tone])

  return { playCorrect, playWrong, playTap }
}
