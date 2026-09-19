import type { BgLetter } from './data/letters'

export type ExerciseType = 'trace' | 'choice' | 'word'

export interface TraceExercise {
  type: 'trace'
  letter: BgLetter
}

export interface ChoiceExercise {
  type: 'choice'
  letter: BgLetter
  options: BgLetter[]
}

/** Say a word aloud ("слон"), child picks which of 2 letters it starts with. */
export interface WordExercise {
  type: 'word'
  letter: BgLetter
  options: BgLetter[]
}

export type Exercise = TraceExercise | ChoiceExercise | WordExercise

export interface RoundResult {
  exercise: Exercise
  correct: boolean
}
