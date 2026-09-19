import type { BgLetter } from './data/letters'

export type ExerciseType = 'trace' | 'choice'

export interface TraceExercise {
  type: 'trace'
  letter: BgLetter
}

export interface ChoiceExercise {
  type: 'choice'
  letter: BgLetter
  options: BgLetter[]
}

export type Exercise = TraceExercise | ChoiceExercise

export interface RoundResult {
  exercise: Exercise
  correct: boolean
}
