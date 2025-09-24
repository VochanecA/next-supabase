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
//   DodoDisputeData,
// } from '@/types/dodo-webhook'
// import { createClient } from '@/lib/supabase/server'
// import { getRequiredWebhookKey } from '@/lib/env'

// // --- Logger ---
// const log = (...args: unknown[]): void => {
//   if (process.env.NODE_ENV === 'development') console.log(...args)
// }

// // --- Type Predicates ---
// const isPaymentSucceeded = (
//   payload: MyWebhookPayload
// ): payload is DodoWebhookPayload<DodoPaymentSucceededData> & { type: 'payment.succeeded' } =>
//   payload.type === 'payment.succeeded'

// const isSubscriptionActive = (
//   payload: MyWebhookPayload
// ): payload is DodoWebhookPayload<DodoSubscriptionActiveData> & { type: 'subscription.active' } =>
//   payload.type === 'subscription.active'

// const isSubscriptionCreated = (
//   payload: MyWebhookPayload
// ): payload is DodoWebhookPayload<DodoSubscriptionCreatedData> & { type: 'subscription.created' } =>
//   payload.type === 'subscription.created'

// const isSubscriptionCancelled = (
//   payload: MyWebhookPayload
// ): payload is DodoWebhookPayload<DodoSubscriptionCancelledData> & { type: 'subscription.cancelled' } =>
//   payload.type === 'subscription.cancelled'

// const isRefund = (
//   payload: MyWebhookPayload
// ): payload is DodoWebhookPayload<DodoRefundData> & { type: 'payment.refund' } =>
//   payload.type === 'payment.refund'

// const isDispute = (
//   payload: MyWebhookPayload
// ): payload is DodoWebhookPayload<DodoDisputeData> & { type: 'payment.dispute' } =>
//   payload.type === 'payment.dispute'

// // --- Supabase Helpers ---
// const upsertCustomer = async (customer: { customer_id: string; email: string; name?: string }) => {
//   const supabase = await createClient()
//   try {
//     const { error } = await supabase
//       .from('customers')
//       .upsert(
//         {
//           customer_id: customer.customer_id,
//           email: customer.email,
//           name: customer.name ?? null,
//           updated_at: new Date().toISOString(),
//         },
//         { onConflict: 'customer_id' } // <-- single string here
//       )
//     if (error) throw error
//     log('✅ Processed customer:', customer.customer_id)
//   } catch (err) {
//     log('❌ Failed to upsert customer:', customer.customer_id, err)
//   }
// }

// const ensureProductExists = async (product_id: string) => {
//   const supabase = await createClient()
//   try {
//     const { error } = await supabase
//       .from('products')
//       .upsert(
//         {
//           product_id,
//           name: product_id, // fallback name
//           created_at: new Date().toISOString(),
//           updated_at: new Date().toISOString(),
//         },
//         { onConflict: 'product_id' }
//       )
//     if (error) throw error
//     log('✅ Ensured product exists:', product_id)
//   } catch (err) {
//     log('❌ Failed to ensure product exists:', product_id, err)
//   }
// }

// const upsertSubscription = async (
//   payload: DodoWebhookPayload<
//     DodoSubscriptionActiveData | DodoSubscriptionCreatedData | DodoSubscriptionCancelledData
//   >
// ) => {
//   const data = payload.data
//   const supabase = await createClient()

//   try {
//     log('➡ Starting upsertSubscription for', data.subscription_id)

//     // Ensure product exists first
//     if (data.product_id) {
//       log('🔹 Ensuring product exists:', data.product_id)
//       await ensureProductExists(data.product_id)
//     }

//     // Ensure customer exists first
//     await upsertCustomer(data.customer)

//     // Upsert subscription
//     const { error } = await supabase
//       .from('subscriptions')
//       .upsert(
//         {
//           subscription_id: data.subscription_id,
//           customer_id: data.customer.customer_id,
//           product_id: data.product_id ?? null,
//           subscription_status: data.status,
//           quantity: data.quantity ?? 1,
//           currency: data.currency ?? null,
//           start_date: data.start_date ?? new Date().toISOString(),
//           next_billing_date: data.next_billing_date ?? null,
//           trial_end_date:
//             'trial_period_days' in data && data.trial_period_days
//               ? new Date(Date.now() + data.trial_period_days * 24 * 60 * 60 * 1000).toISOString()
//               : null,
//           metadata: 'metadata' in data ? data.metadata : {},
//           created_at: data.created_at ?? new Date().toISOString(),
//           updated_at: new Date().toISOString(),
//         },
//         { onConflict: 'subscription_id' }
//       )

