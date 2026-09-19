export interface WordOption {
  /** A simple, well-known word starting with the letter. */
  word: string
  /** An emoji illustrating the word. */
  emoji: string
}

export interface BgLetter {
  /** The uppercase Cyrillic glyph shown to the child. */
  letter: string
  /** How the letter's name is pronounced, used as the speech-synthesis text. */
  speechText: string
  /**
   * One or more word+emoji options for this letter, picked at random per
   * round for variety. Some letters only get one: forcing a second or
   * third word onto a letter with no other good, clearly-illustrated,
   * kid-recognizable match would do more harm than good.
   */
  words: WordOption[]
}

/** Picks one word+emoji option for a letter, e.g. once per round. */
export function pickWordOption(letter: BgLetter): WordOption {
  return letter.words[Math.floor(Math.random() * letter.words.length)]
}

// The 30 letters of the Bulgarian Cyrillic alphabet, in order.
export const ALPHABET: BgLetter[] = [
  {
    letter: 'А',
    speechText: 'а',
    words: [
      { word: 'ананас', emoji: '🍍' },
      { word: 'акула', emoji: '🦈' },
      { word: 'автобус', emoji: '🚌' },
    ],
  },
  {
    letter: 'Б',
    speechText: 'бъ',
    words: [
      { word: 'балон', emoji: '🎈' },
      { word: 'банан', emoji: '🍌' },
      { word: 'бухал', emoji: '🦉' },
    ],
  },
  {
    letter: 'В',
    speechText: 'въ',
    words: [
      { word: 'вълк', emoji: '🐺' },
      { word: 'вагон', emoji: '🚃' },
    ],
  },
  {
    letter: 'Г',
    speechText: 'гъ',
    words: [
      { word: 'гъба', emoji: '🍄' },
      { word: 'грозде', emoji: '🍇' },
    ],
  },
  {
    letter: 'Д',
    speechText: 'дъ',
    words: [
      { word: 'домат', emoji: '🍅' },
      { word: 'делфин', emoji: '🐬' },
      { word: 'дърво', emoji: '🌳' },
    ],
  },
  {
    letter: 'Е',
    speechText: 'е',
    words: [
      { word: 'еднорог', emoji: '🦄' },
      { word: 'елха', emoji: '🎄' },
    ],
  },
  {
    letter: 'Ж',
    speechText: 'жъ',
    words: [
      { word: 'жираф', emoji: '🦒' },
      { word: 'жаба', emoji: '🐸' },
    ],
  },
  {
    letter: 'З',
    speechText: 'зъ',
    words: [
      { word: 'заек', emoji: '🐇' },
      { word: 'звезда', emoji: '⭐' },
      { word: 'змия', emoji: '🐍' },
    ],
  },
  {
    letter: 'И',
    speechText: 'и',
    words: [{ word: 'игра', emoji: '🎮' }],
  },
  {
    letter: 'Й',
    speechText: 'и кратко',
    words: [{ word: 'йо-йо', emoji: '🪀' }],
  },
  {
    letter: 'К',
    speechText: 'къ',
    words: [
      { word: 'котка', emoji: '🐱' },
      { word: 'кон', emoji: '🐴' },
      { word: 'ключ', emoji: '🔑' },
    ],
  },
  {
    letter: 'Л',
    speechText: 'лъ',
    words: [
      { word: 'лъв', emoji: '🦁' },
      { word: 'лале', emoji: '🌷' },
      { word: 'лодка', emoji: '⛵' },
    ],
  },
  {
    letter: 'М',
    speechText: 'мъ',
    words: [
      { word: 'маймуна', emoji: '🐒' },
      { word: 'мишка', emoji: '🐭' },
      { word: 'молив', emoji: '✏️' },
    ],
  },
  {
    letter: 'Н',
    speechText: 'нъ',
    words: [
      { word: 'нос', emoji: '👃' },
      { word: 'носорог', emoji: '🦏' },
    ],
  },
  {
    letter: 'О',
    speechText: 'о',
    words: [
      { word: 'октопод', emoji: '🐙' },
      { word: 'очи', emoji: '👀' },
      { word: 'огън', emoji: '🔥' },
    ],
  },
  {
    letter: 'П',
    speechText: 'пъ',
    words: [
      { word: 'патка', emoji: '🦆' },
      { word: 'панда', emoji: '🐼' },
      { word: 'пеперуда', emoji: '🦋' },
    ],
  },
  {
    letter: 'Р',
    speechText: 'ръ',
    words: [
      { word: 'риба', emoji: '🐟' },
      { word: 'ракета', emoji: '🚀' },
    ],
  },
  {
    letter: 'С',
    speechText: 'съ',
    words: [
      { word: 'слон', emoji: '🐘' },
      { word: 'слънце', emoji: '☀️' },
      { word: 'сърце', emoji: '❤️' },
    ],
  },
  {
    letter: 'Т',
    speechText: 'тъ',
    words: [
      { word: 'тигър', emoji: '🐯' },
      { word: 'торта', emoji: '🎂' },
      { word: 'трактор', emoji: '🚜' },
    ],
  },
  {
    letter: 'У',
    speechText: 'у',
    words: [
      { word: 'ухо', emoji: '👂' },
      { word: 'усмивка', emoji: '😊' },
    ],
  },
  {
    letter: 'Ф',
    speechText: 'фъ',
    words: [
      { word: 'фламинго', emoji: '🦩' },
      { word: 'футбол', emoji: '⚽' },
    ],
  },
  {
    letter: 'Х',
    speechText: 'хъ',
    words: [
      { word: 'хляб', emoji: '🍞' },
      { word: 'хвърчило', emoji: '🪁' },
    ],
  },
  {
    letter: 'Ц',
    speechText: 'цъ',
    words: [
      { word: 'цвете', emoji: '🌸' },
      { word: 'цирк', emoji: '🎪' },
    ],
  },
  {
    letter: 'Ч',
    speechText: 'чъ',
    words: [
      { word: 'чадър', emoji: '☂️' },
      { word: 'часовник', emoji: '⏰' },
    ],
  },
  {
    letter: 'Ш',
    speechText: 'шъ',
    words: [
      { word: 'шапка', emoji: '🎩' },
      { word: 'шоколад', emoji: '🍫' },
    ],
  },
  {
    letter: 'Щ',
    speechText: 'щъ',
    words: [{ word: 'щастие', emoji: '😊' }],
  },
  {
    letter: 'Ъ',
    speechText: 'ъ',
    words: [{ word: 'ъгъл', emoji: '📐' }],
  },
  {
    letter: 'Ь',
    speechText: 'ер малък',
    words: [{ word: 'ер малък', emoji: '🤏' }],
  },
  {
    letter: 'Ю',
    speechText: 'ю',
    words: [
      { word: 'юмрук', emoji: '👊' },
      { word: 'юфка', emoji: '🍜' },
    ],
  },
  {
    letter: 'Я',
    speechText: 'я',
    words: [
      { word: 'яйце', emoji: '🥚' },
      { word: 'ябълка', emoji: '🍎' },
    ],
  },
]
