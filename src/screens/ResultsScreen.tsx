interface Props {
  correct: number
  total: number
  onPlayAgain: () => void
  onHome: () => void
}

function starsFor(ratio: number): number {
  if (ratio >= 0.85) return 3
  if (ratio >= 0.6) return 2
  return 1
}

function messageFor(stars: number): string {
  if (stars === 3) return 'Ти си истинска звезда! 🌟'
  if (stars === 2) return 'Много добре се справи! 👏'
  return 'Браво, че игра! Ще станеш още по-добър! 💪'
}

export default function ResultsScreen({ correct, total, onPlayAgain, onHome }: Props) {
  const ratio = total > 0 ? correct / total : 0
  const stars = starsFor(ratio)

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-gradient-to-b from-emerald-400 via-teal-400 to-sky-400 px-6 py-10 text-center">
      <div className="animate-pop text-7xl">🏆</div>

      <div className="flex gap-2 text-6xl">
        {[0, 1, 2].map((i) => (
          <span key={i} className={i < stars ? 'animate-pop' : 'opacity-30'} style={{ animationDelay: `${i * 0.15}s` }}>
            ⭐
          </span>
        ))}
      </div>

      <h2 className="text-3xl font-extrabold text-white drop-shadow">{messageFor(stars)}</h2>

      <p className="rounded-3xl bg-white/90 px-8 py-4 text-2xl font-bold text-teal-700 shadow-md">
        {correct} от {total} точно
      </p>

      <div className="flex w-full max-w-xs flex-col gap-3">
        <button
          onClick={onPlayAgain}
          className="rounded-full bg-yellow-300 px-8 py-4 text-2xl font-extrabold text-teal-700 shadow-[0_6px_0_0_rgba(180,120,0,0.5)] transition active:translate-y-1 active:shadow-[0_2px_0_0_rgba(180,120,0,0.5)]"
        >
          🔁 Играй пак
        </button>
        <button
          onClick={onHome}
          className="rounded-full bg-white/80 px-8 py-3 text-xl font-bold text-teal-700 shadow active:scale-95"
        >
          🏠 Начало
        </button>
      </div>
    </div>
  )
}
