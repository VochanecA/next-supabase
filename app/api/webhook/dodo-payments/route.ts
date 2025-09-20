'use server'

import { Webhooks } from '@dodopayments/nextjs'
import type {
  MyWebhookPayload,
  DodoWebhookPayload,
  DodoPaymentSucceededData,
  DodoSubscriptionActiveData,
  DodoSubscriptionCreatedData,
  DodoSubscriptionCancelledData,
  DodoRefundData,
  DodoDisputeData,
} from '@/types/dodo-webhook'
import { createClient } from '@/lib/supabase/server'
import { getRequiredWebhookKey } from '@/lib/env'

// --- Type Predicates ---
const isPaymentSucceeded = (
  payload: MyWebhookPayload
): payload is DodoWebhookPayload<DodoPaymentSucceededData> & { type: 'payment.succeeded' } =>
  payload.type === 'payment.succeeded'

const isSubscriptionActive = (
  payload: MyWebhookPayload
): payload is DodoWebhookPayload<DodoSubscriptionActiveData> & { type: 'subscription.active' } =>
  payload.type === 'subscription.active'

const isSubscriptionCreated = (
  payload: MyWebhookPayload
): payload is DodoWebhookPayload<DodoSubscriptionCreatedData> & { type: 'subscription.created' } =>
  payload.type === 'subscription.created'

const isSubscriptionCancelled = (
  payload: MyWebhookPayload
): payload is DodoWebhookPayload<DodoSubscriptionCancelledData> & { type: 'subscription.cancelled' } =>
  payload.type === 'subscription.cancelled'

const isRefund = (
  payload: MyWebhookPayload
): payload is DodoWebhookPayload<DodoRefundData> & { type: 'payment.refund' } =>
  payload.type === 'payment.refund'

const isDispute = (
  payload: MyWebhookPayload
): payload is DodoWebhookPayload<DodoDisputeData> & { type: 'payment.dispute' } =>
  payload.type === 'payment.dispute'

// --- Logger ---
const log = (...args: unknown[]): void => {
  if (process.env.NODE_ENV === 'development') console.log(...args)
}

// --- Supabase Helpers ---
const upsertCustomer = async (customer: { customer_id: string; email: string; name?: string }) => {
  const supabase = await createClient()
  await supabase
    .from('customers')
    .upsert(
      {
        customer_id: customer.customer_id,
        email: customer.email,
        name: customer.name ?? null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'customer_id' }
    )
}

const upsertSubscription = async (
  payload: DodoWebhookPayload<DodoSubscriptionActiveData | DodoSubscriptionCreatedData | DodoSubscriptionCancelledData>
) => {
  const data = payload.data
  const supabase = await createClient()

  await supabase
    .from('subscriptions')
    .upsert(
      {
        subscription_id: data.subscription_id,
        customer_id: data.customer.customer_id,
        product_id: data.product_id ?? null,
        subscription_status: data.status,
        quantity: data.quantity ?? 1,
        currency: data.currency ?? null,
        start_date: data.start_date ?? new Date().toISOString(),
        next_billing_date: data.next_billing_date ?? null,
        trial_end_date:
          'trial_period_days' in data && data.trial_period_days
            ? new Date(Date.now() + data.trial_period_days * 24 * 60 * 60 * 1000).toISOString()
            : null,
        metadata: data.metadata ?? {},
        created_at: data.created_at ?? new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'subscription_id' }
    )

  log('Processed subscription:', data.subscription_id, '→', data.status)
}

const upsertTransaction = async (payload: DodoWebhookPayload<DodoPaymentSucceededData>) => {
  const data = payload.data
  const supabase = await createClient()

  await supabase
    .from('transactions')
    .upsert(
      {
        transaction_id: data.payment_id,
        subscription_id: data.subscription_id ?? null,
        customer_id: data.customer.customer_id,
        status: data.status ?? 'unknown',
        amount: data.total_amount,
        currency: data.currency,
        payment_method: data.payment_method ?? null,
        card_last_four: data.card_last_four ?? null,
        card_network: data.card_network ?? null,
        card_type: data.card_type ?? null,
        billed_at: payload.timestamp,
        metadata: data.metadata ?? {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'transaction_id' }
    )

  log('Processed transaction:', data.payment_id, '→', data.status)
}

const upsertRefund = async (payload: DodoWebhookPayload<DodoRefundData>) => {
  const data = payload.data
  const supabase = await createClient()

  await supabase
    .from('refunds')
    .upsert(
      {
        refund_id: data.refund_id,
        transaction_id: data.payment_id,
        customer_id: data.customer.customer_id,
        amount: data.amount,
        currency: data.currency ?? null,
        is_partial: data.is_partial ?? false,
        reason: data.reason ?? null,
        status: data.status ?? null,
        created_at: data.created_at ?? new Date().toISOString(),
      },
      { onConflict: 'refund_id' }
    )

  log('Processed refund:', data.refund_id, '→', data.status)
}

const upsertDispute = async (payload: DodoWebhookPayload<DodoDisputeData>) => {
  const data = payload.data
  const supabase = await createClient()

  await supabase
    .from('disputes')
    .upsert(
      {
        dispute_id: data.dispute_id,
        transaction_id: data.payment_id,
        amount: data.amount ?? null,
        currency: data.currency ?? null,
        dispute_stage: data.dispute_stage ?? null,
        dispute_status: data.dispute_status ?? null,
        remarks: data.remarks ?? null,
        created_at: data.created_at ?? new Date().toISOString(),
      },
      { onConflict: 'dispute_id' }
    )

  log('Processed dispute:', data.dispute_id, '→', data.dispute_status)
}

// --- Webhook Handler ---
export const POST = Webhooks({
  webhookKey: getRequiredWebhookKey(),

  onPayload: async (payload: unknown) => {
    const p = payload as MyWebhookPayload
    log('🔔 Raw webhook payload:', p.type)

    // Upsert customer if present
    if ('customer' in p.data && p.data.customer) {
      await upsertCustomer(p.data.customer)
    }

    // Insert subscriptions for active, created, or cancelled events
    if (isSubscriptionActive(p) || isSubscriptionCreated(p) || isSubscriptionCancelled(p)) {
      await upsertSubscription(p)
    }

    // Insert transactions only on payment.succeeded
    if (isPaymentSucceeded(p)) {
      await upsertTransaction(p)
    }

    if (isRefund(p)) {
      await upsertRefund(p)
    }

    if (isDispute(p)) {
      await upsertDispute(p)
    }
  },
})
