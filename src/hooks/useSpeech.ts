import { useCallback, useEffect, useRef, useState } from 'react'

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
  const queuedRef = useRef<string | null>(null)

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
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'bg-BG'
      utterance.rate = 0.8
      utterance.pitch = 1.1
      if (voice) utterance.voice = voice
      utterance.onstart = () => setSpeaking(true)
      utterance.onend = () => setSpeaking(false)
      utterance.onerror = () => setSpeaking(false)
      queuedRef.current = text
      window.speechSynthesis.speak(utterance)
    },
    [voice],
  )

  return { speak, speaking, supported, hasBulgarianVoice: voice !== null }
}
