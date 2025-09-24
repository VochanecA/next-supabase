"use client";

import React, { useState } from "react";
import { ProtectedAccount } from "./protected-account";
import {
  CreditCardIcon,
  MailIcon,
  KeyIcon,
  PlusIcon,
  DownloadIcon,
  HandIcon,
  ChevronRightIcon,
} from "lucide-react";
import CustomerPortalButton from "./CustomerPortalButton";
import { CancelSubscriptionButton } from "@/components/CancelSubscriptionButton";
import ManagePlanButton from "./ManagePlanButton";

interface Product {
  product_id: string;
  name: string;
  description?: string | null;
  price?: number | null;
  currency?: string | null;
}

export interface Subscription {
  subscription_id: string;
  subscription_status: string;
  quantity?: number | null;
  currency?: string | null;
  start_date?: string | null;
  next_billing_date?: string | null;
  trial_end_date?: string | null;
  product?: Product | null;
}

interface Transaction {
  transaction_id: string;
  status: string;
  amount?: number | null;
  currency?: string | null;
  billed_at?: string | null;
  payment_method?: string | null;
  card_last_four?: string | null;
  card_network?: string | null;
  card_type?: string | null;
}

interface UserClaims {
  email?: string;
  aud?: string;
  sub?: string;
  [key: string]: unknown;
}

interface Props {
  user: UserClaims;
  subscriptions: Subscription[];
  transactions: Transaction[];
  customerId?: string;
}

