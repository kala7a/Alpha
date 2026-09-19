import { useState } from 'react'
import HomeScreen from './screens/HomeScreen'
import GameSession from './screens/GameSession'
import ResultsScreen from './screens/ResultsScreen'
import VersionBadge from './components/VersionBadge'
import { useSpeech } from './hooks/useSpeech'

type Screen = { name: 'home' } | { name: 'session'; rounds: number } | { name: 'results'; correct: number; total: number }

export default function App() {
  const [screen, setScreen] = useState<Screen>({ name: 'home' })
  const { supported, hasBulgarianVoice } = useSpeech()

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
        onPlayAgain={() => setScreen({ name: 'session', rounds: screen.total })}
        onHome={() => setScreen({ name: 'home' })}
      />
    )
  } else {
    content = (
      <HomeScreen
        onStart={(rounds) => setScreen({ name: 'session', rounds })}
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
