// 'use server'

// import { Webhooks } from '@dodopayments/nextjs'
// import type {
//   MyWebhookPayload,
//   DodoWebhookPayload,
//   DodoPaymentSucceededData,
//   DodoSubscriptionActiveData,
//   DodoSubscriptionCreatedData,
//   DodoSubscriptionCancelledData,
//   DodoRefundData,
//   DodoDisputeData
// } from '@/types/dodo-webhook'
// import { createClient } from '@/lib/supabase/server'
// import { getRequiredWebhookKey } from '@/lib/env'

// const log = (...args: unknown[]): void => {
//   if (process.env.NODE_ENV === 'development') console.log(...args)
// }

// // --- Type Guards ---
// const isPaymentSucceeded = (p: MyWebhookPayload): p is DodoWebhookPayload<DodoPaymentSucceededData> & { type: 'payment.succeeded' } =>
//   p.type === 'payment.succeeded'

// const isSubscriptionActive = (p: MyWebhookPayload): p is DodoWebhookPayload<DodoSubscriptionActiveData> & { type: 'subscription.active' } =>
//   p.type === 'subscription.active'

// const isSubscriptionCreated = (p: MyWebhookPayload): p is DodoWebhookPayload<DodoSubscriptionCreatedData> & { type: 'subscription.created' } =>
//   p.type === 'subscription.created'

// const isSubscriptionCancelled = (p: MyWebhookPayload): p is DodoWebhookPayload<DodoSubscriptionCancelledData> & { type: 'subscription.cancelled' } =>
//   p.type === 'subscription.cancelled'

// const isRefund = (p: MyWebhookPayload): p is DodoWebhookPayload<DodoRefundData> & { type: 'payment.refund' } =>
//   p.type === 'payment.refund'

// const isDispute = (p: MyWebhookPayload): p is DodoWebhookPayload<DodoDisputeData> & { type: 'payment.dispute' } =>
//   p.type === 'payment.dispute'

// // --- Internal Helpers ---
// async function upsertCustomer(customer: { customer_id: string; email: string; name?: string }) {
//   const supabase = await createClient()

//   try {
//     // Check if email exists
//     const { data: existingByEmail, error: emailErr } = await supabase
//       .from('customers')
//       .select('customer_id')
//       .eq('email', customer.email)
//       .single()

//     if (emailErr && emailErr.code !== 'PGRST116') throw emailErr // ignore "no rows" error

//     if (existingByEmail) {
//       log(`🔄 Email already exists. Using existing customer_id: ${existingByEmail.customer_id}`)
//       return existingByEmail.customer_id
//     }

//     // Insert new customer
//     const { data, error } = await supabase
//       .from('customers')
//       .insert({
//         customer_id: customer.customer_id,
//         email: customer.email,
//         name: customer.name ?? null,
//         created_at: new Date().toISOString(),
//         updated_at: new Date().toISOString()
//       })
//       .select('customer_id')
//       .single()

//     if (error) throw error
//     log(`✅ Inserted new customer: ${data.customer_id} (email: ${customer.email})`)
//     return data.customer_id
//   } catch (err) {
//     log('❌ Failed to upsert customer:', customer.email, err)
//     return customer.customer_id
//   }
// }

// async function ensureProductExists(product_id: string) {
//   const supabase = await createClient()
//   const { error } = await supabase
//     .from('products')
//     .upsert(
//       {
//         product_id,
//         name: product_id,
//         created_at: new Date().toISOString(),
//         updated_at: new Date().toISOString()
//       },
//       { onConflict: 'product_id' }
//     )
//   if (error) log('❌ Failed to ensure product exists:', product_id, error)
// }

// async function upsertSubscription(payload: DodoWebhookPayload<DodoSubscriptionActiveData | DodoSubscriptionCreatedData | DodoSubscriptionCancelledData>) {
//   const supabase = await createClient()
//   const data = payload.data
//   if (data.product_id) await ensureProductExists(data.product_id)
//   const customerId = await upsertCustomer(data.customer)
//   const { error } = await supabase
//     .from('subscriptions')
//     .upsert(
//       {
//         subscription_id: data.subscription_id,
//         customer_id: customerId,
//         product_id: data.product_id ?? null,
//         subscription_status: data.status,
//         quantity: data.quantity ?? 1,
//         currency: data.currency ?? null,
//         start_date: data.start_date ?? new Date().toISOString(),
//         next_billing_date: data.next_billing_date ?? null,
//         trial_end_date: 'trial_period_days' in data && data.trial_period_days
//           ? new Date(Date.now() + data.trial_period_days * 24 * 60 * 60 * 1000).toISOString()
//           : null,
//         metadata: 'metadata' in data ? data.metadata : {},
//         created_at: data.created_at ?? new Date().toISOString(),
//         updated_at: new Date().toISOString()
//       },
//       { onConflict: 'subscription_id' }
//     )
//   if (error) log('❌ Failed to upsert subscription:', data.subscription_id, error)
// }

