/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Full commit SHA of the build, injected by the deploy workflow. */
  readonly VITE_COMMIT_SHA?: string
  /** ISO timestamp of the commit being built, injected by the deploy workflow. */
  readonly VITE_BUILD_TIME?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
