// app/api/ai/chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { AIMessage } from "@/lib/ai";
import type { SupabaseClient } from "@supabase/supabase-js";

// --- Interfaces ---
interface ChatRequest {
  messages: AIMessage[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

interface ChatResponse {
  content: string;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
}

interface SubscriptionDebugInfo {
  userId: string;
  userEmail?: string;
  customerId?: string;
  subscriptionsFound: number;
  subscriptions?: Array<{
    subscription_id: string;
    subscription_status: string;
    created_at: string;
  }>;
}

// --- Check active subscription ---
async function hasActiveSubscription(
  userId: string,
  supabase: SupabaseClient
): Promise<boolean> {
  try {
    const getUserResponse = await supabase.auth.getUser();
    const user = getUserResponse.data.user;
    const userError = getUserResponse.error;

    if (userError || !user) return false;

    const { data: customer, error: customerError } = await supabase
      .from("customers")
      .select("customer_id")
      .eq("email", user.email)
      .single();

    if (customerError || !customer) return false;

    const { data: subscriptions, error: subscriptionsError } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("customer_id", customer.customer_id);

    if (subscriptionsError) return false;

    const activeSubscriptions =
      subscriptions?.filter(
        (
          sub
        ): sub is typeof sub & {
          subscription_status: "active" | "trialing";
        } =>
          sub.subscription_status === "active" ||
          sub.subscription_status === "trialing"
      ) ?? [];

    return activeSubscriptions.length > 0;
  } catch (err) {
    console.error("Subscription check failed:", err);
    return false;
  }
}

// --- POST Handler ---
export async function POST(
  req: NextRequest
): Promise<
  NextResponse<
    ChatResponse | { error: string; debug?: SubscriptionDebugInfo }
  >
> {
  try {
    const supabase = await createClient();

    // Auth check
    const getUserResponse = await supabase.auth.getUser();
    const user = getUserResponse.data.user;
    const authError = getUserResponse.error;

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // --- Subscription Check ---
    if (process.env.NODE_ENV !== "development") {
      const subscribed = await hasActiveSubscription(user.id, supabase);
      if (!subscribed) {
        try {
          const { data: { user: userData } } = await supabase.auth.getUser();

          const { data: customer } = await supabase
            .from("customers")
            .select("customer_id")
            .eq("email", userData?.email)
            .single();

          const { data: allSubscriptions } = await supabase
            .from("subscriptions")
            .select("subscription_id, subscription_status, created_at")
            .eq("customer_id", customer?.customer_id ?? "");

          const debugInfo: SubscriptionDebugInfo = {
            userId: user.id,
            userEmail: userData?.email,
            customerId: customer?.customer_id,
            subscriptionsFound: allSubscriptions?.length ?? 0,
            subscriptions: allSubscriptions ?? undefined,
          };

          return NextResponse.json(
            { error: "Subscription required", debug: debugInfo },
            { status: 403 }
          );
        } catch (debugError) {
          console.error("Debug info collection failed:", debugError);
          return NextResponse.json(
            { error: "Subscription required" },
            { status: 403 }
          );
        }
      }
    } else {
      console.log("⚠️ Dev mode: skipping subscription check");
    }

    // --- Parse body ---
    const body: ChatRequest = await req.json();
    const { messages, model, temperature, maxTokens } = body;

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: "No messages provided" },
        { status: 400 }
      );
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        {
          error: "Server is not configured with an OpenRouter API key.",
        },
        { status: 500 }
      );
    }

    // --- Call OpenRouter ---
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer":
            process.env.NEXT_PUBLIC_APP_URL ?? "https://yourapp.vercel.app",
          "X-Title": "AI Service",
        },
        body: JSON.stringify({
          model: model ?? "deepseek/deepseek-chat-v3.1:free",
          messages,
          max_tokens: maxTokens ?? 1000,
          temperature: temperature ?? 0.7,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();

      // ✅ Handle rate limit separately
      if (response.status === 429) {
        return NextResponse.json(
          {
            error:
              "Rate limit exceeded. Please wait a bit before trying again.",
          },
          { status: 429 }
        );
      }

      return NextResponse.json(
        { error: `OpenRouter API error: ${response.status} - ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      content: data.choices?.[0]?.message?.content ?? "No response generated",
      usage: data.usage ?? null,
    });
  } catch (error) {
    console.error("API /api/ai/chat error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
