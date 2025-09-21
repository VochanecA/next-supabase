'use client';

import { Wallet } from 'lucide-react';
import { useState } from 'react';

interface CustomerWallet {
  wallet_id: string;
  balance: number;
  currency: string;
  created_at: string;
}

interface CustomerWalletResponse {
  wallets?: CustomerWallet[];
  error?: string;
}

interface Props {
  customerId: string;
  className?: string;
}

export default function CustomerWalletButton({ customerId, className }: Props) {
  const [loading, setLoading] = useState(false);
  const [showWallets, setShowWallets] = useState(false);
  const [wallets, setWallets] = useState<CustomerWallet[]>([]);

  const handleClick = async (): Promise<void> => {
    if (!customerId) {
      alert('Customer ID is required');
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch(`/api/customer-wallets?customer_id=${encodeURIComponent(customerId)}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch wallets: ${response.status} ${errorText}`);
      }

      const data: CustomerWalletResponse = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setWallets(data.wallets || []);
      setShowWallets(true);
    } catch (error) {
      console.error('Customer wallet error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch customer wallets';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (amount: number, currency: string): string => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: currency.toUpperCase() 
    }).format(amount / 100);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading || !customerId}
        className={`flex items-center justify-center px-4 py-4 bg-green-600 dark:bg-green-700 text-white rounded-xl text-lg font-medium hover:bg-green-700 dark:hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm ${className ?? ''}`}
        aria-label="View customer wallet balances"
      >
        <Wallet className="w-5 h-5 mr-2" aria-hidden="true" />
        {loading ? 'Loading...' : 'View Wallets'}
      </button>

      {/* Wallet Modal/Popup */}
      {showWallets && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Customer Wallets</h3>
              <button 
                onClick={() => setShowWallets(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-3">
              {wallets && wallets.length > 0 ? (
                wallets.map((wallet) => (
                  <div key={wallet.wallet_id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{wallet.currency.toUpperCase()}</span>
                      <span className="text-lg font-bold text-green-600 dark:text-green-400">
                        {formatAmount(wallet.balance, wallet.currency)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      ID: {wallet.wallet_id}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 dark:text-gray-400 py-4">
                  No wallets found for this customer.
                </div>
              )}
            </div>
            
            <button
              onClick={() => setShowWallets(false)}
              className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}