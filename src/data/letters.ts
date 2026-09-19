export interface WordOption {
  /** A simple, well-known word starting with the letter. */
  word: string
  /**
   * The same word with an explicit stress mark (combining U+0301 right
   * after the stressed vowel) — used only for speech synthesis, never
   * shown on screen. Bulgarian spelling doesn't mark stress, so browsers'
   * Bulgarian voices often guess wrong for less common words (e.g. reading
   * "жираф" as "ЖИраф" instead of "жирАф"); this is the standard way to
   * hint the correct one. Omitted for single-syllable words, which have
   * no ambiguity to begin with.
   */
  spoken?: string
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

/** The text to actually pass to speech synthesis for a word option. */
export function spokenWord(word: WordOption): string {
  return word.spoken ?? word.word
}

// The 30 letters of the Bulgarian Cyrillic alphabet, in order.
export const ALPHABET: BgLetter[] = [
  {
    letter: 'А',
    speechText: 'а',
    words: [
      { word: 'ананас', spoken: 'анана́с', emoji: '🍍' },
      { word: 'акула', spoken: 'аку́ла', emoji: '🦈' },
      { word: 'автобус', spoken: 'авто́бус', emoji: '🚌' },
    ],
  },
  {
    letter: 'Б',
    speechText: 'бъ',
    words: [
      { word: 'балон', spoken: 'бало́н', emoji: '🎈' },
      { word: 'банан', spoken: 'бана́н', emoji: '🍌' },
      { word: 'бухал', spoken: 'бу́хал', emoji: '🦉' },
    ],
  },
  {
    letter: 'В',
    speechText: 'въ',
    words: [
      { word: 'вълк', emoji: '🐺' },
      { word: 'вагон', spoken: 'ваго́н', emoji: '🚃' },
    ],
  },
  {
    letter: 'Г',
    speechText: 'гъ',
    words: [
      { word: 'гъба', spoken: 'гъ́ба', emoji: '🍄' },
      { word: 'грозде', spoken: 'гро́зде', emoji: '🍇' },
    ],
  },
  {
    letter: 'Д',
    speechText: 'дъ',
    words: [
      { word: 'домат', spoken: 'дома́т', emoji: '🍅' },
      { word: 'делфин', spoken: 'делфи́н', emoji: '🐬' },
      { word: 'дърво', spoken: 'дърво́', emoji: '🌳' },
    ],
  },
  {
    letter: 'Е',
    speechText: 'е',
    words: [
      { word: 'еднорог', spoken: 'еднoро́г', emoji: '🦄' },
      { word: 'елха', spoken: 'елха́', emoji: '🎄' },
    ],
  },
  {
    letter: 'Ж',
    speechText: 'жъ',
    words: [
      { word: 'жираф', spoken: 'жира́ф', emoji: '🦒' },
      { word: 'жаба', spoken: 'жа́ба', emoji: '🐸' },
    ],
  },
  {
    letter: 'З',
    speechText: 'зъ',
    words: [
      { word: 'заек', spoken: 'за́ек', emoji: '🐇' },
      { word: 'звезда', spoken: 'звезда́', emoji: '⭐' },
      { word: 'змия', spoken: 'змия́', emoji: '🐍' },
    ],
  },
  {
    letter: 'И',
    speechText: 'и',
    words: [{ word: 'игра', spoken: 'игра́', emoji: '🎮' }],
  },
  {
    letter: 'Й',
    speechText: 'и кратко',
    words: [{ word: 'йо-йо', spoken: 'йо́-йо', emoji: '🪀' }],
  },
  {
    letter: 'К',
    speechText: 'къ',
    words: [
      { word: 'котка', spoken: 'ко́тка', emoji: '🐱' },
      { word: 'кон', emoji: '🐴' },
      { word: 'ключ', emoji: '🔑' },
    ],
  },
  {
    letter: 'Л',
    speechText: 'лъ',
    words: [
      { word: 'лъв', emoji: '🦁' },
      { word: 'лале', spoken: 'лале́', emoji: '🌷' },
      { word: 'лодка', spoken: 'ло́дка', emoji: '⛵' },
    ],
  },
  {
    letter: 'М',
    speechText: 'мъ',
    words: [
      { word: 'маймуна', spoken: 'майму́на', emoji: '🐒' },
      { word: 'мишка', spoken: 'ми́шка', emoji: '🐭' },
      { word: 'молив', spoken: 'мо́лив', emoji: '✏️' },
    ],
  },
  {
    letter: 'Н',
    speechText: 'нъ',
    words: [
      { word: 'нос', emoji: '👃' },
      { word: 'носорог', spoken: 'носоро́г', emoji: '🦏' },
    ],
  },
  {
    letter: 'О',
    speechText: 'о',
    words: [
      { word: 'октопод', spoken: 'октопо́д', emoji: '🐙' },
      { word: 'очи', spoken: 'очи́', emoji: '👀' },
      { word: 'огън', spoken: 'о́гън', emoji: '🔥' },
    ],
  },
  {
    letter: 'П',
    speechText: 'пъ',
    words: [
      { word: 'патица', spoken: 'па́тица', emoji: '🦆' },
      { word: 'панда', spoken: 'па́нда', emoji: '🐼' },
      { word: 'пеперуда', spoken: 'пеперу́да', emoji: '🦋' },
    ],
  },
  {
    letter: 'Р',
    speechText: 'ръ',
    words: [
      { word: 'риба', spoken: 'ри́ба', emoji: '🐟' },
      { word: 'ракета', spoken: 'раке́та', emoji: '🚀' },
    ],
  },
  {
    letter: 'С',
    speechText: 'съ',
    words: [
      { word: 'слон', emoji: '🐘' },
      { word: 'слънце', spoken: 'слъ́нце', emoji: '☀️' },
      { word: 'сърце', spoken: 'сърце́', emoji: '❤️' },
    ],
  },
  {
    letter: 'Т',
    speechText: 'тъ',
    words: [
      { word: 'тигър', spoken: 'ти́гър', emoji: '🐯' },
      { word: 'торта', spoken: 'то́рта', emoji: '🎂' },
      { word: 'трактор', spoken: 'тра́ктор', emoji: '🚜' },
    ],
  },
  {
    letter: 'У',
    speechText: 'у',
    words: [
      { word: 'ухо', spoken: 'ухо́', emoji: '👂' },
      { word: 'усмивка', spoken: 'усми́вка', emoji: '😊' },
    ],
  },
  {
    letter: 'Ф',
    speechText: 'фъ',
    words: [
      { word: 'фламинго', spoken: 'флами́нго', emoji: '🦩' },
      { word: 'футбол', spoken: 'футбо́л', emoji: '⚽' },
    ],
  },
  {
    letter: 'Х',
    speechText: 'хъ',
    words: [
      { word: 'хляб', emoji: '🍞' },
      { word: 'хвърчило', spoken: 'хвърчи́ло', emoji: '🪁' },
    ],
  },
  {
    letter: 'Ц',
    speechText: 'цъ',
    words: [
      { word: 'цвете', spoken: 'цве́те', emoji: '🌸' },
      { word: 'цирк', emoji: '🎪' },
    ],
  },
  {
    letter: 'Ч',
    speechText: 'чъ',
    words: [
      { word: 'чадър', spoken: 'чадъ́р', emoji: '☂️' },
      { word: 'часовник', spoken: 'часо́вник', emoji: '⏰' },
    ],
  },
  {
    letter: 'Ш',
    speechText: 'шъ',
    words: [
      { word: 'шапка', spoken: 'ша́пка', emoji: '🎩' },
      { word: 'шоколад', spoken: 'шокола́д', emoji: '🍫' },
    ],
  },
  {
    letter: 'Щ',
    speechText: 'щъ',
    words: [{ word: 'щастие', spoken: 'ща́стие', emoji: '😊' }],
  },
  {
    letter: 'Ъ',
    speechText: 'ъ',
    words: [{ word: 'ъгъл', spoken: 'ъ́гъл', emoji: '📐' }],
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
      { word: 'юмрук', spoken: 'юмру́к', emoji: '👊' },
      { word: 'юфка', spoken: 'ю́фка', emoji: '🍜' },
    ],
  },
  {
    letter: 'Я',
    speechText: 'я',
    words: [
      { word: 'яйце', spoken: 'яйце́', emoji: '🥚' },
      { word: 'ябълка', spoken: 'я́бълка', emoji: '🍎' },
    ],
  },
]
