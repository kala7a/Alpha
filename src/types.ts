import type { BgLetter } from './data/letters'

export type ExerciseType = 'trace' | 'choice' | 'word'

/** Easy is printed capitals; hard is the handwritten (ръкописни) forms. */
export type Difficulty = 'easy' | 'hard'

/**
 * Whether this round shows its letter handwritten rather than printed. Every
 * option in a round shares it, so a round is never a mix of the two scripts.
 */
interface RoundScript {
  cursive: boolean
}

export interface TraceExercise extends RoundScript {
  type: 'trace'
  letter: BgLetter
}

export interface ChoiceExercise extends RoundScript {
  type: 'choice'
  letter: BgLetter
  options: BgLetter[]
}

/** Say a word aloud ("слон"), child picks which of 2 letters it starts with. */
export interface WordExercise extends RoundScript {
  type: 'word'
  letter: BgLetter
  options: BgLetter[]
}

export type Exercise = TraceExercise | ChoiceExercise | WordExercise

export interface RoundResult {
  exercise: Exercise
  correct: boolean
}
