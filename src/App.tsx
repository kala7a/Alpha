import { useState } from 'react'
import HomeScreen from './screens/HomeScreen'
import GameSession from './screens/GameSession'
import ResultsScreen from './screens/ResultsScreen'
import VersionBadge from './components/VersionBadge'
import { useSpeech } from './hooks/useSpeech'

type Screen = { name: 'home' } | { name: 'session'; rounds: number } | { name: 'results'; correct: number; total: number }

export default function App() {
  const [screen, setScreen] = useState<Screen>({ name: 'home' })
  const { supported, hasBulgarianVoice, warmUp } = useSpeech()

  function startSession(rounds: number) {
    // Fired on the same tap that starts the session — the user gesture
    // both of these need, and enough head start before the first letter
    // sound is due a few hundred ms later once the round screen has
    // mounted. Fullscreen hides the browser's own toolbar (including its
    // back button) for the rest of the session; best-effort since some
    // browsers restrict or simply don't support it — a young child mashing
    // buttons shouldn't be able to exit the game by accident.
    document.documentElement.requestFullscreen?.().catch(() => {})
    warmUp()
    setScreen({ name: 'session', rounds })
  }

  let content
  if (screen.name === 'session') {
    content = (
      <GameSession
        roundCount={screen.rounds}
        onFinish={(correct, total) => setScreen({ name: 'results', correct, total })}
      />
    )
  } else if (screen.name === 'results') {
    content = (
      <ResultsScreen
        correct={screen.correct}
        total={screen.total}
        onPlayAgain={() => startSession(screen.total)}
        onHome={() => setScreen({ name: 'home' })}
      />
    )
  } else {
    content = (
      <HomeScreen
        onStart={startSession}
        speechSupported={supported}
        hasBulgarianVoice={hasBulgarianVoice}
      />
    )
  }

  return (
    <>
      {content}
      <VersionBadge />
    </>
  )
}
