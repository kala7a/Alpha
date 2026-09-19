import { useEffect, useState } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

/**
 * Captures Chrome's install prompt so it can be triggered from our own
 * button instead of waiting on the browser's own (inconsistently-timed,
 * easy-to-miss) automatic install banner. Only ever fires at all once the
 * site meets Chrome's installability bar — manifest + a registered service
 * worker — so `canInstall` staying false can also mean that isn't met yet.
 */
export function useInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [installed, setInstalled] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(display-mode: standalone)').matches,
  )

  useEffect(() => {
    function onBeforeInstallPrompt(e: Event) {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }
    function onInstalled() {
      setInstalled(true)
      setDeferredPrompt(null)
    }
    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  async function promptInstall() {
    if (!deferredPrompt) return
    try {
      await deferredPrompt.prompt()
      await deferredPrompt.userChoice
      setDeferredPrompt(null)
    } catch {
      // Rejected — most likely the same gesture-freshness issue prompt()
      // is picky about. Leave deferredPrompt as-is so a retry is possible
      // instead of the button just vanishing after a failed first tap.
    }
  }

  return { canInstall: deferredPrompt !== null && !installed, installed, promptInstall }
}
