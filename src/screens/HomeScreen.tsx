import { useState } from 'react'
import KidButton from '../components/KidButton'
import { useFullscreen } from '../hooks/useFullscreen'
import { useInstallPrompt } from '../hooks/useInstallPrompt'

const LENGTH_OPTIONS = [
  { rounds: 6, label: 'Кратка' },
  { rounds: 10, label: 'Средна' },
  { rounds: 16, label: 'Дълга' },
]

const FLOATING_LETTERS = ['А', 'Б', 'В', 'Ю', 'Я', 'Ж']

interface Props {
  onStart: (rounds: number) => void
  speechSupported: boolean
  hasBulgarianVoice: boolean
}

export default function HomeScreen({ onStart, speechSupported, hasBulgarianVoice }: Props) {
  const [rounds, setRounds] = useState(10)
  const { supported: fsSupported, isFullscreen, enter: enterFullscreen } = useFullscreen()
  const { canInstall, promptInstall } = useInstallPrompt()
  const [fsMessage, setFsMessage] = useState<string | null>(null)

  async function handleFullscreen() {
    const ok = await enterFullscreen()
    setFsMessage(ok ? null : 'Не проработи тук — виж „Добави към начален екран“ в менюто на браузъра, това работи сигурно.')
  }

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-between overflow-hidden bg-gradient-to-b from-violet-500 via-fuchsia-500 to-orange-400 px-6 py-10 text-center">
      {FLOATING_LETTERS.map((l, i) => (
        <span
          key={l}
          className="pointer-events-none absolute select-none text-6xl font-extrabold text-white/20"
          style={{
            left: `${(i * 37 + 8) % 90}%`,
            top: `${(i * 53 + 5) % 85}%`,
          }}
        >
          {l}
        </span>
      ))}

      <div className="animate-pop">
        <div className="flex h-32 w-32 items-center justify-center rounded-full bg-white text-7xl font-extrabold text-violet-600 shadow-lg">
          А
        </div>
      </div>

      <div className="z-10 flex flex-col items-center gap-2">
        <h1 className="text-5xl font-extrabold text-white drop-shadow-md sm:text-6xl">Букви и Звуци</h1>
        <p className="text-xl font-semibold text-white/90">Учим българската азбука, играейки!</p>
      </div>

      <div className="z-10 flex w-full max-w-sm flex-col items-center gap-6">
        {!speechSupported && (
          <p className="rounded-2xl bg-white/90 px-4 py-2 text-sm font-semibold text-rose-600">
            Твоят браузър няма звук за буквите 🔇 — играта пак работи, но без говор.
          </p>
        )}
        {speechSupported && !hasBulgarianVoice && (
          <p className="rounded-2xl bg-white/90 px-4 py-2 text-sm font-semibold text-amber-600">
            Няма открит български глас 🔈 — звукът може да звучи различно.
          </p>
        )}

        <div className="flex w-full justify-center gap-3">
          {LENGTH_OPTIONS.map((opt) => (
            <KidButton
              key={opt.rounds}
              onPress={() => setRounds(opt.rounds)}
              className={`flex-1 rounded-2xl px-3 py-3 text-lg font-bold shadow-md transition active:scale-95 ${
                rounds === opt.rounds
                  ? 'bg-white text-violet-600 ring-4 ring-white/60'
                  : 'bg-white/30 text-white hover:bg-white/40'
              }`}
            >
              {opt.label}
              <div className="text-sm font-medium opacity-80">{opt.rounds} букви</div>
            </KidButton>
          ))}
        </div>

        <KidButton
          onPress={() => onStart(rounds)}
          className="w-full rounded-full bg-yellow-300 px-10 py-5 text-3xl font-extrabold text-violet-700 shadow-[0_8px_0_0_rgba(180,120,0,0.5)] transition active:translate-y-1 active:shadow-[0_3px_0_0_rgba(180,120,0,0.5)]"
        >
          ▶ ИГРАЙ
        </KidButton>

        {(canInstall || (fsSupported && !isFullscreen)) && (
          <div className="flex w-full justify-center gap-2">
            {/* Plain native buttons on purpose, not KidButton: both
                requestFullscreen() and BeforeInstallPromptEvent.prompt()
                are picky about the browser's user-activation state and can
                silently no-op on a pointerdown-triggered press (observed:
                install "worked from the second try" — the first tap's
                activation wasn't fresh enough for the API, even though it
                felt identical to the child-facing buttons). A real click
                is the one gesture type every browser reliably honors for
                these APIs, and these two are one-time setup actions a
                parent taps deliberately, not something a distracted 5-year
                -old mashes — KidButton's touch-responsiveness trade-off
                isn't needed here, so the extra reliability wins outright. */}
            {canInstall && (
              <button
                onClick={promptInstall}
                className="flex-1 rounded-full bg-white/25 px-3 py-2 text-sm font-bold text-white active:scale-95"
              >
                📲 Инсталирай
              </button>
            )}
            {fsSupported && !isFullscreen && (
              <button
                onClick={handleFullscreen}
                className="flex-1 rounded-full bg-white/25 px-3 py-2 text-sm font-bold text-white active:scale-95"
              >
                ⛶ Цял екран
              </button>
            )}
          </div>
        )}
        {fsMessage && <p className="rounded-2xl bg-white/90 px-4 py-2 text-sm font-semibold text-violet-700">{fsMessage}</p>}
      </div>
    </div>
  )
}
