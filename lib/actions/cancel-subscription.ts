// lib/actions/cancel-subscription.ts (alternative with response validation)
"use server";

import { dodoClient } from "@/lib/dodo-payments/client";
import { createClient } from "@/lib/supabase/server";

export type CancelOption = "next_billing" | "immediately";

interface CancelSubscriptionResult {
  success: boolean;
  error?: string;
}

export async function cancelSubscription(
  subscriptionId: string, 
  option?: CancelOption
): Promise<CancelSubscriptionResult> {
  const supabase = await createClient();

  if (!subscriptionId) {
    return {
      success: false,
      error: "Subscription ID is required",
    };
  }

  try {
    let dodoResponse;
    let supabaseUpdate: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (option === "immediately") {
      // Cancel immediately
      dodoResponse = await dodoClient.updateSubscription(subscriptionId, {
        cancel_at_next_billing_date: false,
      });

      // Validate Dodo response
      if (!dodoResponse?.id) {
        throw new Error("Invalid response from payment provider");
      }

      supabaseUpdate = {
        ...supabaseUpdate,
        cancel_at_next_billing_date: false,
        status: "canceled",
        canceled_at: new Date().toISOString(),
      };
    } else {
      // Default: cancel at next billing period
      dodoResponse = await dodoClient.updateSubscription(subscriptionId, {
        cancel_at_next_billing_date: true,
      });

      // Validate Dodo response
      if (!dodoResponse?.id) {
        throw new Error("Invalid response from payment provider");
      }

      supabaseUpdate = {
        ...supabaseUpdate,
        cancel_at_next_billing_date: true,
        status: "active", // Keep active until next billing
      };
    }

    // Update Supabase
    const { error } = await supabase
      .from("subscriptions")
      .update(supabaseUpdate)
      .eq("subscription_id", subscriptionId);

    if (error) {
      throw new Error(`Supabase update failed: ${error.message}`);
    }

    return { success: true };
  } catch (err) {
    console.error("Cancel subscription error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error occurred",
    };
  }
}