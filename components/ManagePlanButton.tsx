'use client';

import { ChevronRightIcon, Settings } from 'lucide-react';
import { useState } from 'react';

interface Subscription {
  subscription_id: string;
  subscription_status: string;
  product?: {
    product_id: string;
    name: string;
  } | null;
}

interface Product {
  product_id: string;
  name: string;
  price: number;
  currency: string;
}

interface ProductsResponse {
  products?: Product[];
  error?: string;
}

interface Props {
  subscriptions: Subscription[];
  className?: string;
}

export default function ManagePlanButton({ subscriptions, className }: Props) {
  const [loading, setLoading] = useState(false);
  const [showPlanManager, setShowPlanManager] = useState(false);
  const [availablePlans, setAvailablePlans] = useState<Product[]>([]);

  const activeSubscriptions = subscriptions.filter(sub => sub.subscription_status === 'active');

  const handleClick = async (): Promise<void> => {
    if (activeSubscriptions.length === 0) {
      alert('No active subscriptions to manage');
      return;
    }

    setLoading(true);
    
    try {
      // Fetch available products/plans from your database
      const response = await fetch('/api/products', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch plans: ${response.status}`);
      }

      const data: ProductsResponse = await response.json();
      setAvailablePlans(data.products || []);
      setShowPlanManager(true);
    } catch (error) {
      console.error('Plan management error:', error);
      // Removed unused errorMessage variable
      
      // Fallback to mock plans if API fails
      const mockPlans: Product[] = [
        { product_id: 'prod_basic', name: 'Basic Plan', price: 999, currency: 'usd' },
        { product_id: 'prod_premium', name: 'Premium Plan', price: 1999, currency: 'usd' },
        { product_id: 'prod_pro', name: 'Pro Plan', price: 2999, currency: 'usd' },
      ];
      setAvailablePlans(mockPlans);
      setShowPlanManager(true);
    } finally {
      setLoading(false);
    }
  };

const handlePlanChange = async (subscriptionId: string, newProductId: string): Promise<void> => {
  setLoading(true);
  
  try {
    const response = await fetch('/api/change-plan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        subscription_id: subscriptionId,
        product_id: newProductId,
        prorate: 'prorated_immediately',
      }),
    });
    
    const responseText = await response.text();
    
    if (!response.ok) {
      // Try to parse as JSON for structured error, fallback to text
      let errorMessage = responseText;
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.error || responseText;
      } catch {
        // Keep the text response if not JSON
      }
      
      throw new Error(`Failed to change plan: ${response.status} ${errorMessage}`);
    }

    const data = JSON.parse(responseText);
    alert(`Plan changed successfully! Status: ${data.status}`);
    
    // Refresh the page to show updated subscription info
    window.location.reload();
  } catch (error) {
    console.error('Plan change error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to change plan';
    
    // More user-friendly error messages
    if (errorMessage.includes('404')) {
      alert('Subscription not found. Please check if the subscription ID is correct and exists in the current environment.');
    } else if (errorMessage.includes('401') || errorMessage.includes('403')) {
      alert('Authentication error. Please check your API key configuration.');
    } else {
      alert(errorMessage);
    }
  } finally {
    setLoading(false);
  }
};
  // const formatAmount = (amount: number, currency: string): string => {
  //   return new Intl.NumberFormat('en-US', { 
  //     style: 'currency', 
  //     currency: currency.toUpperCase() 
  //   }).format(amount / 100);
  // };
const formatAmount = (amount: number, currency: string): string => {
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: currency.toUpperCase() 
  }).format(amount);
};

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading || activeSubscriptions.length === 0}
        className={`flex items-center justify-center px-4 py-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-xl text-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm ${className ?? ''}`}
        aria-label="Manage subscription plans"
      >
        <ChevronRightIcon className="w-5 h-5 mr-2" aria-hidden="true" />
        {loading ? 'Loading...' : 'Manage Plan'}
      </button>

      {/* Plan Management Modal */}
      {showPlanManager && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Manage Your Plans
              </h3>
              <button 
                onClick={() => setShowPlanManager(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-xl"
              >
                ✕
              </button>
            </div>
            
            {activeSubscriptions.map((subscription) => (
              <div key={subscription.subscription_id} className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h4 className="font-medium mb-3">
                  Current Plan: {subscription.product?.name || 'Unknown Plan'}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Subscription ID: {subscription.subscription_id}
                </p>
                
                <div className="space-y-2">
                  <h5 className="font-medium text-sm">Available Plans:</h5>
                  {availablePlans
                    .filter(plan => plan.product_id !== subscription.product?.product_id)
                    .map((plan) => (
                    <div key={plan.product_id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div>
                        <span className="font-medium">{plan.name}</span>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {formatAmount(plan.price, plan.currency)}
                        </div>
                      </div>
                      <button
                        onClick={() => handlePlanChange(subscription.subscription_id, plan.product_id)}
                        disabled={loading}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm"
                      >
                        Switch to This Plan
                      </button>
                    </div>
                  ))}
                  
                  {availablePlans.filter(plan => plan.product_id !== subscription.product?.product_id).length === 0 && (
                    <div className="text-center text-gray-500 dark:text-gray-400 py-4">
                      No other plans available for switching.
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowPlanManager(false)}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}