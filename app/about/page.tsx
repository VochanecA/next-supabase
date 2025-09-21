import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import type { JSX } from "react";
import Link from "next/link";

export default function About(): JSX.Element {
  const team = [
    { name: "John Doe", role: "Founder & CEO", initials: "JD" },
    { name: "Jane Smith", role: "Lead Developer", initials: "JS" },
    { name: "Alex Wilson", role: "AI Engineer", initials: "AW" },
  ] as const;

  const navLinks = [
    "Next.js 14 with App Router",
    "Supabase for real-time database and authentication",
    "Tailwind CSS for responsive styling",
    "TypeScript for type safety",
    "AI/ML integration for smart notifications",
  ] as const;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-12">
        {/* Intro Section */}
        <section className="text-center mb-12" aria-labelledby="about-heading">
          <h1 id="about-heading" className="text-4xl font-extrabold mb-4 tracking-tight">
            About AI Notify
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Learn more about our mission, team, and the technology behind our innovative notification platform.
          </p>
        </section>

        {/* Mission & Technology */}
        <section className="grid md:grid-cols-2 gap-12 mb-16" aria-label="Mission and Technology">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
              At AI Notify, we&apos;re dedicated to revolutionizing how businesses and individuals receive and interact with notifications.
            </p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Our AI-powered platform delivers intelligent, personalized alerts that matter most to you, reducing noise and increasing productivity.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Our Technology</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
              Built on cutting-edge technology stacks, AI Notify leverages modern frameworks and cloud infrastructure to ensure reliability, scalability, and security.
            </p>
            <ul className="text-gray-600 dark:text-gray-300 list-disc list-inside space-y-2">
              {navLinks.map((link) => (
                <li key={link}>{link}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* Team Section */}
        <section className="text-center mb-16" aria-labelledby="team-heading">
          <h2 id="team-heading" className="text-2xl font-semibold mb-8">Our Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map(({ name, role, initials }) => (
              <div key={name} className="text-center">
                <div
                  className="w-24 h-24 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-4 flex items-center justify-center"
                  aria-hidden="true"
                >
                  <span className="text-2xl font-bold">{initials}</span>
                </div>
                <h3 className="font-semibold mb-2">{name}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">{role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Call-to-Action */}
        <section className="text-center" aria-labelledby="cta-heading">
          <h2 id="cta-heading" className="text-2xl font-semibold mb-6">Ready to Get Started?</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Join thousands of users who are already benefiting from our intelligent notification system.
          </p>
          <Link
            href="/signup"
            className="inline-block bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
          >
            Get Started
          </Link>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
