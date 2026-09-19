import { useEffect, useState } from 'react'
import TraceCanvas, { DONE_THRESHOLD, MIN_TO_FINISH } from '../components/TraceCanvas'
import KidButton from '../components/KidButton'
import type { BgLetter } from '../data/letters'
import { useSpeech } from '../hooks/useSpeech'
import { useSoundEffects } from '../hooks/useSoundEffects'

interface Props {
  letter: BgLetter
  onComplete: (correct: boolean) => void
}

export default function TraceExercise({ letter, onComplete }: Props) {
  const { speak, supported } = useSpeech()
  const { playCorrect } = useSoundEffects()
  const [coverage, setCoverage] = useState(0)
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    setFinished(false)
    setCoverage(0)
    const t = setTimeout(() => speak(letter.speechText), 400)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [letter])

  const great = coverage >= DONE_THRESHOLD
  const canFinish = coverage >= MIN_TO_FINISH

  function handleFinish() {
    setFinished(true)
    playCorrect()
    // Tracing is practice, not a pass/fail test for a 5-year-old's motor skills:
    // finishing always counts as a completed round, coverage only flavors the message.
    setTimeout(() => onComplete(true), 1100)
  }

  return (
    <div className="flex min-h-full flex-1 flex-col items-center gap-2 px-6 py-2">
      <p className="text-center text-lg font-bold text-violet-800">Обиколи буквата с пръст ✍️</p>

      <KidButton
        onPress={() => speak(letter.speechText)}
        disabled={!supported}
        className="flex items-center gap-2 rounded-full bg-white px-5 py-2 text-xl font-extrabold text-violet-700 shadow-md active:scale-95 disabled:opacity-50"
      >
        🔊 {letter.letter}
      </KidButton>

      <div className="flex w-full flex-1 items-center justify-center py-1">
        <TraceCanvas letter={letter.letter} resetKey={0} onCoverageChange={setCoverage} />
      </div>

      <div className="flex w-full max-w-xs items-center gap-2">
        <div className="h-4 flex-1 overflow-hidden rounded-full bg-white/50">
          <div
            className="h-full rounded-full bg-emerald-400 transition-all duration-300"
            style={{ width: `${Math.min(100, Math.round(coverage * 100))}%` }}
          />
        </div>
      </div>

      <p className="flex items-center gap-2 text-base font-semibold text-violet-900">
        <span className="text-xl">{letter.emoji}</span>
        {letter.word}
      </p>

      {finished ? (
        <p className="animate-pop py-2 text-2xl font-extrabold text-emerald-600">
          {great ? 'Страхотно! 🎉' : 'Браво, опита се! 🙌'}
        </p>
      ) : (
        <KidButton
          onPress={handleFinish}
          disabled={!canFinish}
          className="w-full max-w-xs shrink-0 rounded-full bg-emerald-400 px-8 py-3 text-xl font-extrabold text-emerald-900 shadow-[0_6px_0_0_rgba(6,95,70,0.4)] transition active:translate-y-1 active:shadow-[0_2px_0_0_rgba(6,95,70,0.4)] disabled:opacity-40 disabled:active:translate-y-0"
        >
          Готово ✓
        </KidButton>
      )}
    </div>
  )
}
