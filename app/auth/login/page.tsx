import { LoginForm } from "@/components/login-form";
import Link from "next/link";
import { Bell } from "lucide-react";

export default function Page() {
  return (
    <div className="min-h-svh w-full bg-gradient-to-br from-orange-50 via-white to-orange-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="w-full border-b border-orange-200 dark:border-orange-800/30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md h-16 flex items-center justify-center">
        <div className="w-full max-w-6xl flex justify-between items-center px-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center transform group-hover:scale-105 transition-transform">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-orange-500 transition-colors">
              AI Notify
            </span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex w-full items-center justify-center p-6 md:p-10 py-12">
        <div className="w-full max-w-md">
          {/* Card Container */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-orange-100 dark:border-orange-900/50 p-8">
            {/* Header Section */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                  <Bell className="w-6 h-6 text-white" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome back
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Sign in to your AI Notify account
              </p>
            </div>

            {/* Login Form */}
            <LoginForm />

            {/* Footer Links */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Don&apos;t have an account?{" "}
                <Link
                  href="/auth/signup"
                  className="text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 font-semibold transition-colors"
                >
                  Sign up
                </Link>
              </p>
              <Link
                href="/"
                className="inline-block mt-4 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
              >
                ← Back to home
              </Link>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              By continuing, you agree to our{" "}
              <Link
                href="/terms"
                className="text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300"
              >
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}