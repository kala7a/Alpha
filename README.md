# Букви и Звуци (Letters and Sounds)

A small Duolingo-style learning game that teaches the Bulgarian Cyrillic
alphabet to young children (built with a 5-year-old in mind). No backend,
no AI — just a static React app.

## How it works

A play session is a short queue of rounds mixing two exercise types:

1. **Trace** — the child traces a large guide letter on a canvas with a
   finger (or mouse), while the letter's name is read aloud. Finishing a
   trace always completes the round; how much of the letter got covered
   only changes the celebration message, since grading a young child's
   handwriting precisely wouldn't be fair.
2. **Listen & choose** — a letter's name is read aloud and the child taps
   the matching letter out of 4 big options.

At the end of the session the child sees a star rating (1–3 stars) and can
play again. Session length (6 / 10 / 16 rounds) is picked from the home
screen, and letters + exercise types are randomized each time.

Letter audio uses the browser's built-in `SpeechSynthesis` API with a
Bulgarian voice when available (Chrome/Edge on most platforms). No audio
files are shipped. Correct/wrong feedback chimes are synthesized with the
Web Audio API, also with no audio assets.

## Project structure

- `src/data/letters.ts` — the 30-letter Bulgarian alphabet with an example
  word + emoji per letter.
- `src/data/session.ts` — builds a randomized round queue for a session.
- `src/hooks/useSpeech.ts` — Bulgarian text-to-speech wrapper.
- `src/hooks/useSoundEffects.ts` — synthesized correct/wrong chimes.
- `src/components/TraceCanvas.tsx` — the tracing canvas and coverage
  detection (via an offscreen dilated letter mask).
- `src/screens/` — `HomeScreen`, `GameSession`, `TraceExercise`,
  `ChoiceExercise`, `ResultsScreen`.

Adding a new exercise type later means adding a new entry to the
`Exercise` union in `src/types.ts`, a case in `session.ts`, and a new
screen component rendered from `GameSession.tsx`.

## Development

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check + production build
npm run lint     # oxlint
```
