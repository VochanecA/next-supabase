import { JSX } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProtectedDashboard } from "@/components/protected-dashboard";
import type { JwtPayload } from "@supabase/supabase-js";

// Type-safe interface for user claims
interface UserClaims {
  email?: string;
  aud?: string; 
  sub?: string;
  [key: string]: unknown;
}

export default async function ProtectedPage(): Promise<JSX.Element> {
  // Create server-side Supabase client
  const supabase = await createClient();

  // Get user claims
  const { data, error } = await supabase.auth.getClaims();

  // Redirect to login if no valid claims
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  const jwtClaims: JwtPayload = data.claims;

  // Create user object from claims
  const user: UserClaims = {
    ...jwtClaims,
    aud: Array.isArray(jwtClaims.aud) ? jwtClaims.aud[0] : jwtClaims.aud,
  };

  // Ensure we have a user email
  if (!user.email) {
    console.error("No email found in user claims");
    redirect("/auth/login");
  }

  // Pass only user to ProtectedDashboard
  return <ProtectedDashboard user={user} />;
}
