import { useState } from 'react'
import HomeScreen from './screens/HomeScreen'
import GameSession from './screens/GameSession'
import ResultsScreen from './screens/ResultsScreen'
import { useSpeech } from './hooks/useSpeech'

type Screen = { name: 'home' } | { name: 'session'; rounds: number } | { name: 'results'; correct: number; total: number }

export default function App() {
  const [screen, setScreen] = useState<Screen>({ name: 'home' })
  const { supported, hasBulgarianVoice } = useSpeech()

  if (screen.name === 'session') {
    return (
      <GameSession
        roundCount={screen.rounds}
        onFinish={(correct, total) => setScreen({ name: 'results', correct, total })}
      />
    )
  }

  if (screen.name === 'results') {
    return (
      <ResultsScreen
        correct={screen.correct}
        total={screen.total}
        onPlayAgain={() => setScreen({ name: 'session', rounds: screen.total })}
        onHome={() => setScreen({ name: 'home' })}
      />
    )
  }

  return (
    <HomeScreen
      onStart={(rounds) => setScreen({ name: 'session', rounds })}
      speechSupported={supported}
      hasBulgarianVoice={hasBulgarianVoice}
    />
  )
}
