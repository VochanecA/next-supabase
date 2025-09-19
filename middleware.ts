import { updateSession } from "@/lib/supabase/middleware";
import { type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    // Only protect routes that actually need authentication
    "/dashboard/:path*",
    "/protected/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/api/ai/:path*", // Protect all AI API routes
    "/checkout/:path*",
    "/billing/:path*",
    "/account/:path*",
  ],
};