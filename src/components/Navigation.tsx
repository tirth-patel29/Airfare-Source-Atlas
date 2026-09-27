"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  Plane,
  CreditCard,
  Search,
  Download,
  Info,
  Menu,
  X,
  Database,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Overview", icon: Globe },
  { href: "/sources", label: "Sources", icon: Database },
  { href: "/airlines", label: "Airlines", icon: Plane },
  { href: "/otas", label: "OTAs", icon: CreditCard },
  { href: "/metasearch", label: "Metasearch", icon: Search },
  { href: "/downloads", label: "Downloads", icon: Download },
  { href: "/about", label: "About", icon: Info },
];

export function Navigation() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-[var(--color-border)]">
        <div className="page-container">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 no-underline">
              <div className="w-8 h-8 rounded-lg bg-[#1d1d1f] flex items-center justify-center">
                <Plane className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-[13px] font-semibold tracking-tight leading-none text-[#1d1d1f]">
                  AIRFARE
                </span>
                <span className="text-[11px] font-medium tracking-wide leading-none text-[var(--color-text-secondary)]">
                  SOURCE ATLAS
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative px-3.5 py-2 rounded-full text-[13px] font-medium transition-all duration-200 no-underline ${
                      isActive
                        ? "text-[#1d1d1f] bg-[rgba(0,0,0,0.06)]"
                        : "text-[var(--color-text-secondary)] hover:text-[#1d1d1f] hover:bg-[rgba(0,0,0,0.03)]"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Registry status + Mobile menu button */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-[var(--color-text-tertiary)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-verified)]" />
                <span>SIH26056 registry</span>
              </div>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-[rgba(0,0,0,0.04)] transition-colors"
                aria-label="Toggle navigation menu"
              >
                {mobileOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Sheet */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-16 left-0 right-0 z-50 lg:hidden glass border-b border-[var(--color-border)] shadow-lg"
            >
              <nav className="page-container py-3">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/" && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-medium no-underline transition-colors ${
                        isActive
                          ? "text-[#1d1d1f] bg-[rgba(0,0,0,0.05)]"
                          : "text-[var(--color-text-secondary)] hover:text-[#1d1d1f] hover:bg-[rgba(0,0,0,0.03)]"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </Link>
                  );
                })}
                <div className="flex items-center gap-1.5 px-4 py-3 text-[12px] text-[var(--color-text-tertiary)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-verified)]" />
                  SIH26056 registry
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