//     if (error) throw error
//     log(`✅ Upserted subscription: ${data.subscription_id} → ${data.status}`)
//   } catch (err) {
//     log(`❌ Failed to upsert subscription: ${data.subscription_id}`, err)
//     log('Payload:', payload)
//   }
// }

// const upsertTransaction = async (payload: DodoWebhookPayload<DodoPaymentSucceededData>) => {
//   const data = payload.data
//   const supabase = await createClient()

//   try {
//     log('➡ Starting upsertTransaction for', data.payment_id)

//     // 1️⃣ Ensure customer exists first
//     await upsertCustomer(data.customer)

//     // 2️⃣ Ensure subscription exists minimally (to satisfy FK)
//     if (data.subscription_id) {
//       log('🔹 Ensuring subscription exists for FK:', data.subscription_id)
//       await supabase.from('subscriptions').upsert({
//         subscription_id: data.subscription_id,
//         customer_id: data.customer.customer_id,
//         subscription_status: 'active', // default if unknown
//         created_at: new Date().toISOString(),
//         updated_at: new Date().toISOString(),
//         metadata: {}
//       }, { onConflict: 'subscription_id' })
//     }

//     // 3️⃣ Map webhook data to transactions table
//     const transactionRow = {
//       transaction_id: data.payment_id,
//       subscription_id: data.subscription_id ?? null,
//       customer_id: data.customer.customer_id,
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
//       updated_at: new Date().toISOString(),
//     }

//     log('🔹 Upserting transaction row:', transactionRow)

//     const { error } = await supabase
//       .from('transactions')
//       .upsert(transactionRow, { onConflict: 'transaction_id' })

//     if (error) throw error
//     log('✅ Upserted transaction:', data.payment_id)
//   } catch (err) {
//     log('❌ Failed to upsert transaction:', data.payment_id, err)
//     log('Payload:', payload)
//   }
// }



// const upsertRefund = async (payload: DodoWebhookPayload<DodoRefundData>) => {
//   const data = payload.data
//   const supabase = await createClient()
//   try {
//     const { error } = await supabase
//       .from('refunds')
//       .upsert(
//         {
//           refund_id: data.refund_id,
//           transaction_id: data.payment_id,
//           customer_id: data.customer.customer_id,
//           amount: data.amount,
//           currency: data.currency ?? null,
//           is_partial: data.is_partial ?? false,
//           reason: data.reason ?? null,
//           status: data.status ?? null,
//           created_at: data.created_at ?? new Date().toISOString(),
//         },
//         { onConflict: 'refund_id' }
//       )
//     if (error) throw error
//     log(`✅ Processed refund: ${data.refund_id} → ${data.status}`)
//   } catch (err) {
//     log(`❌ Failed to upsert refund: ${data.refund_id}`, err)
//     log('Payload:', payload)
//   }
// }

// const upsertDispute = async (payload: DodoWebhookPayload<DodoDisputeData>) => {
//   const data = payload.data
//   const supabase = await createClient()
//   try {
//     const { error } = await supabase
//       .from('disputes')
//       .upsert(
//         {
//           dispute_id: data.dispute_id,
//           transaction_id: data.payment_id,
//           amount: data.amount ?? null,
//           currency: data.currency ?? null,
//           dispute_stage: data.dispute_stage ?? null,
//           dispute_status: data.dispute_status ?? null,
//           remarks: data.remarks ?? null,
//           created_at: data.created_at ?? new Date().toISOString(),
//         },
//         { onConflict: 'dispute_id' }
//       )
//     if (error) throw error
//     log(`✅ Processed dispute: ${data.dispute_id} → ${data.dispute_status}`)
//   } catch (err) {
//     log(`❌ Failed to upsert dispute: ${data.dispute_id}`, err)
//     log('Payload:', payload)
//   }
// }

// // --- Webhook Handler ---
// export const POST = Webhooks({
//   webhookKey: getRequiredWebhookKey(),

//   onPayload: async (payload: unknown) => {
//     const p = payload as MyWebhookPayload
//     log('🔔 Received webhook event:', p.type)

//     // 1️⃣ Upsert customer first
//     if ('customer' in p.data && p.data.customer) {
//       await upsertCustomer(p.data.customer)
//     }

//     // 2️⃣ Upsert subscription (active/created/cancelled)
//     if (isSubscriptionActive(p) || isSubscriptionCreated(p) || isSubscriptionCancelled(p)) {
//       await upsertSubscription(p)
//     }

