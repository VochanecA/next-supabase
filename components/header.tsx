// components/header.tsx
"use client";

import Link from "next/link";
import { useState, type FC, useEffect, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Menu, X, Bell, User as UserIcon, ChevronDown, LayoutDashboard, Home, Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { useTheme } from "next-themes";

const navItems = ["Why", "About", "Features", "Pricing"];

export const Header: FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const prevPathnameRef = useRef(pathname);

  // Check user subscription status
  const checkUserSubscription = useCallback(async (email: string | undefined): Promise<void> => {
    if (!email) {
      setHasActiveSubscription(false);
      return;
    }
    
    try {
      const supabase = createClient();
      const { data: customer, error: customerError } = await supabase
        .from('customers')
        .select('customer_id')
        .eq('email', email)
        .maybeSingle();
        
      if (customerError) {
        console.error("Customer fetch error:", customerError);
        setHasActiveSubscription(false);
        return;
      }
      
      if (customer?.customer_id) {
        const { data: subscriptions, error: subscriptionError } = await supabase
          .from('subscriptions')
          .select('subscription_status')
          .eq('customer_id', customer.customer_id);
          
        if (subscriptionError) {
          console.error("Subscription fetch error:", subscriptionError);
          setHasActiveSubscription(false);
          return;
        }
          
        const isActive = subscriptions?.some(
          (sub) => sub.subscription_status === 'active'
        ) ?? false;
        setHasActiveSubscription(isActive);
      } else {
        setHasActiveSubscription(false);
      }
    } catch (err) {
      console.error("Failed to fetch subscription data:", err);
      setHasActiveSubscription(false);
    }
  }, []);

  // Set up auth state listener only once on component mount
  useEffect(() => {
    const supabase = createClient();
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user?.email) {
        void checkUserSubscription(session.user.email);
      } else {
        setHasActiveSubscription(false);
      }
    }).catch((error) => {
      console.error("Failed to get session:", error);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      if (session?.user?.email) {
        await checkUserSubscription(session.user.email);
      } else {
        setHasActiveSubscription(false);
      }
    });

    // Cleanup subscription on unmount
    return (): void => {
      subscription.unsubscribe();
    };
  }, [checkUserSubscription]);

  // Close mobile menu when route changes (but prevent flickering)
  useEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      setIsMobileMenuOpen(false);
      setIsUserDropdownOpen(false);
      prevPathnameRef.current = pathname;
    }
  }, [pathname]);

  const toggleMenu = (): void => setIsMobileMenuOpen((prev) => !prev);
  const toggleUserDropdown = (): void => setIsUserDropdownOpen((prev) => !prev);
  const toggleTheme = (): void => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <>
      {/* Header */}
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

          {/* Desktop Navigation - Using will-change-transform to prevent flickering */}
          <nav className="hidden md:flex items-center gap-8 will-change-transform">
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
          <div className="hidden md:flex items-center gap-4 will-change-transform">
            <ThemeSwitcher />
            
            {user ? (
              <div className="relative">
                <button
                  onClick={toggleUserDropdown}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-expanded={isUserDropdownOpen}
                  aria-label="User menu"
                  type="button"
                >
                  <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                    <UserIcon className="w-4 h-4 text-orange-500" />
                  </div>
                  <ChevronDown 
                    className={`w-4 h-4 transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`} 
                  />
                </button>
                
                {/* User Dropdown Menu */}
                <AnimatePresence>
                  {isUserDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50 will-change-transform"
                      onMouseLeave={(): void => setIsUserDropdownOpen(false)}
                    >
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {user.email}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Welcome back!
                        </p>
                      </div>
                      
                      <Link
                        href="/protected"
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        onClick={(): void => setIsUserDropdownOpen(false)}
                      >
                        <LayoutDashboard className="w-5 h-5" />
                        Dashboard
                      </Link>
                      
                      {hasActiveSubscription && (
                        <Link
                          href="/protected/web-app"
                          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          onClick={(): void => setIsUserDropdownOpen(false)}
                        >
                          <Home className="w-5 h-5" />
                          Web App
                        </Link>
                      )}
                      
                      <div className="border-t border-gray-100 dark:border-gray-700 mt-2 pt-2">
                        <div className="px-2">
                          {/* Wrap AuthButton in a div with custom styling instead of passing className */}
                          <div className="py-2.5 px-4 text-sm w-full justify-center">
                            <AuthButton />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <AuthButton />
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle menu"
            whileTap={{ scale: 0.9 }}
            type="button"
          >
            <motion.div
              key={isMobileMenuOpen ? "close" : "open"}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.div>
          </motion.button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ y: "-100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="md:hidden fixed inset-0 z-40 bg-white dark:bg-gray-900 pt-16 will-change-transform"
          >
            <div className="border-b border-gray-200 dark:border-gray-700 p-6">
              {/* User info */}
              <div className="flex items-center gap-3 mb-6 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                  <UserIcon className="w-5 h-5 text-orange-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col text-sm font-medium text-gray-900 dark:text-white truncate">
                    {user ? (
                      <span>{user.email}</span>
                    ) : (
                      <AuthButton showEmailOnly />
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {user ? "Welcome back!" : "Please sign in"}
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
                    onClick={(): void => setIsMobileMenuOpen(false)}
                  >
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.05 }}
                      className="w-6 h-6 flex items-center justify-center"
                    >
                      <span className="w-1 h-4 bg-orange-500 rounded-full" />
                    </motion.div>
                    {page}
                  </Link>
                ))}
                {user && (
                  <>
                    <Link
                      href="/protected"
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-900 dark:text-white font-medium"
                      onClick={(): void => setIsMobileMenuOpen(false)}
                    >
                      <LayoutDashboard className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                      Dashboard
                    </Link>
                    {hasActiveSubscription && (
                      <Link
                        href="/protected/web-app"
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-900 dark:text-white font-medium"
                        onClick={(): void => setIsMobileMenuOpen(false)}
                      >
                        <Home className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        Web App
                      </Link>
                    )}
                  </>
                )}
              </nav>

              {/* Theme Toggle in Mobile Menu */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex items-center gap-3">
                    {theme === "dark" ? (
                      <Sun className="w-5 h-5 text-yellow-500" />
                    ) : (
                      <Moon className="w-5 h-5 text-indigo-500" />
                    )}
                    <span className="text-gray-900 dark:text-white font-medium">
                      {theme === "dark" ? "Light Mode" : "Dark Mode"}
                    </span>
                  </div>
                  <button
                    onClick={toggleTheme}
                    className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300 dark:bg-gray-600 transition-colors focus:outline-none"
                    type="button"
                    aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        theme === "dark" ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Auth button in mobile menu - Made larger */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex flex-col gap-3">
                  {/* Wrap AuthButton in a div with custom styling instead of passing className */}
                  <div className="py-3 px-4 text-base justify-center">
                    <AuthButton />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};