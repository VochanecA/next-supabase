"use client";

import Link from "next/link";
import { FC, useState, useEffect, useCallback, useRef, memo } from "react";
import { usePathname } from "next/navigation";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Menu, X, Bell, User as UserIcon, ChevronDown, LayoutDashboard, Home, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

const navItems = ["Why", "About", "Features", "Pricing"];

const Header: FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const prevPathnameRef = useRef(pathname);

  const checkUserSubscription = useCallback(async (email?: string) => {
    if (!email) return setHasActiveSubscription(false);

    try {
      const supabase = createClient();
      const { data: customer } = await supabase.from("customers").select("customer_id").eq("email", email).maybeSingle();
      if (!customer?.customer_id) return setHasActiveSubscription(false);

      const { data: subscriptions } = await supabase.from("subscriptions").select("subscription_status").eq("customer_id", customer.customer_id);
      setHasActiveSubscription(subscriptions?.some((s) => s.subscription_status === "active") ?? false);
    } catch {
      setHasActiveSubscription(false);
    }
  }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      void checkUserSubscription(session?.user?.email);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
      void checkUserSubscription(session?.user?.email);
    });

    return () => subscription.unsubscribe();
  }, [checkUserSubscription]);

  useEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      setIsMobileMenuOpen(false);
      setIsUserDropdownOpen(false);
      prevPathnameRef.current = pathname;
    }
  }, [pathname]);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <>
      <header className="w-full border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md h-16 flex items-center justify-center sticky top-0 z-50">
        <div className="w-full max-w-6xl flex justify-between items-center px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center transform group-hover:scale-105 transition-transform">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-orange-500 transition-colors">AI Notify</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((page) => (
              <Link key={page} href={`/${page.toLowerCase()}`} className="text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition-colors font-medium">
                {page}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeSwitcher />
            {user ? <UserMenu user={user} hasActiveSubscription={hasActiveSubscription} isOpen={isUserDropdownOpen} toggle={() => setIsUserDropdownOpen((p) => !p)} /> : <AuthButton />}
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsMobileMenuOpen((p) => !p)} className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" aria-label="Toggle menu">
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
{isMobileMenuOpen && (
  <MobileMenu
    user={user}
    hasActiveSubscription={hasActiveSubscription}
    toggleTheme={toggleTheme}
    theme={theme ?? "light"} // ✅ fallback if theme is undefined
    closeMenu={() => setIsMobileMenuOpen(false)}
  />
)}
    </>
  );
};

// Memoized User Dropdown Menu
const UserMenu: FC<{ user: SupabaseUser; hasActiveSubscription: boolean; isOpen: boolean; toggle: () => void }> = memo(({ user, hasActiveSubscription, isOpen, toggle }) => (
  <div className="relative">
    <button onClick={toggle} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" aria-expanded={isOpen}>
      <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
        <UserIcon className="w-4 h-4 text-orange-500" />
      </div>
      <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
    </button>
    {isOpen && (
      <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user.email}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Welcome back!</p>
        </div>
        <Link href="/protected" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"> <LayoutDashboard className="w-5 h-5" /> Dashboard </Link>
        {hasActiveSubscription && <Link href="/protected/web-app" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"> <Home className="w-5 h-5" /> Web App </Link>}
        <div className="border-t border-gray-100 dark:border-gray-700 mt-2 pt-2 px-2">
          <AuthButton />
        </div>
      </div>
    )}
  </div>
));
UserMenu.displayName = "UserMenu";

// Mobile Menu
const MobileMenu: FC<{ user: SupabaseUser | null; hasActiveSubscription: boolean; toggleTheme: () => void; theme: string; closeMenu: () => void }> = memo(({ user, hasActiveSubscription, toggleTheme, theme, closeMenu }) => (
  <div className="md:hidden fixed inset-0 z-40 bg-white dark:bg-gray-900 pt-16 overflow-auto">
    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3 mb-6 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
          <UserIcon className="w-5 h-5 text-orange-500" />
        </div>
        <div className="flex-1 min-w-0">
          {user ? <span className="text-sm font-medium text-gray-900 dark:text-white">{user.email}</span> : <AuthButton showEmailOnly />}
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{user ? "Welcome back!" : "Please sign in"}</p>
        </div>
      </div>

      <nav className="space-y-4">
        {["Why", "About", "Features", "Pricing"].map((page) => (
          <Link key={page} href={`/${page.toLowerCase()}`} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-900 dark:text-white font-medium" onClick={closeMenu}>
            <span className="w-1 h-4 bg-orange-500 rounded-full" />
            {page}
          </Link>
        ))}
        {user && (
          <>
            <Link href="/protected" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-900 dark:text-white font-medium" onClick={closeMenu}>
              <LayoutDashboard className="w-5 h-5 text-gray-500 dark:text-gray-400" /> Dashboard
            </Link>
            {hasActiveSubscription && (
              <Link href="/protected/web-app" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-900 dark:text-white font-medium" onClick={closeMenu}>
                <Home className="w-5 h-5 text-gray-500 dark:text-gray-400" /> Web App
              </Link>
            )}
          </>
        )}
      </nav>

      {/* Theme Toggle */}
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
        <div className="flex items-center gap-3">
          {theme === "dark" ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-indigo-500" />}
          <span className="text-gray-900 dark:text-white font-medium">{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
        </div>
        <button onClick={toggleTheme} className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300 dark:bg-gray-600 transition-colors">
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${theme === "dark" ? "translate-x-6" : "translate-x-1"}`} />
        </button>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <AuthButton />
      </div>
    </div>
  </div>
));
MobileMenu.displayName = "MobileMenu";

export { Header };
