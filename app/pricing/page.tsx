import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Check } from "lucide-react";
import Link from "next/link";

interface Plan {
  title: string;
  price: string;
  priceId: string;
  description: string;
  features: string[];
  popular?: boolean;
}

const plans: Plan[] = [
  { 
    title: 'Hobby', 
    price: '€0', 
    priceId: 'pdt_a1EG4eSKFx8iPO1t53SPM', 
    description: 'Perfect for individuals getting started', 
    features: [
      '1,000 requests/month', 
      'Community support', 
      'Basic analytics', 
      '1GB storage'
    ] 
  },
  { 
    title: 'Pro', 
    price: '€15', 
    priceId: 'pdt_a1EG4eSKFx8iPO1t53SPM', 
    description: 'For growing businesses and teams', 
    features: [
      'Unlimited requests', 
      'Priority support', 
      'Advanced analytics', 
      '10GB storage', 
      'API access'
    ], 
    popular: true 
  },
  { 
    title: 'Enterprise', 
    price: 'Custom', 
    priceId: 'pdt_a1EG4eSKFx8iPO1t53SPM', 
    description: 'For large organizations with custom needs', 
    features: [
      'Everything in Pro', 
      'Custom integrations', 
      'Dedicated support', 
      'SLA guarantee', 
      'Unlimited storage'
    ] 
  },
];

function PricingCard({ plan }: { plan: Plan }) {
  return (
    <div className={`relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border ${
      plan.popular 
        ? 'border-orange-300 dark:border-orange-600 ring-2 ring-orange-500/20' 
        : 'border-gray-200 dark:border-gray-700'
    }`}>
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-orange-500 text-white text-xs font-semibold px-4 py-1 rounded-full">
            Most Popular
          </span>
        </div>
      )}
      
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
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
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          {plan.description}
        </p>
      </div>

      <div className="mb-8">
        <ul className="space-y-3">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
              <span className="text-gray-700 dark:text-gray-300 text-sm">
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <Link
        href={plan.price === '€0' ? "/auth/sign-up" : `/checkout?priceId=${plan.priceId}`}
        className={`block w-full text-center py-3 px-6 rounded-lg font-semibold transition-colors ${
          plan.popular
            ? 'bg-orange-500 hover:bg-orange-600 text-white'
            : plan.price === '€0'
            ? 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {plan.price === '€0' ? 'Get Started Free' : 'Get Started'}
      </Link>
    </div>
  );
}

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header />
      
      <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Choose the plan that works best for you. All plans include access to our core AI features.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <PricingCard key={index} plan={plan} />
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-3">Can I change plans anytime?</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Is there a free trial?</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                The Hobby plan is completely free forever. For paid plans, we offer a 14-day free trial.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-3">What payment methods do you accept?</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Can I cancel anytime?</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Yes, you can cancel your subscription at any time. No long-term contracts required.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h2 className="text-2xl font-bold mb-6">Still have questions?</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Our team is here to help you get the most out of AI Notify.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors"
            >
              Contact Sales
            </Link>
            <Link
              href="/docs"
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 font-semibold rounded-lg transition-colors"
            >
              View Documentation
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}