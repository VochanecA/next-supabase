import { Webhooks } from '@dodopayments/nextjs'
import type { MyWebhookPayload, DodoWebhookPayload, DodoPaymentSucceededData, DodoSubscriptionCancelledData } from '@/types/dodo-webhook'
import { createClient } from '@/lib/supabase/server' // <-- use your exported function
import { getRequiredWebhookKey } from '@/lib/env'

// --- Type Predicates ---
function isPaymentSucceeded(
  payload: MyWebhookPayload
): payload is DodoWebhookPayload<DodoPaymentSucceededData> & { type: 'payment.succeeded' } {
  return payload.type === 'payment.succeeded'
}

function isSubscriptionCancelled(
  payload: MyWebhookPayload
): payload is DodoWebhookPayload<DodoSubscriptionCancelledData> & { type: 'subscription.cancelled' } {
  return payload.type === 'subscription.cancelled'
}

// --- Helpers ---
const log = (...args: unknown[]) => {
  if (process.env.NODE_ENV === 'development') console.log(...args)
}

async function upsertCustomer(customer: { customer_id: string; email: string }) {
  const supabase = await createClient()
  await supabase.from('customers').upsert(
    {
      customer_id: customer.customer_id,
      email: customer.email,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'customer_id' }
  )
}

async function upsertTransaction(payload: DodoWebhookPayload<DodoPaymentSucceededData>) {
  const data = payload.data
  const customer = data.customer

  if (!data.payment_id) return

  const supabase = await createClient()
  await supabase.from('transactions').upsert(
    {
      transaction_id: data.payment_id,
      subscription_id: data.subscription_id ?? null,
      customer_id: customer.customer_id,
      status: data.status,
      amount: data.total_amount,
      currency_code: data.currency,
      billed_at: payload.timestamp,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'transaction_id' }
  )

  log('Processed transaction:', data.payment_id, '→', data.status)
}

async function upsertSubscription(payload: DodoWebhookPayload<DodoSubscriptionCancelledData>) {
  const data = payload.data
  const customer = data.customer
  const supabase = await createClient()

  await supabase.from('subscriptions').upsert(
    {
      subscription_id: data.subscription_id,
      subscription_status: data.status,
      customer_id: customer.customer_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'subscription_id' }
  )

  log('Processed subscription:', data.subscription_id, '→', data.status)
}

// --- Webhook Handler ---
export const POST = Webhooks({
  webhookKey: getRequiredWebhookKey(),

  onPayload: async (payload: unknown) => {
    const p = payload as MyWebhookPayload
    log('🔔 Raw webhook payload:', p.type)

    if (isPaymentSucceeded(p)) {
      await upsertCustomer(p.data.customer)
      await upsertTransaction(p)
    }

    if (isSubscriptionCancelled(p)) {
      await upsertCustomer(p.data.customer)
      await upsertSubscription(p)
    }
  },

  onPaymentSucceeded: async (payload: unknown) => {
    const p = payload as MyWebhookPayload
    if (isPaymentSucceeded(p)) {
      await upsertCustomer(p.data.customer)
      await upsertTransaction(p)
    }
  },

  onSubscriptionCancelled: async (payload: unknown) => {
    const p = payload as MyWebhookPayload
    if (isSubscriptionCancelled(p)) {
      await upsertCustomer(p.data.customer)
      await upsertSubscription(p)
    }
  },
})
