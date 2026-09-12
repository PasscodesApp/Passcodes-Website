"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Download, Github } from "lucide-react";
import { NAV_ROUTES, GITHUB_REPO_URL } from "@/lib/constants";
import { useActiveNav } from "@/hooks/useActiveNav";
import { Logo } from "@/components/layout/Logo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { GithubIcon } from "@/components/ui/BrandIcons";
import { cn } from "@/lib/utils";

export function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { isActive } = useActiveNav();

    // Close mobile menu on Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setIsMobileMenuOpen(false);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <header className="nav-shell sticky top-0 z-50 transition-colors duration-200">
            <nav
                className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6"
                aria-label="Main navigation"
            >
                {/* Brand */}
                <Link
                    href="/"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg text-base font-bold tracking-tight text-[var(--text)] transition-opacity hover:opacity-90"
                    aria-label="Passcodes Home"
                >
                    <Logo className="h-7 w-7 rounded-lg shadow-sm" />
                    <span className="text-lg font-bold">Passcodes</span>
                </Link>

                {/* Desktop Nav Items */}
                <div className="hidden items-center gap-1 md:flex">
                    {NAV_ROUTES.map((route) => {
                        const active = isActive(route.href);
                        return (
                            <Link
                                key={route.href}
                                href={route.href}
                                className={cn(
                                    "nav-btn text-sm font-medium",
                                    active && "active-nav"
                                )}
                                aria-current={active ? "page" : undefined}
                            >
                                {route.label}
                            </Link>
                        );
                    })}
                </div>

                {/* Desktop Right Actions */}
                <div className="hidden items-center gap-2 md:flex">
                    <Link
                        href={GITHUB_REPO_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="nav-btn !px-2.5 !py-2"
                        aria-label="Passcodes GitHub Repository"
                        title="GitHub Repository"
                    >
                        <GithubIcon className="h-4 w-4" />
                    </Link>

                    <ThemeToggle />

                    <Link
                        href="/downloads"
                        className="btn btn-filled btn-small ml-1"
                        aria-label="Get App - Download Passcodes"
                    >
                        <Download className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Get App</span>
                    </Link>
                </div>

                {/* Mobile Menu & Theme Button */}
                <div className="flex items-center gap-2 md:hidden">
                    <ThemeToggle />
                    <button
                        type="button"
                        className="nav-btn !p-2"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-expanded={isMobileMenuOpen}
                        aria-controls="mobile-menu"
                        aria-label={
                            isMobileMenuOpen ? "Close menu" : "Open menu"
                        }
                    >
                        {isMobileMenuOpen ? (
                            <X className="h-5 w-5" aria-hidden="true" />
                        ) : (
                            <Menu className="h-5 w-5" aria-hidden="true" />
                        )}
                    </button>
                </div>
            </nav>

            {/* Mobile Drawer */}
            {isMobileMenuOpen && (
                <div
                    id="mobile-menu"
                    className="animate-fade-in border-b border-[var(--border-light)] bg-[var(--nav-bg)] px-4 pb-5 pt-2 backdrop-blur-xl md:hidden"
                >
                    <div className="flex flex-col gap-1">
                        {NAV_ROUTES.map((route) => {
                            const active = isActive(route.href);
                            return (
                                <Link
                                    key={route.href}
                                    href={route.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={cn(
                                        "flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                                        active
                                            ? "bg-[var(--card-bg-hover)] font-semibold text-[var(--text)]"
                                            : "text-[var(--text-muted)] hover:bg-[var(--card-bg)] hover:text-[var(--text)]"
                                    )}
                                    aria-current={active ? "page" : undefined}
                                >
                                    {route.label}
                                </Link>
                            );
                        })}

                        <div className="mt-2 border-t border-[var(--border-light)] pt-2">
                            <Link
                                href={GITHUB_REPO_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--text-muted)] hover:bg-[var(--card-bg)] hover:text-[var(--text)]"
                            >
                                <Github className="h-4 w-4" />
                                <span>View on GitHub</span>
                            </Link>
                        </div>

                        <div className="pt-1">
                            <Link
                                href="/downloads"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="btn btn-filled w-full justify-center py-2.5 text-sm font-semibold"
                            >
                                <Download className="h-4 w-4" />
                                <span>Download Passcodes</span>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
