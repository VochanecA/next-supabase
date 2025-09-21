// env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    DODO_PAYMENTS_API_KEY: string
    DODO_PAYMENTS_RETURN_URL: string
    DODO_WEBHOOK_SECRET: string
    DODO_PAYMENTS_ENVIRONMENT: 'test_mode' | 'live_mode'
  }
}
