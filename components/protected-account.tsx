
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
"use client";

import { JSX, useState, FormEvent, ChangeEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import toast, { Toaster } from "react-hot-toast";
// import type { User } from "@supabase/supabase-js";

interface UserClaims {
  email?: string;
  aud?: string; // must match the mapped value
  [key: string]: unknown;
}


interface Props {
  user: UserClaims;
}

export function ProtectedAccount({ user }: Props): JSX.Element {
  const [newPassword, setNewPassword] = useState<string>("");
  const [updating, setUpdating] = useState<boolean>(false);

  const supabase = createClient();

  const handleChangePassword = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!newPassword) {
      toast.error("Please enter a new password.");
      return;
    }

    setUpdating(true);

    try {
      const { data, error } = await supabase.auth.updateUser({ password: newPassword });

      if (error) {
        toast.error(`Password update failed: ${error.message}`);
      } else if (data) {
        toast.success("Password updated successfully!");
        setNewPassword("");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(`An unexpected error occurred: ${err.message}`);
      } else {
        toast.error("An unexpected error occurred while updating password.");
      }
      console.error("Password update error:", err);
    } finally {
      setUpdating(false);
    }
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setNewPassword(e.target.value);
  };

  return (
    <main className="flex-1 bg-white dark:bg-gray-800 p-6 rounded-xl shadow space-y-6">
      <Toaster position="top-right" />

      <h1 className="text-2xl font-bold mb-4">Account Information</h1>

      <div className="space-y-2">
        <p>
          <span className="font-semibold">Email:</span> {user?.email ?? "Not available"}
        </p>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Change Password</h2>
        <form onSubmit={handleChangePassword} className="flex flex-col gap-4 max-w-md">
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={handlePasswordChange}
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-800 dark:bg-gray-900 text-gray-900 dark:text-white"
          />
          <button
            type="submit"
            disabled={updating}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
          >
            {updating ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </main>
  );
}
