// app/protected/page.tsx

// Hybrid Approach (Server + Client Components)

// Structure:

// Server Component: protected/page.tsx

// Runs on the server.

// Fetches auth info from Supabase securely.

// Redirects immediately if the user is not logged in.

// Renders layout, sidebar, and passes user info to child components.

// Client Component: ProtectedAccount

// Handles interactive UI (like changing password, updating profile).

// Can call Supabase client safely for updates.

// Can show toast notifications or animations.

// Benefits:

// Security: Auth check happens on the server, so the page won’t even render for unauthorized users.

// Performance: Server fetches user data before rendering; client only handles interaction.

// User Experience: Password updates, form validation, and toast notifications work client-side instantly.

// Scalability: You can extend client components for more interactions without exposing sensitive checks.
// app/protected/page.tsx
import { JSX } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

import { ProtectedAccount } from "@/components/protected-account";
import type { JwtPayload } from "@supabase/supabase-js";

// Type-safe interface for user claims
interface UserClaims {
  email?: string;
  aud?: string;
  sub?: string;
  [key: string]: unknown;
}

export default async function ProtectedPage(): Promise<JSX.Element> {
  // Server-side Supabase client
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  const jwtClaims: JwtPayload = data.claims;
  const user: UserClaims = {
    ...jwtClaims,
    aud: Array.isArray(jwtClaims.aud) ? jwtClaims.aud[0] : jwtClaims.aud,
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">


      {/* Main dashboard content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-6 space-y-6">
        <h1 className="text-4xl font-bold mb-4">Account Dashboard</h1>

        {/* Dashboard grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Account Info Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 flex flex-col">
            <h2 className="text-xl font-semibold mb-4">Account Info</h2>
            <ProtectedAccount user={user} />
          </div>

          {/* Usage Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 flex flex-col">
            <h2 className="text-xl font-semibold mb-4">Usage Stats</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Monitor your notifications and AI interactions in real-time.
            </p>
          </div>

          {/* Tips & Info */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 flex flex-col">
            <h2 className="text-xl font-semibold mb-4">Tips & Info</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Quick access to guides, FAQs, and account management.
            </p>
          </div>

          {/* Notifications */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 flex flex-col">
            <h2 className="text-xl font-semibold mb-4">Notifications</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Manage your active notifications and alert preferences.
            </p>
          </div>

          {/* AI Interactions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 flex flex-col">
            <h2 className="text-xl font-semibold mb-4">AI Interactions</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Explore AI insights to help manage your workflow efficiently.
            </p>
          </div>

          {/* Support */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 flex flex-col">
            <h2 className="text-xl font-semibold mb-4">Support</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Contact support or view troubleshooting tips anytime.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
