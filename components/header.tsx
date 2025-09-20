"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/types";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";

type CustomerRow = Database["public"]["Tables"]["customers"]["Row"];
type SubscriptionRow = Database["public"]["Tables"]["subscriptions"]["Row"];

interface NavItem {
  label: string;
  href: string;
  protected?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Dashboard", href: "/dashboard", protected: true },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
];

export default function Header(): JSX.Element {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  const supabase = createClient();

  const fetchUserAndSubscription = useCallback(async () => {
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();

    setUser(currentUser);

    if (currentUser?.email) {
      const { data: customer } = await supabase
        .from<CustomerRow>("customers")
        .select("customer_id")
        .eq("auth_id", currentUser.id)
        .single();

      const customerId = customer?.customer_id;

      if (!customerId) {
        const { data: fallbackCustomer } = await supabase
          .from<CustomerRow>("customers")
          .select("customer_id")
          .ilike("email", currentUser.email)
          .single();

        if (fallbackCustomer?.customer_id) {
          const { data: subscriptions } = await supabase
            .from<SubscriptionRow>("subscriptions")
            .select("subscription_status")
            .eq("customer_id", fallbackCustomer.customer_id);

          const isActive = subscriptions?.some(
            (sub) => sub.subscription_status === "active"
          );
          setHasActiveSubscription(isActive || false);
        }
      } else {
        const { data: subscriptions } = await supabase
          .from<SubscriptionRow>("subscriptions")
          .select("subscription_status")
          .eq("customer_id", customerId);

        const isActive = subscriptions?.some(
          (sub) => sub.subscription_status === "active"
        );
        setHasActiveSubscription(isActive || false);
      }
    }
  }, [supabase]);

  useEffect(() => {
    fetchUserAndSubscription();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      void fetchUserAndSubscription();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchUserAndSubscription, supabase.auth]);

  const toggleMenu = (): void => setIsMobileMenuOpen((prev) => !prev);

  const filteredNavItems = NAV_ITEMS.filter(
    (item) => !item.protected || hasActiveSubscription
  );

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto flex justify-between items-center px-4 py-3">
        <Link href="/" className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
          AI Notify
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-6">
          {filteredNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${
                pathname === item.href
                  ? "text-indigo-600 dark:text-indigo-400 font-semibold"
                  : "text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
              } transition-colors`}
            >
              {item.label}
            </Link>
          ))}
          <ThemeSwitcher />
          {user ? (
            <Button
              onClick={async () => {
                await supabase.auth.signOut();
              }}
              variant="outline"
            >
              Logout
            </Button>
          ) : (
            <Link href="/login">
              <Button>Login</Button>
            </Link>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-gray-700 dark:text-gray-300 focus:outline-none"
          aria-label="Toggle menu"
        >
          <motion.div
            animate={isMobileMenuOpen ? "open" : "closed"}
            className="space-y-1.5"
          >
            <motion.span
              className="block h-0.5 w-6 bg-current"
              variants={{
                closed: { rotate: 0, y: 0 },
                open: { rotate: 45, y: 6 },
              }}
            />
            <motion.span
              className="block h-0.5 w-6 bg-current"
              variants={{
                closed: { opacity: 1 },
                open: { opacity: 0 },
              }}
            />
            <motion.span
              className="block h-0.5 w-6 bg-current"
              variants={{
                closed: { rotate: 0, y: 0 },
                open: { rotate: -45, y: -6 },
              }}
            />
          </motion.div>
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            ref={dialogRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            aria-hidden={!isMobileMenuOpen}
            onClick={toggleMenu}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween" }}
              className="absolute right-0 top-0 h-full w-64 bg-white dark:bg-gray-900 shadow-lg p-6 flex flex-col space-y-6"
              role="dialog"
              aria-modal="true"
              onClick={(e) => e.stopPropagation()}
            >
              {filteredNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={toggleMenu}
                  className={`${
                    pathname === item.href
                      ? "text-indigo-600 dark:text-indigo-400 font-semibold"
                      : "text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                  } transition-colors`}
                >
                  {item.label}
                </Link>
              ))}
              <ThemeSwitcher />
              {user ? (
                <Button
                  onClick={async () => {
                    await supabase.auth.signOut();
                    toggleMenu();
                  }}
                  variant="outline"
                >
                  Logout
                </Button>
              ) : (
                <Link href="/login" onClick={toggleMenu}>
                  <Button>Login</Button>
                </Link>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}