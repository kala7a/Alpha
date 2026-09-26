import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages serves this project from https://kala7a.github.io/AzVedi/,
  // so all built asset URLs need the repo name as their base path. Keep it in
  // step with the repo name: renaming the repo moves the site.
  base: '/AzVedi/',
  plugins: [react(), tailwindcss()],
})
