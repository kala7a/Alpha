import type { BgLetter } from './letters'

/**
 * Two natural ways to say a letter's sound out loud, picked at random per
 * round. Both are built to end with the actual target sound rather than
 * start with it: speech engines (Chrome especially) reliably clip roughly
 * the first 100-200ms of an utterance, and for a sound this short — "ръ",
 * "бъ" — that clipped fraction is the entire leading consonant. Putting a
 * short lead-in ahead of it (the letter's own name, or the example word)
 * absorbs the clip instead of the real sound.
 */
export function buildSpokenPhrase(letter: BgLetter): string {
  const variants = [`Буквата ${letter.speechText}`, `${letter.word} започва с ${letter.speechText}`]
  return variants[Math.floor(Math.random() * variants.length)]
}

/** For the "which letter does this word start with?" exercise. */
export function buildWordPhrase(letter: BgLetter): string {
  return `Думата ${letter.word}`
}
