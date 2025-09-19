
//novi header sa fremer motion
"use client";

import Link from "next/link";
import { useState, type FC } from "react";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Menu, X, Bell, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = ["Home", "About", "Features", "Pricing"];

export const Header: FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = (): void => setIsMobileMenuOpen((prev) => !prev);

  return (
    <>
      <header className="w-full border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md h-16 flex items-center justify-center sticky top-0 z-50">
        <div className="w-full max-w-6xl flex justify-between items-center px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center transform group-hover:scale-105 transition-transform">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-orange-500 transition-colors">
              AI Notify
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((page) => (
              <Link
                key={page}
                href={`/${page.toLowerCase()}`}
                className="text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition-colors font-medium"
              >
                {page}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <AuthButton />
            <ThemeSwitcher />
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle menu"
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              key={isMobileMenuOpen ? "close" : "open"}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </motion.div>
          </motion.button>
        </div>
      </header>

      {/* Mobile Menu with animation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ y: "-100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="md:hidden fixed inset-0 z-40 bg-white dark:bg-gray-900 pt-16"
          >
            <div className="border-b border-gray-200 dark:border-gray-700 p-6">
              {/* User email + logout section */}
              <div className="flex items-center gap-3 mb-6 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-orange-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col text-sm font-medium text-gray-900 dark:text-white truncate">
                    <AuthButton showEmailOnly />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Welcome back!
                  </p>
                </div>
              </div>

              {/* Mobile Navigation */}
              <nav className="space-y-4">
                {navItems.map((page) => (
                  <Link
                    key={page}
                    href={`/${page.toLowerCase()}`}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-900 dark:text-white font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.05 }}
                      className="w-6 h-6 flex items-center justify-center"
                    >
                      <span className="w-1 h-4 bg-orange-500 rounded-full"></span>
                    </motion.div>
                    {page}
                  </Link>
                ))}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};