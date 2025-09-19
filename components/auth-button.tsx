"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface User {
  email?: string;
}

interface AuthButtonProps {
  /** Show email always (e.g., in mobile menu) */
  showEmailOnly?: boolean;
}

export function AuthButton({ showEmailOnly }: AuthButtonProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser();
        setUser(authUser);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  if (loading) {
    return (
      <div className="flex gap-2">
        <Button size="sm" variant="outline" disabled>
          Loading...
        </Button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex gap-2">
        <Button asChild size="sm" variant="outline">
          <Link href="/auth/login">Sign in</Link>
        </Button>
        <Button asChild size="sm" variant="default">
          <Link href="/auth/sign-up">Sign up</Link>
        </Button>
      </div>
    );
  }

  // User is logged in
  return showEmailOnly ? (
    // Mobile: stacked view
    <div className="flex flex-col gap-1 truncate">
      <span className="truncate">Hey, {user.email}!</span>
      <Button
        size="sm"
        variant="outline"
        onClick={handleSignOut}
        className="hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
      >
        Sign out
      </Button>
    </div>
  ) : (
    // Desktop: inline view
    <div className="flex items-center gap-4">
      <span className="text-sm hidden md:inline truncate">Hey, {user.email}!</span>
      <Button
        size="sm"
        variant="outline"
        onClick={handleSignOut}
        className="hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
      >
        Sign out
      </Button>
    </div>
  );
}
