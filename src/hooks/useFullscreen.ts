import { useCallback, useEffect, useState } from 'react'

const supported = typeof document !== 'undefined' && document.documentElement.requestFullscreen !== undefined

export function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(
    () => typeof document !== 'undefined' && document.fullscreenElement !== null,
  )

  useEffect(() => {
    const onChange = () => setIsFullscreen(document.fullscreenElement !== null)
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  const enter = useCallback(async () => {
    if (!supported) return false
    try {
      await document.documentElement.requestFullscreen()
      return true
    } catch {
      // Rejected — commonly because this particular call wasn't close
      // enough to a user gesture for the browser's liking, or fullscreen
      // is blocked by a permissions policy. Nothing to recover from here;
      // the caller decides what (if anything) to tell the user.
      return false
    }
  }, [])

  return { supported, isFullscreen, enter }
}
