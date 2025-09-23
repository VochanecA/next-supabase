// components/CancelSubscriptionButton.tsx
"use client";

import { useState } from "react";
import { XCircleIcon } from "lucide-react";
import { cancelSubscription, type CancelOption } from "@/lib/actions/cancel-subscription";

interface CancelSubscriptionButtonProps {
  subscriptionId: string;
}

export const CancelSubscriptionButton: React.FC<CancelSubscriptionButtonProps> = ({
  subscriptionId,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<CancelOption>("next_billing");

  const handleCancel = async (): Promise<void> => {
    if (!subscriptionId) {
      setError("No subscription selected.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await cancelSubscription(subscriptionId, selectedOption);

      if (!result.success) {
        setError(result.error ?? "Failed to cancel subscription.");
      } else {
        setSuccess(true);
        setShowModal(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (): void => {
    setShowModal(true);
    setError(null);
  };

  const handleCloseModal = (): void => {
    setShowModal(false);
    setError(null);
  };

  const handleOptionChange = (option: CancelOption): void => {
    setSelectedOption(option);
  };

  const getButtonText = (): string => {
    if (loading) return "Cancelling...";
    if (success) return "Cancelled";
    return "Cancel Subscription";
  };

  return (
    <div className="flex flex-col items-center w-full">
      <button
        type="button"
        onClick={handleOpenModal}
        disabled={loading || success}
        className={`flex items-center justify-center w-full px-4 py-4 rounded-xl text-lg font-medium transition-colors shadow-sm ${
          loading || success
            ? "bg-gray-400 cursor-not-allowed text-gray-200"
            : "bg-red-600 hover:bg-red-500 text-white"
        }`}
      >
        <XCircleIcon className="w-5 h-5 mr-2" />
        {getButtonText()}
      </button>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Cancel Subscription
            </h3>
            
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              How would you like to cancel your subscription?
            </p>

            <div className="space-y-3 mb-6">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="cancelOption"
                  checked={selectedOption === "next_billing"}
                  onChange={() => handleOptionChange("next_billing")}
                  className="mt-1"
                />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    At next billing period
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Continue access until the end of your current billing cycle
                  </div>
                </div>
              </label>

              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="cancelOption"
                  checked={selectedOption === "immediately"}
                  onChange={() => handleOptionChange("immediately")}
                  className="mt-1"
                />
                <div>
                  <div className="font-medium text-red-600 dark:text-red-400">
                    Immediately
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Access ends immediately
                  </div>
                </div>
              </label>
            </div>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={handleCloseModal}
                disabled={loading}
                className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                Go Back
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500 transition-colors disabled:bg-red-400"
              >
                {loading ? "Cancelling..." : "Confirm Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <span className="mt-2 text-sm text-red-500 text-center">{error}</span>
      )}
    </div>
  );
};