import { useCallback, useEffect, useState } from 'react'

const supported = typeof window !== 'undefined' && 'speechSynthesis' in window

function pickVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  const bg = voices.find((v) => v.lang.toLowerCase().startsWith('bg'))
  return bg ?? null
}

/**
 * Speaks Bulgarian text aloud via the Web Speech API.
 * Falls back gracefully (no-op + `supported: false`) on browsers without a bg voice,
 * so callers can show a "no sound" hint instead of throwing.
 */
export function useSpeech() {
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null)
  const [speaking, setSpeaking] = useState(false)

  useEffect(() => {
    if (!supported) return
    const load = () => setVoice(pickVoice(window.speechSynthesis.getVoices()))
    load()
    window.speechSynthesis.addEventListener('voiceschanged', load)
    return () => window.speechSynthesis.removeEventListener('voiceschanged', load)
  }, [])

  const speak = useCallback(
    (text: string) => {
      if (!supported) return
      const synth = window.speechSynthesis
      // Only cancel if something is actually queued/playing — an
      // unconditional cancel() right before speak() (even on a clean
      // synth) makes the clipped-onset bug below worse, not better.
      if (synth.speaking || synth.pending) synth.cancel()

      // Chrome (and some other engines) reliably clip roughly the first
      // 100-200ms of an utterance's audio. For long words that's barely
      // noticeable, but Bulgarian letter names like "ръ"/"бъ"/"гъ" are two
      // sounds total, so the clipped fraction is the entire leading
      // consonant — it comes out sounding like just the trailing "ъ".
      // Speaking the sound twice means a clipped first repetition doesn't
      // matter: the clean second one still gets heard, and — unlike an
      // arbitrary filler word — repeating the actual target sound can't
      // teach the wrong thing if a bit of both repetitions comes through.
      // Pausing+resuming immediately on start is a second, independent
      // workaround for the same underlying bug.
      const utterance = new SpeechSynthesisUtterance(`${text}, ${text}`)
      utterance.lang = 'bg-BG'
      utterance.rate = 0.8
      utterance.pitch = 1.1
      if (voice) utterance.voice = voice
      utterance.onstart = () => {
        setSpeaking(true)
        synth.pause()
        synth.resume()
      }
      utterance.onend = () => setSpeaking(false)
      utterance.onerror = () => setSpeaking(false)
      synth.speak(utterance)
    },
    [voice],
  )

  return { speak, speaking, supported, hasBulgarianVoice: voice !== null }
}
