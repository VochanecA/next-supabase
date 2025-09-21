"use client";

import Link from "next/link";
import type { JSX } from "react";

export function Footer(): JSX.Element {
  const currentYear: number = new Date().getFullYear();

  const navLinks = [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/contact", label: "Contact" },
  ] as const;

  return (
    <footer
      className="w-full border-t border-gray-200 dark:border-gray-700 py-10 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900"
      aria-label="Footer"
    >
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Copyright */}
        <p className="text-xs text-gray-600 dark:text-gray-400 text-center md:text-left">
          &copy; {currentYear} AI Notify. All rights reserved.
        </p>

        {/* Navigation Links */}
        <nav aria-label="Footer navigation">
          <ul className="flex flex-wrap justify-center md:justify-end gap-4 text-xs text-gray-600 dark:text-gray-400">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
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