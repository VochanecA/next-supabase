// types/dodo-webhook.ts

export interface DodoWebhookPayload<TData = unknown> {
  business_id: string
  type: string
  timestamp: string
  data: TData
}

// Payment succeeded
export interface DodoPaymentSucceededData {
  payment_id: string
  total_amount: number
  currency: string
  status: 'succeeded' | 'failed' | 'pending' | 'processing' | 'cancelled'
  customer: { customer_id: string; email: string; name?: string }
  subscription_id?: string
  product_id?: string
  price_id?: string
}

// Subscription cancelled
export interface DodoSubscriptionCancelledData {
  subscription_id: string
  status: 'cancelled'
  customer: { customer_id: string; email: string; name?: string }
}

// Union of all webhook payloads you care about
export type MyWebhookPayload =
  | DodoWebhookPayload<DodoPaymentSucceededData> & { type: 'payment.succeeded' }
  | DodoWebhookPayload<DodoSubscriptionCancelledData> & { type: 'subscription.cancelled' }
