// components/features.tsx
import type { FC, ReactElement } from "react";
import { Brain, Bell, Shield, Zap, BarChart3, Users } from "lucide-react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], display: "swap" });

const features: readonly { icon: ReactElement; title: string; description: string }[] = [
  { icon: <Brain className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />, title: "AI-Powered Intelligence", description: "Advanced ML algorithms adapting over time." },
  { icon: <Bell className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />, title: "Smart Notifications", description: "Context-aware alerts delivered at the right time." },
  { icon: <Shield className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />, title: "Enterprise Security", description: "Bank-level encryption & SOC2 compliance." },
  { icon: <Zap className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />, title: "Lightning Fast", description: "Sub-10ms response times globally." },
  { icon: <BarChart3 className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />, title: "Advanced Analytics", description: "Track performance & engagement." },
  { icon: <Users className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />, title: "Team Collaboration", description: "Role-based access & shared workflows." },
];

export const Features: FC = () => (
  <section className={`py-24 bg-white dark:bg-gray-800 ${inter.className}`}>
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">Powerful Features for Modern Teams</h2>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Everything you need to manage notifications intelligently.</p>
      </div>
      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map(f => (
          <div key={f.title} className="group relative rounded-xl border border-gray-200 p-6 shadow-sm hover:border-indigo-300 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-indigo-700 transition-all">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 bg-indigo-50 p-3 rounded-lg dark:bg-indigo-900/20">{f.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{f.title}</h3>
            </div>
            <p className="mt-3 text-gray-600 dark:text-gray-300">{f.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);