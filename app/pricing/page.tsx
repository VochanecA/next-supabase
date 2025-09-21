"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Check } from "lucide-react";
import { plans as importedPlans } from "@/lib/pricing-plans";

interface Plan {
  readonly title: string;
  readonly price: string;
  readonly priceId: string;
  readonly description: string;
  readonly features: readonly string[];
  readonly popular?: boolean;
}

// PricingCard is intentionally kept local (not exported)
function PricingCard({ plan }: { readonly plan: Plan }): JSX.Element {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleCheckout = async (): Promise<void> => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_cart: [{ product_id: plan.priceId, quantity: 1 }],
        }),
      });

      const data: { checkout_url?: string; error?: string } = await res.json();

      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      } else if (data.error) {
        setError(data.error);
      } else {
        setError("Unknown error creating checkout session");
      }
    } catch (err: unknown) {
      setError((err as Error)?.message ?? "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border ${
        plan.popular
          ? "border-orange-300 dark:border-orange-600 ring-2 ring-orange-500/20"
          : "border-gray-200 dark:border-gray-700"
      }`}
    >
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 transform">
          <span className="bg-orange-500 text-white text-xs font-semibold px-4 py-1 rounded-full">
            Most Popular
          </span>
        </div>
      )}

      <div className="mb-8 text-center">
        <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
          {plan.title}
        </h3>
        <div className="mb-2 flex items-baseline justify-center">
          <span className="text-4xl font-bold text-gray-900 dark:text-white">
            {plan.price}
          </span>
          {plan.price !== "Custom" && (
            <span className="ml-1 text-gray-600 dark:text-gray-400">
              /month
            </span>
          )}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {plan.description}
        </p>
      </div>

      <div className="mb-8">
        <ul className="space-y-3">
          {plan.features.map((feature) => (
            <li key={`${plan.priceId}-${feature}`} className="flex items-center">
              <Check className="mr-3 h-5 w-5 flex-shrink-0 text-green-500" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {error && <p className="mb-2 text-sm text-red-500">{error}</p>}

      <button
        type="button"
        onClick={handleCheckout}
        disabled={loading}
        aria-label={`Select ${plan.title} plan`}
        className={`block w-full rounded-lg py-3 px-6 font-semibold transition-colors ${
          plan.popular
            ? "bg-orange-500 text-white hover:bg-orange-600"
            : plan.price === "€0"
            ? "bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
            : "bg-blue-600 text-white hover:bg-blue-700"
        } ${loading ? "cursor-not-allowed opacity-70" : ""}`}
      >
        {loading
          ? "Redirecting..."
          : plan.price === "€0"
          ? "Get Started Free"
          : "Get Started"}
      </button>
    </div>
  );
}

export default function PricingPage(): JSX.Element {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <Header />

      <main
        className="flex-1 w-full max-w-6xl mx-auto px-6 py-12"
        aria-labelledby="pricing-heading"
      >
        <div className="mb-16 text-center">
          <h1
            id="pricing-heading"
            className="mb-4 text-4xl font-bold tracking-tight"
          >
            Simple, Transparent Pricing
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
            Choose the plan that works best for you. All plans include access to
            our core AI features.
          </p>
        </div>

        <section
          aria-label="Pricing Plans"
          className="mb-16 grid gap-8 md:grid-cols-3"
        >
          {importedPlans.map((plan) => (
            <PricingCard key={`${plan.title}-${plan.priceId}`} plan={plan} />
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
}