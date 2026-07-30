/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the Spring Boot API. Baked in at build time. */
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