//     // 3️⃣ Upsert transaction (payment.succeeded)
//     if (isPaymentSucceeded(p)) {
//       await upsertTransaction(p)
//     }

//     // 4️⃣ Refund / Dispute
//     if (isRefund(p)) await upsertRefund(p)
//     if (isDispute(p)) await upsertDispute(p)
//   },
// })

'use server'

import { NextResponse } from 'next/server'
import crypto from 'crypto'
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
import { createServiceClient } from '@/lib/supabase/service-client'

// --- Logger ---
const log = (...args: unknown[]) => process.env.NODE_ENV === 'development' && console.log(...args)

// --- Webhook Signature Verification ---
const verifyWebhookSignature = (
  rawBody: string,
  signature: string,
  timestamp: string,
  webhookId: string,
  secret: string
): boolean => {
  try {
    // Extract the signature part (remove "v1," prefix if present)
    const sig = signature.startsWith('v1,') ? signature.slice(3) : signature
    
    // Create the signed payload: webhookId.timestamp.rawBody
    const signedPayload = `${webhookId}.${timestamp}.${rawBody}`
    
    // Generate expected signature using HMAC-SHA256
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(signedPayload, 'utf8')
      .digest('base64')
    
    // Compare signatures using timingSafeEqual to prevent timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(sig, 'base64'),
      Buffer.from(expectedSignature, 'base64')
    )
  } catch (error) {
    log('❌ Signature verification error:', error)
    return false
  }
}

// --- Type Predicates ---
const isPaymentSucceeded = (payload: MyWebhookPayload): payload is DodoWebhookPayload<DodoPaymentSucceededData> & { type: 'payment.succeeded' } =>
  payload.type === 'payment.succeeded'

const isSubscriptionActive = (payload: MyWebhookPayload): payload is DodoWebhookPayload<DodoSubscriptionActiveData> & { type: 'subscription.active' } =>
  payload.type === 'subscription.active'

const isSubscriptionCreated = (payload: MyWebhookPayload): payload is DodoWebhookPayload<DodoSubscriptionCreatedData> & { type: 'subscription.created' } =>
  payload.type === 'subscription.created'

const isSubscriptionCancelled = (payload: MyWebhookPayload): payload is DodoWebhookPayload<DodoSubscriptionCancelledData> & { type: 'subscription.cancelled' } =>
  payload.type === 'subscription.cancelled'

const isRefund = (payload: MyWebhookPayload): payload is DodoWebhookPayload<DodoRefundData> & { type: 'payment.refund' } =>
  payload.type === 'payment.refund'

const isDispute = (payload: MyWebhookPayload): payload is DodoWebhookPayload<DodoDisputeData> & { type: 'payment.dispute' } =>
  payload.type === 'payment.dispute'

// --- Supabase Helpers ---
const upsertCustomer = async (customer: { customer_id: string; email: string; name?: string }) => {
  const supabase = createServiceClient()
  try {
    const { error } = await supabase
      .from('customers')
      .upsert({
        customer_id: customer.customer_id,
        email: customer.email,
        name: customer.name ?? null,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'customer_id' })
    if (error) throw error
    log('✅ Processed customer:', customer.customer_id)
  } catch (err) {
    log('❌ Failed to upsert customer:', customer.customer_id, err)
  }
}

