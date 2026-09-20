import { ALPHABET, type BgLetter } from './letters'
import type { ChoiceExercise, Difficulty, Exercise, TraceExercise, WordExercise } from '../types'

/** Rounds per game. Fixed now that the home screen picks difficulty, not length. */
export const ROUND_COUNT = 10

// Letters kept out of the "listen and choose" pool: their names are too similar
// to neighbors for a 5-year-old to reliably tell apart by ear alone.
const CHOICE_EXCLUDED = new Set(['Ь'])

// Letters with no real associated word (Ь's "word" is just its own name again),
// so they can't be the answer in a "which letter does this word start with?" round.
const WORD_EXCLUDED = new Set(['Ь'])

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

export function buildSession(difficulty: Difficulty): Exercise[] {
  const letters = shuffle(ALPHABET).slice(0, ROUND_COUNT)
  const choicePool = ALPHABET.filter((l) => !CHOICE_EXCLUDED.has(l.letter))
  const wordPool = ALPHABET.filter((l) => !WORD_EXCLUDED.has(l.letter))

  return letters.map((letter): Exercise => {
    // Roughly even three-way mix, so tracing, listen-and-pick and
    // word-first-letter rounds all show up across a session.
    const roll = Math.random()
    const type = roll < 1 / 3 ? 'trace' : roll < 2 / 3 ? 'choice' : 'word'
    const cursive = difficulty === 'hard'

    if (type === 'choice') {
      const exercise: ChoiceExercise = {
        type: 'choice',
        letter,
        options: pickOptions(letter, choicePool, 4),
        cursive,
      }
      return exercise
    }
    if (type === 'word' && !WORD_EXCLUDED.has(letter.letter)) {
      const exercise: WordExercise = {
        type: 'word',
        letter,
        options: pickOptions(letter, wordPool, 2),
        cursive,
      }
      return exercise
    }
    const exercise: TraceExercise = { type: 'trace', letter, cursive }
    return exercise
  })
}
