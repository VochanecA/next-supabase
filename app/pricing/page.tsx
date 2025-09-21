'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Check } from 'lucide-react';
import { useState } from 'react';
import { plans as importedPlans } from '@/lib/pricing-plans';
import Link from 'next/link';

interface Plan {
  title: string;
  price: string;
  priceId: string;
  description: string;
  features: readonly string[];
  popular?: boolean;
}

// PricingCard is intentionally local
function PricingCard({ plan }: { readonly plan: Plan }) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleCheckout = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_cart: [{ product_id: plan.priceId, quantity: 1 }],
        }),
      });

      const data = await res.json();

      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      } else if (data.error) {
        setError(data.error);
      } else {
        setError('Unknown error creating checkout session');
      }
    } catch (err: unknown) {
      setError((err as Error)?.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <article
      className={`relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border transition-all ${
        plan.popular
          ? 'border-orange-300 dark:border-orange-600 ring-2 ring-orange-500/20'
          : 'border-gray-200 dark:border-gray-700'
      }`}
      aria-labelledby={`${plan.title}-heading`}
    >
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-orange-500 text-white text-xs font-semibold px-4 py-1 rounded-full">
            Most Popular
          </span>
        </div>
      )}

      <div className="text-center mb-8">
        <h3
          id={`${plan.title}-heading`}
          className="text-2xl font-bold text-gray-900 dark:text-white mb-2"
        >
          {plan.title}
        </h3>
        <div className="flex items-baseline justify-center mb-2">
          <span className="text-4xl font-bold text-gray-900 dark:text-white">
            {plan.price}
          </span>
          {plan.price !== 'Custom' && (
            <span className="text-gray-600 dark:text-gray-400 ml-1">/month</span>
          )}
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-sm">{plan.description}</p>
      </div>

      <ul className="mb-8 space-y-3">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-center">
            <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" aria-hidden="true" />
            <span className="text-gray-700 dark:text-gray-300 text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      <button
        onClick={handleCheckout}
        disabled={loading}
        className={`block w-full text-center py-3 px-6 rounded-lg font-semibold transition-colors ${
          plan.popular
            ? 'bg-orange-500 hover:bg-orange-600 text-white'
            : plan.price === '€0'
            ? 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
        aria-busy={loading}
      >
        {loading ? 'Redirecting...' : plan.price === '€0' ? 'Get Started Free' : 'Get Started'}
      </button>
    </article>
  );
}

// --- Pricing Page ---
export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header />

      <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-12">
        {/* Page Heading */}
        <section className="text-center mb-16" aria-labelledby="pricing-heading">
          <h1
            id="pricing-heading"
            className="text-4xl font-bold mb-4"
          >
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Choose the plan that works best for you. All plans include access to our core AI features.
          </p>
        </section>

        {/* Pricing Cards */}
        <section className="grid md:grid-cols-3 gap-8 mb-16" aria-label="Pricing plans">
          {importedPlans.map((plan) => (
            <PricingCard key={`${plan.title}-${plan.priceId}`} plan={plan} />
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
}