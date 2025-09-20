'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Check } from 'lucide-react'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

function SuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<string | null>(null)

  // Optional: get session_id or subscription_id from query params
  const sessionId = searchParams.get('session_id') || searchParams.get('subscription_id')

  useEffect(() => {
    async function verifyPayment() {
      if (!sessionId) {
        setMessage('🎉 Payment successful! You can now access your subscription.')
        setLoading(false)
        return
      }

      try {
        const res = await fetch(`/api/verify-payment?session_id=${sessionId}`)
        const data = await res.json()

        if (data.success) {
          setMessage('🎉 Payment successful! Your subscription is now active.')
        } else {
          setMessage('Payment processed, but we could not verify it. Please contact support.')
        }
      } catch {
        setMessage('Payment processed, but verification failed. Please contact support.')
      } finally {
        setLoading(false)
      }
    }

    verifyPayment()
  }, [sessionId])

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header />

      <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-12 text-center">
        <div
          className={`bg-white dark:bg-gray-800 rounded-2xl p-12 shadow-xl border border-gray-200 dark:border-gray-700`}
        >
          {loading ? (
            <p className="text-lg text-gray-600 dark:text-gray-300">Verifying payment...</p>
          ) : (
            <>
              <Check className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
              <p className="text-gray-700 dark:text-gray-300 mb-8">{message}</p>

              <button
                onClick={() => router.push('/dashboard')}
                className="block mx-auto px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors"
              >
                Go to Dashboard
              </button>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <Header />
        <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-12 text-center">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 shadow-xl border border-gray-200 dark:border-gray-700">
            <p className="text-lg text-gray-600 dark:text-gray-300">Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}