import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { JSX } from "react";

export default function About(): JSX.Element {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">About AI Notify</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Learn more about our mission, team, and the technology behind our innovative notification platform.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              At AI Notify, we&apos;re dedicated to revolutionizing how businesses and individuals receive
              and interact with notifications. Our AI-powered platform delivers intelligent, personalized
              alerts that matter most to you.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              We believe in making technology work smarter for you, not harder. Our solutions are designed
              to reduce noise and increase productivity through context-aware notifications.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Our Technology</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Built on cutting-edge technology stacks, AI Notify leverages modern frameworks and
              cloud infrastructure to ensure reliability, scalability, and security.
            </p>
            <ul className="text-gray-600 dark:text-gray-300 space-y-2">
              <li>• Next.js 14 with App Router</li>
              <li>• Supabase for real-time database and authentication</li>
              <li>• Tailwind CSS for responsive styling</li>
              <li>• TypeScript for type safety</li>
              <li>• AI/ML integration for smart notifications</li>
            </ul>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-8">Our Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold">JD</span>
              </div>
              <h3 className="font-semibold mb-2">John Doe</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Founder & CEO</p>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold">JS</span>
              </div>
              <h3 className="font-semibold mb-2">Jane Smith</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Lead Developer</p>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold">AW</span>
              </div>
              <h3 className="font-semibold mb-2">Alex Wilson</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">AI Engineer</p>
            </div>
          </div>
        </div>

        <div className="text-center mt-16">
          <h2 className="text-2xl font-semibold mb-6">Ready to Get Started?</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already benefiting from our intelligent notification system.
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors">
            Get Started
          </button>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}