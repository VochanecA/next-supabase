'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Check, LogIn, RefreshCw, Tag } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { ReactElement } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface Product {
  product_id: string;
  name: string;
  price: number;
  currency: string;
  description?: string;
  pricing_type?: string;
  archived?: boolean;
}

interface Plan {
  title: string;
  price: string;
  priceId: string;
  description: string;
  features: readonly string[];
  popular?: boolean;
  onSale?: boolean; // New property for sale items
}

// PricingCard Component
function PricingCard({ plan, isAuthenticated, cardWidth }: { 
  readonly plan: Plan; 
  isAuthenticated: boolean;
  cardWidth: string;
}): ReactElement {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const router = useRouter();

  const handleCheckout = async () => {
    // Redirect to login if not authenticated (except for free plan)
    if (!isAuthenticated && plan.price !== '€0') {
      router.push('/login');
      return;
    }

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

  const getButtonText = () => {
    if (loading) return 'Redirecting...';
    if (!isAuthenticated && plan.price !== '€0') return 'Log In to Purchase';
    if (plan.price === '€0') return 'Get Started Free';
    return 'Get Started';
  };

  return (
    <div className={cardWidth}>
      <article
        className={`h-full bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border transition-all relative overflow-hidden ${
          plan.popular
            ? 'border-orange-300 dark:border-orange-600 ring-2 ring-orange-500/20'
            : 'border-gray-200 dark:border-gray-700'
        }`}
        aria-labelledby={`${plan.title}-heading`}
      >
        {/* Product ID Badge */}
        <div className="absolute top-4 right-4">
          <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-mono px-2 py-1 rounded-md border border-gray-200 dark:border-gray-600">
            ID: {plan.priceId}
          </span>
        </div>

        {/* Angled SALE Pill */}
        {plan.onSale && (
          <div className="absolute -top-3 -left-8 transform rotate-[10deg]">
            <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-8 py-2 shadow-lg flex items-center gap-1">
              <Tag className="w-3 h-3" />
              SALE!
            </div>
          </div>
        )}

        {/* Popular Badge */}
        {plan.popular && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <span className="bg-orange-500 text-white text-xs font-semibold px-4 py-1 rounded-full shadow-lg">
              Most Popular
            </span>
          </div>
        )}

        <header className="text-center mb-8 pt-4">
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
            {plan.price !== 'Custom' && plan.price !== '€0' && (
              <span className="text-gray-600 dark:text-gray-400 ml-1">/month</span>
            )}
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-sm">{plan.description}</p>
        </header>

        <ul className="mb-8 space-y-3" aria-label={`${plan.title} features`}>
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-center">
              <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" aria-hidden="true" />
              <span className="text-gray-700 dark:text-gray-300 text-sm">{feature}</span>
            </li>
          ))}
        </ul>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        {!isAuthenticated && plan.price !== '€0' && (
          <p className="text-yellow-600 dark:text-yellow-400 text-sm mb-3 text-center">
            Please log in to purchase
          </p>
        )}

        <button
          onClick={handleCheckout}
          disabled={loading}
          className={`flex items-center justify-center w-full text-center py-3 px-6 rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            plan.onSale
              ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white focus:ring-red-500/50'
              : plan.popular
              ? 'bg-orange-500 hover:bg-orange-600 text-white focus:ring-orange-500/50 focus:ring-offset-gray-50 dark:focus:ring-offset-gray-900'
              : plan.price === '€0'
              ? 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white focus:ring-blue-500/50 focus:ring-offset-gray-50 dark:focus:ring-offset-gray-900'
              : 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500/50 focus:ring-offset-gray-50 dark:focus:ring-offset-gray-900'
          } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          aria-busy={loading}
        >
          {!isAuthenticated && plan.price !== '€0' && <LogIn className="w-4 h-4 mr-2" />}
          {getButtonText()}
        </button>
      </article>
    </div>
  );
}

// Transform Dodo Payments products to Plan format
function transformProductsToPlans(products: Product[]): Plan[] {
  return products.map((product, index) => {
    // Determine if product is on sale (you can customize this logic)
    const isOnSale = product.price < 20; // Example: products under €20 are on sale
    const isPopular = index === 1; // Make the second product popular
    
    return {
      title: product.name,
      price: `€${product.price}`,
      priceId: product.product_id,
      description: product.description || `${product.name} subscription`,
      features: [
        'Access to all AI features',
        'Priority support',
        'Regular updates',
        ...(product.pricing_type ? [`${product.pricing_type} billing`] : []),
      ],
      popular: isPopular,
      onSale: isOnSale,
    };
  });
}

// Get responsive grid classes based on product count
function getGridClasses(productCount: number): string {
  switch (productCount) {
    case 1:
      return 'flex justify-center';
    case 2:
      return 'grid md:grid-cols-2 gap-8';
    case 3:
      return 'grid md:grid-cols-3 gap-8';
    case 4:
      return 'grid md:grid-cols-2 lg:grid-cols-4 gap-8';
    case 5:
    case 6:
      return 'grid md:grid-cols-2 lg:grid-cols-3 gap-8';
    default:
      return 'grid md:grid-cols-2 lg:grid-cols-3 gap-8';
  }
}

// Get individual card width based on product count
function getCardWidth(productCount: number): string {
  switch (productCount) {
    case 1:
      return 'w-full max-w-2xl';
    case 2:
      return 'w-full';
    case 3:
      return 'w-full';
    case 4:
      return 'w-full';
    default:
      return 'w-full';
  }
}

// --- Pricing Page ---
export default function PricingPage(): ReactElement {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [productsLoading, setProductsLoading] = useState<boolean>(true);
  const [productsError, setProductsError] = useState<string>('');
  const router = useRouter();

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Fetch products from Dodo Payments
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setProductsLoading(true);
        setProductsError('');
        
        const response = await fetch('/api/products');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.products && Array.isArray(data.products)) {
          const transformedPlans = transformProductsToPlans(data.products);
          setPlans(transformedPlans);
        } else {
          throw new Error('Invalid products data format');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setProductsError('Failed to load pricing plans');
        setPlans([]);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const gridClasses = getGridClasses(plans.length);
  const cardWidth = getCardWidth(plans.length);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header />

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12">
        {/* Page Heading */}
        <section className="text-center mb-16" aria-labelledby="pricing-heading">
          <h1 id="pricing-heading" className="text-4xl font-bold mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Choose the plan that works best for you. All plans include access to our core AI features.
            {!isAuthenticated && (
              <span className="block mt-2 text-yellow-600 dark:text-yellow-400 font-medium">
                Please log in to purchase any paid plan
              </span>
            )}
          </p>
        </section>

        {/* Products Loading State */}
        {productsLoading && (
          <div className="text-center mb-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading pricing plans...</p>
          </div>
        )}

        {/* Products Error State */}
        {productsError && (
          <div className="text-center mb-16 p-6 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <p className="text-red-600 dark:text-red-400 mb-4">{productsError}</p>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center justify-center mx-auto bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </button>
          </div>
        )}

        {/* Pricing Cards Grid */}
        {!productsLoading && !productsError && (
          <section className={`${gridClasses} mb-16`} aria-label="Pricing plans">
            {plans.length > 0 ? (
              plans.map((plan) => (
                <PricingCard 
                  key={`${plan.title}-${plan.priceId}`} 
                  plan={plan} 
                  isAuthenticated={isAuthenticated}
                  cardWidth={cardWidth}
                />
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  No pricing plans available at the moment.
                </p>
              </div>
            )}
          </section>
        )}

        {/* Authentication Notice */}
        {!isAuthenticated && !productsLoading && plans.length > 0 && (
          <section className="text-center p-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <h2 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
              Authentication Required
            </h2>
            <p className="text-yellow-700 dark:text-yellow-300">
              You need to be logged in to purchase any paid plan.
            </p>
            <button
              onClick={() => router.push('/auth/login')}
              className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              Go to Login
            </button>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}