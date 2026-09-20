import { useEffect, useMemo, useState } from 'react'
import { glyphFor, pickWordOption, type BgLetter } from '../data/letters'
import { buildSpokenPhrase } from '../data/spokenPhrase'
import { useSpeech } from '../hooks/useSpeech'
import { useSoundEffects } from '../hooks/useSoundEffects'
import KidButton from '../components/KidButton'

interface Props {
  letter: BgLetter
  options: BgLetter[]
  cursive: boolean
  onComplete: (correctFirstTry: boolean) => void
}

export default function ChoiceExercise({ letter, options, cursive, onComplete }: Props) {
  const { speak, supported } = useSpeech()
  const { playCorrect, playWrong } = useSoundEffects()
  const [picked, setPicked] = useState<string | null>(null)
  const [wrongPicks, setWrongPicks] = useState<Set<string>>(new Set())
  const [shakeKey, setShakeKey] = useState<string | null>(null)
  // Picked once per letter so the auto-play and any replay taps within the
  // same round say the same thing, instead of switching phrasing mid-round.
  const word = useMemo(() => pickWordOption(letter), [letter])
  const phrase = useMemo(() => buildSpokenPhrase(letter, word), [letter, word])

  useEffect(() => {
    setPicked(null)
    setWrongPicks(new Set())
    const t = setTimeout(() => speak(phrase), 400)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [letter, phrase])

  function handlePick(opt: BgLetter) {
    if (picked) return
    if (opt.letter === letter.letter) {
      setPicked(opt.letter)
      playCorrect()
      setTimeout(() => onComplete(wrongPicks.size === 0), 1000)
    } else {
      playWrong()
      setWrongPicks((prev) => new Set(prev).add(opt.letter))
      setShakeKey(opt.letter)
      setTimeout(() => setShakeKey(null), 400)
    }
  }

  return (
    <div className="flex flex-1 flex-col items-center gap-6 px-6 py-4">
      <p className="text-center text-xl font-bold text-violet-800">Коя буква чуваш? 👂</p>

      <KidButton
        onPress={() => speak(phrase)}
        disabled={!supported}
        className="animate-wiggle flex h-28 w-28 items-center justify-center rounded-full bg-white text-5xl shadow-lg active:scale-95 disabled:opacity-50"
      >
        🔊
      </KidButton>

      <div className="grid w-full max-w-xs grid-cols-2 gap-4">
        {options.map((opt) => {
          const isWrong = wrongPicks.has(opt.letter)
          const isPicked = picked === opt.letter
          return (
            <KidButton
              key={opt.letter}
              onPress={() => handlePick(opt)}
              disabled={picked !== null || isWrong}
              className={`aspect-square rounded-3xl text-6xl font-extrabold shadow-md transition active:scale-95 ${
                cursive ? 'font-hand' : ''
              } ${
                isPicked
                  ? 'animate-pop bg-emerald-400 text-emerald-900'
                  : isWrong
                    ? 'bg-rose-200 text-rose-400 opacity-60'
                    : 'bg-white text-violet-700 hover:bg-violet-50'
              } ${shakeKey === opt.letter ? 'animate-shake' : ''}`}
            >
              {glyphFor(opt, cursive)}
            </KidButton>
          )
        })}
      </div>

      {picked && <p className="animate-pop text-3xl font-extrabold text-emerald-600">Точно така! 🎉</p>}
    </div>
  )
}
