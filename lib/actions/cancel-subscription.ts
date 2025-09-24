"use server";

import { dodoClient } from "@/lib/dodo-payments/client";
import { createServiceClient } from "@/lib/supabase/service-client";

export type CancelOption = "next_billing" | "immediately";

interface CancelSubscriptionResult {
  success: boolean;
  error?: string;
}

interface DodoSubscription {
  subscription_id: string;
  status?: string;
  cancel_at_next_billing_date?: boolean;
  cancelled_at?: string | null;
  [key: string]: unknown;
}

type DodoUpdateResponse =
  | DodoSubscription
  | { subscription: DodoSubscription }
  | { data: DodoSubscription }
  | Record<string, unknown>;

function extractSubscriptionData(response: DodoUpdateResponse): DodoSubscription | null {
  if (!response) return null;
  if ("subscription_id" in response) return response as DodoSubscription;
  if ("subscription" in response) return (response as { subscription: DodoSubscription }).subscription;
  if ("data" in response) return (response as { data: DodoSubscription }).data;
  return null;
}

export async function cancelSubscription(
  subscriptionId: string,
  option: CancelOption = "next_billing"
): Promise<CancelSubscriptionResult> {
  if (!subscriptionId) {
    return { success: false, error: "Subscription ID is required" };
  }

  // Use service client (server-only) — must use SUPABASE_SERVICE_ROLE_KEY
  const supabase = createServiceClient();

  try {
    // Call Dodo API
    const dodoResponse: DodoUpdateResponse = await dodoClient.updateSubscription(subscriptionId, {
      cancel_at_next_billing_date: option !== "immediately",
    });

    console.log("Dodo response (raw):", JSON.stringify(dodoResponse, null, 2));

    const subscriptionData = extractSubscriptionData(dodoResponse);

    if (!subscriptionData?.subscription_id) {
      throw new Error(`Invalid response from payment provider: ${JSON.stringify(dodoResponse)}`);
    }

    const supabaseUpdate: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
      subscription_status: option === "immediately" ? "canceled" : "active",
      cancel_at_next_billing_date: option !== "immediately", // boolean
    };

    const { error } = await supabase
      .from("subscriptions")
      .update(supabaseUpdate)
      .eq("subscription_id", subscriptionData.subscription_id);

    if (error) {
      throw new Error(`Supabase update failed: ${error.message}`);
    }

    console.log(`Subscription ${subscriptionData.subscription_id} updated successfully in Supabase`);
    return { success: true };
  } catch (err: unknown) {
    console.error("Cancel subscription error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error occurred",
    };
  }
}