// async function upsertTransaction(payload: DodoWebhookPayload<DodoPaymentSucceededData>) {
//   const supabase = await createClient()
//   const data = payload.data
//   const customerId = await upsertCustomer(data.customer)
//   if (data.subscription_id) {
//     await supabase.from('subscriptions').upsert(
//       { subscription_id: data.subscription_id, customer_id: customerId, subscription_status: 'active', updated_at: new Date().toISOString() },
//       { onConflict: 'subscription_id' }
//     )
//   }
//   const { error } = await supabase.from('transactions').upsert(
//     {
//       transaction_id: data.payment_id,
//       subscription_id: data.subscription_id ?? null,
//       customer_id: customerId,
//       status: data.status ?? 'unknown',
//       amount: data.total_amount,
//       currency: data.currency ?? 'USD',
//       payment_method: data.payment_method ?? null,
//       card_last_four: data.card_last_four ?? null,
//       card_network: data.card_network ?? null,
//       card_type: data.card_type ?? null,
//       billed_at: payload.timestamp,
//       metadata: data.metadata ?? {},
//       created_at: new Date().toISOString(),
//       updated_at: new Date().toISOString()
//     },
//     { onConflict: 'transaction_id' }
//   )
//   if (error) log('❌ Failed to upsert transaction:', data.payment_id, error)
// }

// async function upsertRefund(payload: DodoWebhookPayload<DodoRefundData>) {
//   const supabase = await createClient()
//   const data = payload.data
//   const { error } = await supabase.from('refunds').upsert(
//     {
//       refund_id: data.refund_id,
//       transaction_id: data.payment_id,
//       customer_id: data.customer.customer_id,
//       amount: data.amount,
//       currency: data.currency ?? null,
//       is_partial: data.is_partial ?? false,
//       reason: data.reason ?? null,
//       status: data.status ?? null,
//       created_at: data.created_at ?? new Date().toISOString()
//     },
//     { onConflict: 'refund_id' }
//   )
//   if (error) log('❌ Failed to upsert refund:', data.refund_id, error)
// }

// async function upsertDispute(payload: DodoWebhookPayload<DodoDisputeData>) {
//   const supabase = await createClient()
//   const data = payload.data
//   const { error } = await supabase.from('disputes').upsert(
//     {
//       dispute_id: data.dispute_id,
//       transaction_id: data.payment_id,
//       amount: data.amount ?? null,
//       currency: data.currency ?? null,
//       dispute_stage: data.dispute_stage ?? null,
//       dispute_status: data.dispute_status ?? null,
//       remarks: data.remarks ?? null,
//       created_at: data.created_at ?? new Date().toISOString()
//     },
//     { onConflict: 'dispute_id' }
//   )
//   if (error) log('❌ Failed to upsert dispute:', data.dispute_id, error)
// }

// // --- Route Handler ---
// export const POST = Webhooks({
//   webhookKey: getRequiredWebhookKey(),
//   onPayload: async (payload: unknown) => {
//     const p = payload as MyWebhookPayload
//     log('🔔 Received webhook event:', p.type)
//     if ('customer' in p.data && p.data.customer) await upsertCustomer(p.data.customer)
//     if (isSubscriptionActive(p) || isSubscriptionCreated(p) || isSubscriptionCancelled(p)) await upsertSubscription(p)
//     if (isPaymentSucceeded(p)) await upsertTransaction(p)
//     if (isRefund(p)) await upsertRefund(p)
//     if (isDispute(p)) await upsertDispute(p)
//   }
// })


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
  DodoDisputeData
} from '@/types/dodo-webhook'
import { createClient } from '@/lib/supabase/server'
import { getRequiredWebhookKey } from '@/lib/env'

const log = (...args: unknown[]): void => {
  if (process.env.NODE_ENV === 'development') console.log(...args)
}

// --- Type Guards ---
const isPaymentSucceeded = (p: MyWebhookPayload): p is DodoWebhookPayload<DodoPaymentSucceededData> & { type: 'payment.succeeded' } =>
  p.type === 'payment.succeeded'

const isSubscriptionActive = (p: MyWebhookPayload): p is DodoWebhookPayload<DodoSubscriptionActiveData> & { type: 'subscription.active' } =>
  p.type === 'subscription.active'

const isSubscriptionCreated = (p: MyWebhookPayload): p is DodoWebhookPayload<DodoSubscriptionCreatedData> & { type: 'subscription.created' } =>
  p.type === 'subscription.created'

const isSubscriptionCancelled = (p: MyWebhookPayload): p is DodoWebhookPayload<DodoSubscriptionCancelledData> & { type: 'subscription.cancelled' } =>
  p.type === 'subscription.cancelled'

const isRefund = (p: MyWebhookPayload): p is DodoWebhookPayload<DodoRefundData> & { type: 'payment.refund' } =>
  p.type === 'payment.refund'

const isDispute = (p: MyWebhookPayload): p is DodoWebhookPayload<DodoDisputeData> & { type: 'payment.dispute' } =>
  p.type === 'payment.dispute'

// --- Supabase Helpers ---

/**
 * Upsert a row in any table
 */
async function upsertRow<TableRow extends Record<string, unknown>>(
  table: string,
  row: TableRow,
  conflictColumn: keyof TableRow
): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase.from(table).upsert(row, { onConflict: conflictColumn as string })
  if (error) log(`❌ Failed to upsert ${table}:`, row, error)
  else log(`✅ Upserted ${table}:`, row)
}

