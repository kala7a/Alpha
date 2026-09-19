export interface BgLetter {
  /** The uppercase Cyrillic glyph shown to the child. */
  letter: string
  /** How the letter's name is pronounced, used as the speech-synthesis text. */
  speechText: string
  /** A simple, well-known word starting with the letter, for flavor. */
  word: string
  /** An emoji illustrating the word. */
  emoji: string
}

// The 30 letters of the Bulgarian Cyrillic alphabet, in order.
export const ALPHABET: BgLetter[] = [
  { letter: 'А', speechText: 'а', word: 'ананас', emoji: '🍍' },
  { letter: 'Б', speechText: 'бъ', word: 'балон', emoji: '🎈' },
  { letter: 'В', speechText: 'въ', word: 'вълк', emoji: '🐺' },
  { letter: 'Г', speechText: 'гъ', word: 'гъба', emoji: '🍄' },
  { letter: 'Д', speechText: 'дъ', word: 'домат', emoji: '🍅' },
  { letter: 'Е', speechText: 'е', word: 'еднорог', emoji: '🦄' },
  { letter: 'Ж', speechText: 'жъ', word: 'жираф', emoji: '🦒' },
  { letter: 'З', speechText: 'зъ', word: 'заек', emoji: '🐇' },
  { letter: 'И', speechText: 'и', word: 'игра', emoji: '🎮' },
  { letter: 'Й', speechText: 'и кратко', word: 'йо-йо', emoji: '🪀' },
  { letter: 'К', speechText: 'къ', word: 'котка', emoji: '🐱' },
  { letter: 'Л', speechText: 'лъ', word: 'лъв', emoji: '🦁' },
  { letter: 'М', speechText: 'мъ', word: 'маймуна', emoji: '🐒' },
  { letter: 'Н', speechText: 'нъ', word: 'нос', emoji: '👃' },
  { letter: 'О', speechText: 'о', word: 'октопод', emoji: '🐙' },
  { letter: 'П', speechText: 'пъ', word: 'патка', emoji: '🦆' },
  { letter: 'Р', speechText: 'ръ', word: 'риба', emoji: '🐟' },
  { letter: 'С', speechText: 'съ', word: 'слон', emoji: '🐘' },
  { letter: 'Т', speechText: 'тъ', word: 'тигър', emoji: '🐯' },
  { letter: 'У', speechText: 'у', word: 'ухо', emoji: '👂' },
  { letter: 'Ф', speechText: 'фъ', word: 'фламинго', emoji: '🦩' },
  { letter: 'Х', speechText: 'хъ', word: 'хляб', emoji: '🍞' },
  { letter: 'Ц', speechText: 'цъ', word: 'цвете', emoji: '🌸' },
  { letter: 'Ч', speechText: 'чъ', word: 'чадър', emoji: '☂️' },
  { letter: 'Ш', speechText: 'шъ', word: 'шапка', emoji: '🎩' },
  { letter: 'Щ', speechText: 'щъ', word: 'щастие', emoji: '😊' },
  { letter: 'Ъ', speechText: 'ъ', word: 'ъгъл', emoji: '📐' },
  { letter: 'Ь', speechText: 'ер малък', word: 'ер малък', emoji: '🤏' },
  { letter: 'Ю', speechText: 'ю', word: 'юмрук', emoji: '👊' },
  { letter: 'Я', speechText: 'я', word: 'яйце', emoji: '🥚' },
]
