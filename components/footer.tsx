"use client";

import Link from "next/link";
import type { JSX } from "react";

export function Footer(): JSX.Element {
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/contact", label: "Contact" },
  ] as const;

  return (
    <footer
      className="w-full border-t border-gray-200 dark:border-gray-700 py-8 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900"
      aria-label="Footer"
    >
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
        {/* Copyright */}
        <p className="text-xs text-gray-600 dark:text-gray-400 text-center md:text-left">
          &copy; {currentYear} AI Notify. All rights reserved.
        </p>

        {/* Navigation Links */}
        <nav aria-label="Footer navigation" className="flex gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* External Link */}
        <Link
          href="https://supabase.com/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Powered by Supabase"
          className="text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
        >
          Powered by Supabase
        </Link>
      </div>
    </footer>
  );
}
