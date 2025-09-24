// env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_SUPABASE_URL: string
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY: string
    SUPABASE_SERVICE_ROLE_KEY: string

    DODO_PAYMENTS_API_KEY: string
    DODO_PAYMENTS_RETURN_URL: string
    DODO_WEBHOOK_SECRET: string
    DODO_PAYMENTS_ENVIRONMENT: 'test_mode' | 'live_mode'

    NEXT_PUBLIC_DODO_PAYMENTS_ENVIRONMENT?: 'test_mode' | 'live_mode'
    OPENROUTER_API_KEY?: string

    // Optional Vercel environment variables
    VERCEL_URL?: string
    VERCEL_ENV?: string
  }
}
