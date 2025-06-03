interface ImportMetaEnv {
  readonly VITE_API_ENDPOINT: string
  readonly VITE_APP_TITLE: string
  readonly VITE_MODE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
