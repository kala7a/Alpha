import type { BgLetter, WordOption } from './letters'

/**
 * Two natural ways to say a letter's sound out loud, picked at random per
 * round. Both start with "Буквата <sound>" rather than the bare sound:
 * speech engines (Chrome especially) reliably clip roughly the first
 * 100-200ms of an utterance, and for a sound this short — "ръ", "о" — that
 * clipped fraction is the entire sound. "Буквата" absorbs the clip instead.
 */
export function buildSpokenPhrase(letter: BgLetter, word: WordOption): string {
  const variants = [`Буквата ${letter.speechText}`]
  // Only add the "letter, like word" variant when there's an actual word to
  // reference — Ь's "word" is just its own name again ("ер малък"), so this
  // would otherwise say "Буквата ер малък, като ер малък".
  if (word.word !== letter.speechText) {
    variants.push(`Буквата ${letter.speechText}, като ${word.word}`)
  }
  return variants[Math.floor(Math.random() * variants.length)]
}

/** For the "which letter does this word start with?" exercise. */
export function buildWordPhrase(word: WordOption): string {
  return `Думата ${word.word}`
}
