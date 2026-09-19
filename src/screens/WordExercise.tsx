import { useEffect, useMemo, useState } from 'react'
import type { BgLetter } from '../data/letters'
import { buildWordPhrase } from '../data/spokenPhrase'
import { useSpeech } from '../hooks/useSpeech'
import { useSoundEffects } from '../hooks/useSoundEffects'
import KidButton from '../components/KidButton'

interface Props {
  letter: BgLetter
  options: BgLetter[]
  onComplete: (correctFirstTry: boolean) => void
}

export default function WordExercise({ letter, options, onComplete }: Props) {
  const { speak, supported } = useSpeech()
  const { playCorrect, playWrong } = useSoundEffects()
  const [picked, setPicked] = useState<string | null>(null)
  const [wrongPicks, setWrongPicks] = useState<Set<string>>(new Set())
  const [shakeKey, setShakeKey] = useState<string | null>(null)
  const phrase = useMemo(() => buildWordPhrase(letter), [letter])

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
      setTimeout(() => onComplete(wrongPicks.size === 0), 1400)
    } else {
      playWrong()
      setWrongPicks((prev) => new Set(prev).add(opt.letter))
      setShakeKey(opt.letter)
      setTimeout(() => setShakeKey(null), 400)
    }
  }

  return (
    <div className="flex flex-1 flex-col items-center gap-5 px-6 py-3">
      <p className="text-center text-lg font-bold text-violet-800">С коя буква започва думата? 🤔</p>

      <KidButton
        onPress={() => speak(phrase)}
        disabled={!supported}
        className={`flex items-center justify-center rounded-full bg-white shadow-lg active:scale-95 disabled:opacity-50 ${
          picked ? 'animate-pop h-56 w-56 text-9xl' : 'h-24 w-24 animate-wiggle text-4xl'
        }`}
      >
        {letter.emoji}
      </KidButton>

      <div className="grid w-full max-w-xs grid-cols-2 gap-5">
        {options.map((opt) => {
          const isWrong = wrongPicks.has(opt.letter)
          const isPicked = picked === opt.letter
          return (
            <KidButton
              key={opt.letter}
              onPress={() => handlePick(opt)}
              disabled={picked !== null || isWrong}
              className={`aspect-square rounded-3xl text-6xl font-extrabold shadow-md transition active:scale-95 ${
                isPicked
                  ? 'animate-pop bg-emerald-400 text-emerald-900'
                  : isWrong
                    ? 'bg-rose-200 text-rose-400 opacity-60'
                    : 'bg-white text-violet-700 hover:bg-violet-50'
              } ${shakeKey === opt.letter ? 'animate-shake' : ''}`}
            >
              {opt.letter}
            </KidButton>
          )
        })}
      </div>

      {picked && (
        <p className="animate-pop text-2xl font-extrabold text-emerald-600">
          {letter.word} започва с {letter.letter}! 🎉
        </p>
      )}
    </div>
  )
}