const ensureProductExists = async (product_id: string) => {
  const supabase = createServiceClient()
  try {
    const { error } = await supabase
      .from('products')
      .upsert({
        product_id,
        name: product_id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, { onConflict: 'product_id' })
    if (error) throw error
    log('✅ Ensured product exists:', product_id)
  } catch (err) {
    log('❌ Failed to ensure product exists:', product_id, err)
  }
}

const upsertSubscription = async (payload: DodoWebhookPayload<DodoSubscriptionActiveData | DodoSubscriptionCreatedData | DodoSubscriptionCancelledData>) => {
  const data = payload.data
  const supabase = createServiceClient()
  try {
    log('➡ Starting upsertSubscription for', data.subscription_id)
    if (data.product_id) await ensureProductExists(data.product_id)
    await upsertCustomer(data.customer)

    const { error } = await supabase
      .from('subscriptions')
      .upsert({
        subscription_id: data.subscription_id,
        customer_id: data.customer.customer_id,
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
        updated_at: new Date().toISOString(),
      }, { onConflict: 'subscription_id' })
    if (error) throw error
    log(`✅ Upserted subscription: ${data.subscription_id} → ${data.status}`)
  } catch (err) {
    log(`❌ Failed to upsert subscription: ${data.subscription_id}`, err)
  }
}

const upsertTransaction = async (payload: DodoWebhookPayload<DodoPaymentSucceededData>) => {
  const data = payload.data
  const supabase = createServiceClient()
  try {
    log('➡ Starting upsertTransaction for', data.payment_id)
    await upsertCustomer(data.customer)

    if (data.subscription_id) {
      await supabase.from('subscriptions').upsert({
        subscription_id: data.subscription_id,
        customer_id: data.customer.customer_id,
        subscription_status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        metadata: {},
      }, { onConflict: 'subscription_id' })
    }

    const { error } = await supabase
      .from('transactions')
      .upsert({
        transaction_id: data.payment_id,
        subscription_id: data.subscription_id ?? null,
        customer_id: data.customer.customer_id,
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
        updated_at: new Date().toISOString(),
      }, { onConflict: 'transaction_id' })
    if (error) throw error
    log('✅ Upserted transaction:', data.payment_id)
  } catch (err) {
    log('❌ Failed to upsert transaction:', data.payment_id, err)
  }
}

const upsertRefund = async (payload: DodoWebhookPayload<DodoRefundData>) => {
  const data = payload.data
  const supabase = createServiceClient()
  try {
    const { error } = await supabase
      .from('refunds')
      .upsert({
        refund_id: data.refund_id,
        transaction_id: data.payment_id,
        customer_id: data.customer.customer_id,
        amount: data.amount,
        currency: data.currency ?? null,
        is_partial: data.is_partial ?? false,
        reason: data.reason ?? null,
        status: data.status ?? null,
        created_at: data.created_at ?? new Date().toISOString(),
      }, { onConflict: 'refund_id' })
    if (error) throw error
    log(`✅ Processed refund: ${data.refund_id} → ${data.status}`)
  } catch (err) {
    log(`❌ Failed to upsert refund: ${data.refund_id}`, err)
  }
}

const upsertDispute = async (payload: DodoWebhookPayload<DodoDisputeData>) => {
  const data = payload.data
  const supabase = createServiceClient()
  try {
    const { error } = await supabase
      .from('disputes')
      .upsert({
        dispute_id: data.dispute_id,
        transaction_id: data.payment_id,
        amount: data.amount ?? null,
        currency: data.currency ?? null,
        dispute_stage: data.dispute_stage ?? null,
        dispute_status: data.dispute_status ?? null,
        remarks: data.remarks ?? null,
        created_at: data.created_at ?? new Date().toISOString(),
      }, { onConflict: 'dispute_id' })
    if (error) throw error
    log(`✅ Processed dispute: ${data.dispute_id} → ${data.dispute_status}`)
  } catch (err) {
    log(`❌ Failed to upsert dispute: ${data.dispute_id}`, err)
  }
}

// --- POST Route Handler ---
export async function POST(req: Request) {
  try {
    // Get the raw body for signature verification
    const rawBody = await req.text()
    
    // Get webhook headers
    const signature = req.headers.get('webhook-signature')
    const timestamp = req.headers.get('webhook-timestamp')
    const webhookId = req.headers.get('webhook-id')
    
    if (!signature || !timestamp || !webhookId) {
      log('❌ Missing required webhook headers')
      return NextResponse.json({ error: 'Missing webhook headers' }, { status: 400 })
    }

    // Verify webhook signature
    const webhookSecret = process.env.DODO_WEBHOOK_SECRET
    if (!webhookSecret) {
      log('❌ Missing DODO_WEBHOOK_SECRET environment variable')
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    const isValid = verifyWebhookSignature(rawBody, signature, timestamp, webhookId, webhookSecret)
    if (!isValid) {
      log('❌ Invalid webhook signature')
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 403 })
    }

    // Parse the JSON payload
    const payload = JSON.parse(rawBody) as MyWebhookPayload

    log('🔔 Received webhook event:', payload.type)

    // Process webhook
    if ('customer' in payload.data && payload.data.customer) await upsertCustomer(payload.data.customer)
    if (isSubscriptionActive(payload) || isSubscriptionCreated(payload) || isSubscriptionCancelled(payload)) await upsertSubscription(payload)
    if (isPaymentSucceeded(payload)) await upsertTransaction(payload)
    if (isRefund(payload)) await upsertRefund(payload)
    if (isDispute(payload)) await upsertDispute(payload)

    return NextResponse.json({ status: 'ok' })
  } catch (err) {
    log('❌ Webhook handler error:', err)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}