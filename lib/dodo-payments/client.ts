// lib/dodo-payments/client.ts
import { DODO_PAYMENTS_API_KEY, DODO_PAYMENTS_ENVIRONMENT } from "@/lib/env";


const DODO_API_BASE =
  DODO_PAYMENTS_ENVIRONMENT === "live_mode"
    ? "https://live.dodopayments.com"
    : "https://test.dodopayments.com";


export interface UpdateSubscriptionPayload {
  cancel_at_next_billing_date?: boolean;
}

export const dodoClient = {
  async updateSubscription(
    subscriptionId: string,
    payload: UpdateSubscriptionPayload
  ) {
    const res = await fetch(`${DODO_API_BASE}/subscriptions/${subscriptionId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${DODO_PAYMENTS_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorBody = await res.text();
      throw new Error(`Dodo API error (${res.status}): ${errorBody || res.statusText}`);
    }

    return (await res.json()) as { id: string; [key: string]: unknown };
  },

  async changePlan(
    subscriptionId: string,
    payload: { product_id: string; proration_billing_mode: string; quantity: number }
  ) {
    const res = await fetch(`${DODO_API_BASE}/subscriptions/${subscriptionId}/change_plan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${DODO_PAYMENTS_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorBody = await res.text();
      throw new Error(`Dodo API error (${res.status}): ${errorBody || res.statusText}`);
    }

    return (await res.json()) as { id: string; [key: string]: unknown };
  },
};
