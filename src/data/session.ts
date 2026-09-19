import { ALPHABET, type BgLetter } from './letters'
import type { ChoiceExercise, Exercise, TraceExercise } from '../types'

// Letters kept out of the "listen and choose" pool: their names are too similar
// to neighbors for a 5-year-old to reliably tell apart by ear alone.
const CHOICE_EXCLUDED = new Set(['Ь'])

function shuffle<T>(items: T[]): T[] {
  const arr = [...items]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function pickOptions(correct: BgLetter, pool: BgLetter[], count: number): BgLetter[] {
  const distractors = shuffle(pool.filter((l) => l.letter !== correct.letter)).slice(0, count - 1)
  return shuffle([correct, ...distractors])
}

export function buildSession(roundCount: number): Exercise[] {
  const letters = shuffle(ALPHABET).slice(0, roundCount)
  const choicePool = ALPHABET.filter((l) => !CHOICE_EXCLUDED.has(l.letter))

  return letters.map((letter, i): Exercise => {
    // Alternate exercise types so both kinds show up in every session,
    // with a little randomness so it's not perfectly predictable.
    const useChoice = i % 2 === 0 ? Math.random() < 0.75 : Math.random() < 0.25
    if (useChoice) {
      const exercise: ChoiceExercise = {
        type: 'choice',
        letter,
        options: pickOptions(letter, choicePool, 4),
      }
      return exercise
    }
    const exercise: TraceExercise = { type: 'trace', letter }
    return exercise
  })
}
