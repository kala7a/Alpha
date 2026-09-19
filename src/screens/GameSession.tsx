import { useMemo, useState } from 'react'
import { buildSession } from '../data/session'
import TraceExercise from './TraceExercise'
import ChoiceExercise from './ChoiceExercise'

interface Props {
  roundCount: number
  onFinish: (correct: number, total: number) => void
}

export default function GameSession({ roundCount, onFinish }: Props) {
  const exercises = useMemo(() => buildSession(roundCount), [roundCount])
  const [index, setIndex] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)

  const exercise = exercises[index]

  function handleRoundComplete(correct: boolean) {
    const nextCorrect = correctCount + (correct ? 1 : 0)
    setCorrectCount(nextCorrect)
    if (index + 1 >= exercises.length) {
      onFinish(nextCorrect, exercises.length)
    } else {
      setIndex(index + 1)
    }
  }

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-gradient-to-b from-sky-200 via-violet-100 to-pink-100">
      <div className="flex shrink-0 items-center gap-3 px-6 pt-4">
        <div className="h-4 flex-1 overflow-hidden rounded-full bg-white/70">
          <div
            className="h-full rounded-full bg-violet-500 transition-all duration-500"
            style={{ width: `${(index / exercises.length) * 100}%` }}
          />
        </div>
        <span className="text-lg font-bold text-violet-700">
          {index + 1}/{exercises.length}
        </span>
      </div>

      <div key={index} className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        {exercise.type === 'trace' ? (
          <TraceExercise letter={exercise.letter} onComplete={handleRoundComplete} />
        ) : (
          <ChoiceExercise letter={exercise.letter} options={exercise.options} onComplete={handleRoundComplete} />
        )}
      </div>
    </div>
  )
}