/**
 * Upsert customer with email deduplication
 */
async function upsertCustomer(customer: { customer_id: string; email: string; name?: string }) {
  const supabase = await createClient()
  try {
    // Check if email exists
    const { data: existingByEmail, error: emailErr } = await supabase
      .from('customers')
      .select('customer_id')
      .eq('email', customer.email)
      .single()

    if (emailErr && emailErr.code !== 'PGRST116') throw emailErr
    if (existingByEmail) {
      log(`🔄 Reusing existing customer_id ${existingByEmail.customer_id} for email ${customer.email}`)
      return existingByEmail.customer_id
    }

    await upsertRow('customers', {
      customer_id: customer.customer_id,
      email: customer.email,
      name: customer.name ?? null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }, 'customer_id')

    return customer.customer_id
  } catch (err) {
    log('❌ Failed to upsert customer:', customer.email, err)
    return customer.customer_id
  }
}

/**
 * Ensure product exists
 */
async function ensureProductExists(product_id: string) {
  await upsertRow('products', {
    product_id,
    name: product_id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }, 'product_id')
}

// --- Upsert Handlers ---
async function handleSubscription(payload: DodoWebhookPayload<DodoSubscriptionActiveData | DodoSubscriptionCreatedData | DodoSubscriptionCancelledData>) {
  const data = payload.data
  if (data.product_id) await ensureProductExists(data.product_id)
  const customerId = await upsertCustomer(data.customer)

  await upsertRow('subscriptions', {
    subscription_id: data.subscription_id,
    customer_id: customerId,
    product_id: data.product_id ?? null,
    subscription_status: data.status,
    quantity: data.quantity ?? 1,
    currency: data.currency ?? null,
    start_date: data.start_date ?? new Date().toISOString(),
    next_billing_date: data.next_billing_date ?? null,
    trial_end_date: 'trial_period_days' in data && data.trial_period_days
      ? new Date(Date.now() + data.trial_period_days * 24 * 60 * 60 * 1000).toISOString()
      : null,
    metadata: 'metadata' in data ? data.metadata : {},
    created_at: data.created_at ?? new Date().toISOString(),
    updated_at: new Date().toISOString()
  }, 'subscription_id')
}

async function handleTransaction(payload: DodoWebhookPayload<DodoPaymentSucceededData>) {
  const data = payload.data
  const customerId = await upsertCustomer(data.customer)

  if (data.subscription_id) {
    await upsertRow('subscriptions', {
      subscription_id: data.subscription_id,
      customer_id: customerId,
      subscription_status: 'active',
      updated_at: new Date().toISOString()
    }, 'subscription_id')
  }

  await upsertRow('transactions', {
    transaction_id: data.payment_id,
    subscription_id: data.subscription_id ?? null,
    customer_id: customerId,
    status: data.status ?? 'unknown',
    amount: data.total_amount,
    currency: data.currency ?? 'USD',
    payment_method: data.payment_method ?? null,
    card_last_four: data.card_last_four ?? null,
    card_network: data.card_network ?? null,
    card_type: data.card_type ?? null,
    billed_at: payload.timestamp,
    metadata: data.metadata ?? {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }, 'transaction_id')
}

async function handleRefund(payload: DodoWebhookPayload<DodoRefundData>) {
  const data = payload.data
  const customerId = await upsertCustomer(data.customer)
  await upsertRow('refunds', {
    refund_id: data.refund_id,
    transaction_id: data.payment_id,
    customer_id: customerId,
    amount: data.amount,
    currency: data.currency ?? null,
    is_partial: data.is_partial ?? false,
    reason: data.reason ?? null,
    status: data.status ?? null,
    created_at: data.created_at ?? new Date().toISOString()
  }, 'refund_id')
}

async function handleDispute(payload: DodoWebhookPayload<DodoDisputeData>) {
  const data = payload.data
  await upsertRow('disputes', {
    dispute_id: data.dispute_id,
    transaction_id: data.payment_id,
    amount: data.amount ?? null,
    currency: data.currency ?? null,
    dispute_stage: data.dispute_stage ?? null,
    dispute_status: data.dispute_status ?? null,
    remarks: data.remarks ?? null,
    created_at: data.created_at ?? new Date().toISOString()
    // Removed customer_id because DodoDisputeData has no customer
  }, 'dispute_id')
}

// --- Webhook Handler ---
export const POST = Webhooks({
  webhookKey: getRequiredWebhookKey(),
  onPayload: async (payload: unknown) => {
    const p = payload as MyWebhookPayload
    log('🔔 Received webhook event:', p.type)

    if ('customer' in p.data && p.data.customer) await upsertCustomer(p.data.customer)
    if (isSubscriptionActive(p) || isSubscriptionCreated(p) || isSubscriptionCancelled(p)) await handleSubscription(p)
    if (isPaymentSucceeded(p)) await handleTransaction(p)
    if (isRefund(p)) await handleRefund(p)
    if (isDispute(p)) await handleDispute(p)
  }
})
