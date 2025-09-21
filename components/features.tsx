import { Brain, Bell, Shield, Zap, BarChart3, Users } from "lucide-react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], display: "swap" });

interface FeatureItem {
  icon: JSX.Element;
  title: string;
  description: string;
}

const features: FeatureItem[] = [
  {
    icon: <Brain className="h-8 w-8 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />,
    title: "AI-Powered Intelligence",
    description: "Advanced machine learning algorithms that understand your notification preferences and adapt over time.",
  },
  {
    icon: <Bell className="h-8 w-8 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />,
    title: "Smart Notifications",
    description: "Context-aware alerts that respect your focus time and deliver information when it matters most.",
  },
  {
    icon: <Shield className="h-8 w-8 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />,
    title: "Enterprise Security",
    description: "Bank-level encryption with SOC2 compliance to keep your data safe and secure.",
  },
  {
    icon: <Zap className="h-8 w-8 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />,
    title: "Lightning Fast",
    description: "Sub-10ms response times with global edge infrastructure for instant notifications.",
  },
  {
    icon: <BarChart3 className="h-8 w-8 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />,
    title: "Advanced Analytics",
    description: "Comprehensive dashboards to track notification performance and user engagement.",
  },
  {
    icon: <Users className="h-8 w-8 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />,
    title: "Team Collaboration",
    description: "Seamless team management with role-based access and shared notification workflows.",
  },
];

export function Features() {
  return (
    <section className={`py-24 bg-white dark:bg-gray-800 ${inter.className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Powerful Features for Modern Teams
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Everything you need to manage notifications intelligently and efficiently.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon, title, description }) => (
            <article
              key={title}
              className="group relative rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-indigo-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-900 dark:hover:border-indigo-700"
            >
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 rounded-lg bg-indigo-50 p-3 dark:bg-indigo-900/20">
                  {icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
              </div>
              <p className="mt-3 text-gray-600 dark:text-gray-300">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}