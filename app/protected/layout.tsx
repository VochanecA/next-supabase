// app/protected/layout.tsx
import { ReactNode } from "react";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <Header />

      {/* Main container */}
      <div className="flex flex-1 max-w-7xl mx-auto w-full mt-4 px-6 gap-6">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content */}
        <main className="flex-1 flex flex-col gap-6 p-4">
          {children}
        </main>
      </div>
    </div>
  );
}