export const ProtectedDashboard: React.FC<Props> = ({
  user,
  subscriptions: initialSubscriptions,
  transactions,
  customerId,
}) => {
  const username = user.email?.split("@")[0] ?? "User";
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(initialSubscriptions);

  // Handler to update subscription locally after cancel
  const handleSubscriptionCancelled = (subscriptionId: string) => {
    setSubscriptions((prev) =>
      prev.map((sub) =>
        sub.subscription_id === subscriptionId
          ? { ...sub, subscription_status: "cancelled" }
          : sub
      )
    );
  };

  const formatAmount = (amount?: number | null, currency?: string | null): string => {
    if (amount == null) return "N/A";
    const actualAmount = amount / 100;
    return currency
      ? new Intl.NumberFormat("en-US", { style: "currency", currency }).format(actualAmount)
      : actualAmount.toString();
  };

  const formatDate = (date?: string | null): string => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      active: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300",
      inactive: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      completed: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300",
      failed: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      processing: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      cancelled: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
    };
    return colors[status.toLowerCase()] ?? "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight flex items-center gap-3">
            <HandIcon className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-yellow-500" />
            Welcome back, <span className="text-blue-600 dark:text-blue-400 capitalize">{username}</span>
          </h1>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400">
            Here&apos;s a quick overview of your account, subscriptions, and recent activity.
          </p>
        </header>

        {/* Dashboard Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Account Info */}
          <article className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-800">
            <header className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Your Account</h2>
              <span className="text-xs font-medium px-3 py-1 rounded-full text-blue-700 bg-blue-100 dark:text-blue-300 dark:bg-blue-900">
                User Profile
              </span>
            </header>
            <div className="space-y-5">
              <div className="flex items-center space-x-3">
                <MailIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
                  <p className="font-medium text-gray-900 dark:text-white">{user.email ?? "Not available"}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <KeyIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">User ID</p>
                  <p className="font-mono text-sm text-gray-700 dark:text-gray-300 truncate">{user.sub ?? "Not available"}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <PlusIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Account Type</p>
                  <p className="font-medium capitalize">{user.aud ?? "Standard"}</p>
                </div>
              </div>
              <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-800">
                <ProtectedAccount user={user} />
              </div>
              {customerId && (
                <div className="mt-4">
                  <CustomerPortalButton customerId={customerId} />
                </div>
              )}
            </div>
          </article>

          {/* Subscriptions */}
          <article className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-800">
            <header className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Subscriptions</h2>
              <span className="text-xs font-medium px-3 py-1 rounded-full text-blue-700 bg-blue-100 dark:text-blue-300 dark:bg-blue-900">
                Billing
              </span>
            </header>
            <div className="space-y-5 max-h-[400px] overflow-y-auto pr-2">
              {subscriptions.length ? (
                subscriptions.map((sub) => (
                  <div key={sub.subscription_id} className="pb-5 border-b border-gray-100 dark:border-gray-800 last:border-0 last:pb-0">
                    <h3 className="font-medium text-lg">{sub.product?.name ?? "Unknown Product"}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">ID: {sub.subscription_id}</p>
                    <div className="mt-2">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${getStatusColor(
                          sub.subscription_status,
                        )}`}
                      >
                        {sub.subscription_status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1 mt-3">
                      <p>Quantity: {sub.quantity ?? "N/A"}</p>
                      {sub.next_billing_date && (
                        <p>
                          Next billing: <span className="font-medium">{formatDate(sub.next_billing_date)}</span>
                        </p>
                      )}
                      {sub.trial_end_date && (
                        <p>
                          Trial ends:{" "}
                          <span className="font-medium text-orange-500 dark:text-orange-400">
                            {formatDate(sub.trial_end_date)}
                          </span>
                        </p>
                      )}
                    </div>

                    {/* Cancel button */}
                    {sub.subscription_status !== "cancelled" && (
                      <div className="mt-3">
                        <CancelSubscriptionButton
                          subscriptionId={sub.subscription_id}
                          onSuccess={() => handleSubscriptionCancelled(sub.subscription_id)}
                        />
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <p className="mb-2">No active subscriptions.</p>
                  <button
                    type="button"
                    className="flex items-center justify-center mx-auto text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                  >
                    Explore Plans <ChevronRightIcon className="w-4 h-4 ml-1" />
                  </button>
                </div>
              )}
            </div>
          </article>

          {/* Transactions */}
          <article className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-800">
            <header className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Recent Transactions</h2>
              <span className="text-xs font-medium px-3 py-1 rounded-full text-blue-700 bg-blue-100 dark:text-blue-300 dark:bg-blue-900">
                History
              </span>
            </header>
            <div className="space-y-5 max-h-[400px] overflow-y-auto pr-2">
              {transactions.length ? (
                transactions.map((tx) => (
                  <div key={tx.transaction_id} className="pb-5 border-b border-gray-100 dark:border-gray-800 last:border-0 last:pb-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-lg font-bold">{formatAmount(tx.amount, tx.currency)}</span>
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${getStatusColor(
                          tx.status,
                        )}`}
                      >
                        {tx.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                      <p>
                        Date: <span className="font-medium">{formatDate(tx.billed_at)}</span>
                      </p>
                      {tx.card_network && tx.card_last_four && (
                        <p className="flex items-center">
                          <CreditCardIcon className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="capitalize font-bold text-red-500">{tx.card_network}</span> card ending in{" "}
                          <span className="font-bold ml-1">****{tx.card_last_four}</span>
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <p className="mb-2">No recent transactions.</p>
                  <button
                    type="button"
                    className="flex items-center justify-center mx-auto text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                  >
                    View All Transactions <ChevronRightIcon className="w-4 h-4 ml-1" />
                  </button>
                </div>
              )}
            </div>
          </article>
        </section>

        {/* Quick Actions */}
        <section className="mt-8">
          <header className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Quick Actions</h2>
            <span className="text-xs font-medium px-3 py-1 rounded-full text-blue-700 bg-blue-100 dark:text-blue-300 dark:bg-blue-900">
              Shortcuts
            </span>
          </header>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button
              type="button"
              className="flex items-center justify-center px-4 py-4 bg-gray-900 dark:bg-gray-800 text-white rounded-xl text-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors shadow-sm"
            >
              <DownloadIcon className="w-5 h-5 mr-2" /> Download Invoice
            </button>

            {subscriptions.length > 0 && (
              <ManagePlanButton subscriptions={subscriptions} />
            )}

            {subscriptions.some((sub) => sub.subscription_status !== "cancelled") && (
              <CancelSubscriptionButton
                subscriptionId={subscriptions.find((sub) => sub.subscription_status !== "cancelled")!.subscription_id}
                onSuccess={() => {}}
              />
            )}

            {customerId && <CustomerPortalButton customerId={customerId} />}
          </div>
        </section>
      </main>
    </div>
  );
};
