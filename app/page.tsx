import { Hero } from "../components/hero";
import { Features } from "../components/features";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { JSX } from "react";

export default function Home(): JSX.Element {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <Hero />

      {/* Features */}
      <Features />

      {/* Footer */}
      <Footer />
    </div>
  );
}