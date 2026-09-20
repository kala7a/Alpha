import type { BgLetter } from './data/letters'

export type ExerciseType = 'trace' | 'choice' | 'word'

/** Easy is capitals only; hard mixes in the small letters too. */
export type Difficulty = 'easy' | 'hard'

/**
 * Whether this round shows its letter as a small one. Every option in a round
 * shares it, so "which letter is this?" never comes down to telling а from А.
 */
interface RoundCase {
  lowercase: boolean
}

export interface TraceExercise extends RoundCase {
  type: 'trace'
  letter: BgLetter
}

export interface ChoiceExercise extends RoundCase {
  type: 'choice'
  letter: BgLetter
  options: BgLetter[]
}

/** Say a word aloud ("слон"), child picks which of 2 letters it starts with. */
export interface WordExercise extends RoundCase {
  type: 'word'
  letter: BgLetter
  options: BgLetter[]
}

export type Exercise = TraceExercise | ChoiceExercise | WordExercise

export interface RoundResult {
  exercise: Exercise
  correct: boolean
}
