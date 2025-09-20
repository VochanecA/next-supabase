'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Check } from 'lucide-react'
import { useState } from 'react'
import { plans as importedPlans } from '@/lib/pricing-plans'

interface Plan {
  title: string
  price: string
  priceId: string
  description: string
  features: readonly string[]
  popular?: boolean
}

interface PricingCardProps {
  plan: Plan
}

export function PricingCard({ plan }: PricingCardProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCheckout = async () => {
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_cart: [{ product_id: plan.priceId, quantity: 1 }],
        }),
      })

      const data = await res.json()

      if (data.checkout_url) {
        window.location.href = data.checkout_url
      } else if (data.error) {
        setError(data.error)
      } else {
        setError('Unknown error creating checkout session')
      }
    } catch (err: unknown) {
      setError((err as Error)?.message || 'Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className={`relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border ${
        plan.popular
          ? 'border-orange-300 dark:border-orange-600 ring-2 ring-orange-500/20'
          : 'border-gray-200 dark:border-gray-700'
      }`}
    >
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-orange-500 text-white text-xs font-semibold px-4 py-1 rounded-full">
            Most Popular
          </span>
        </div>
      )}

      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{plan.title}</h3>
        <div className="flex items-baseline justify-center mb-2">
          <span className="text-4xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
          {plan.price !== 'Custom' && <span className="text-gray-600 dark:text-gray-400 ml-1">/month</span>}
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-sm">{plan.description}</p>
      </div>

      <div className="mb-8">
        <ul className="space-y-3">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
              <span className="text-gray-700 dark:text-gray-300 text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

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
      >
        {loading ? 'Redirecting...' : plan.price === '€0' ? 'Get Started Free' : 'Get Started'}
      </button>
    </div>
  )
}

// --- Pricing Page ---

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header />

      <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Choose the plan that works best for you. All plans include access to our core AI features.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {importedPlans.map((plan) => (
            <PricingCard key={`${plan.title}-${plan.priceId}`} plan={plan} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  )
}
