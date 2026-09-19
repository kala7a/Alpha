const commitSha = import.meta.env.VITE_COMMIT_SHA
const buildTime = import.meta.env.VITE_BUILD_TIME

function shortSha(sha?: string): string {
  return sha ? sha.slice(0, 7) : 'dev'
}

function formatted(time?: string): string | null {
  if (!time) return null
  const d = new Date(time)
  if (Number.isNaN(d.getTime())) return null
  return d.toLocaleString('bg-BG', { dateStyle: 'short', timeStyle: 'short' })
}

/**
 * Tiny build stamp so it's possible to confirm a deploy actually landed
 * (commit + build time), without it competing for a 5-year-old's attention.
 */
export default function VersionBadge() {
  const time = formatted(buildTime)
  return (
    <div className="pointer-events-none fixed bottom-1 right-1.5 z-50 select-none text-[10px] font-medium text-black/25">
      {shortSha(commitSha)}
      {time ? ` · ${time}` : ''}
    </div>
  )
}
