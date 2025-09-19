import Link from "next/link";
import { JSX } from "react";

export function Footer(): JSX.Element {
  return (
    <footer className="w-full border-t border-gray-200 dark:border-gray-700 py-10 flex flex-col md:flex-row items-center justify-center gap-4 text-xs text-center">
      <p>
        &copy; {new Date().getFullYear()} AI Notify. All rights reserved.
      </p>
      <Link
        href="https://supabase.com/"
        target="_blank"
        rel="noreferrer"
        className="font-bold hover:underline"
      >
        Powered by Supabase
      </Link>
    </footer>
  );
}