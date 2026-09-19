import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Registering this is what makes Chrome consider the site "installable"
// (its PWA check wants a service worker in addition to the manifest) —
// without it, "Add to Home Screen" never offers the no-browser-chrome
// standalone mode, it just bookmarks the page instead.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => {})
  })
}
