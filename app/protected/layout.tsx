'use client';

import { ReactNode } from "react";
import { Header } from "@/components/header";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto w-full p-6 sm:p-8">
        {children}
      </main>
    </div>
  );
}