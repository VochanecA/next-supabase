// app/checkout/route.ts
import { Checkout } from '@dodopayments/nextjs'

// GET: Static Checkout (query params)
export const GET = Checkout({
  bearerToken: process.env.DODO_PAYMENTS_API_KEY!,
  returnUrl: process.env.DODO_PAYMENTS_RETURN_URL,
  environment: process.env.DODO_PAYMENTS_ENVIRONMENT,
  type: 'static',
})

// POST: Session Checkout (JSON body)
export const POST = Checkout({
  bearerToken: process.env.DODO_PAYMENTS_API_KEY!,
  returnUrl: process.env.DODO_PAYMENTS_RETURN_URL,
  environment: process.env.DODO_PAYMENTS_ENVIRONMENT,
  type: 'session',
})

// For request typing (optional, but good practice)
export type CheckoutRequest = {
  product_cart: Array<{ product_id: string; quantity: number }>
}
