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
  payment_method?: string
  card_last_four?: string
  card_network?: string
  card_type?: string
  metadata?: Record<string, unknown>
}

// Subscription created / active
export interface DodoSubscriptionCreatedData {
  subscription_id: string
  status: 'active'
  customer: { customer_id: string; email: string; name?: string }
  product_id?: string
  quantity?: number
  currency?: string
  start_date?: string
  next_billing_date?: string
  trial_period_days?: number
  metadata?: Record<string, unknown>
  created_at?: string
}

// Subscription cancelled
export interface DodoSubscriptionCancelledData {
  subscription_id: string
  status: 'cancelled'
  customer: { customer_id: string; email: string; name?: string }
  product_id?: string
  quantity?: number
  currency?: string
  start_date?: string
  next_billing_date?: string
  trial_period_days?: number
  metadata?: Record<string, unknown>
  created_at?: string
}

// Refund
export interface DodoRefundData {
  refund_id: string
  payment_id: string
  customer: { customer_id: string; email: string; name?: string }
  amount: number
  currency?: string
  is_partial?: boolean
  reason?: string
  status?: string
  created_at?: string
}

// Dispute
export interface DodoDisputeData {
  dispute_id: string
  payment_id: string
  amount?: number | string
  currency?: string
  dispute_stage?: string
  dispute_status?: string
  remarks?: string
  created_at?: string
}

// Subscription active
export interface DodoSubscriptionActiveData {
  subscription_id: string
  status: 'active'
  customer: { customer_id: string; email: string; name?: string }
  product_id?: string
  quantity?: number
  currency?: string
  start_date?: string
  next_billing_date?: string
  trial_period_days?: number
  metadata?: Record<string, unknown>
  created_at?: string
  expires_at?: string
}

// Update MyWebhookPayload union
export type MyWebhookPayload =
  | (DodoWebhookPayload<DodoPaymentSucceededData> & { type: 'payment.succeeded' })
  | (DodoWebhookPayload<DodoSubscriptionCreatedData> & { type: 'subscription.created' })
  | (DodoWebhookPayload<DodoSubscriptionActiveData> & { type: 'subscription.active' })
  | (DodoWebhookPayload<DodoSubscriptionCancelledData> & { type: 'subscription.cancelled' })
  | (DodoWebhookPayload<DodoRefundData> & { type: 'payment.refund' })
  | (DodoWebhookPayload<DodoDisputeData> & { type: 'payment.dispute' })
