import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import { ShortcutsLink } from "@/components/layout/ShortcutsLink";
import {
    GITHUB_REPO_URL,
    LICENSE_URL,
    USER_GUIDE_URL,
    DISCORD_URL,
    TELEGRAM_URL,
    CONTACT_EMAIL,
} from "@/lib/constants";

export function Footer() {
    return (
        <footer className="site-footer mt-auto border-t border-[var(--border-light)] transition-colors duration-200">
            <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
                <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Brand Column */}
                    <div className="space-y-3">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-base font-bold tracking-tight text-[var(--text)]"
                        >
                            <Logo className="h-7 w-7 rounded-lg" />
                            <span>Passcodes</span>
                        </Link>
                        <p className="text-sm leading-relaxed text-[var(--footer-muted)]">
                            Free, offline password manager for Android. Your
                            credentials stay on your device — zero cloud, zero
                            trackers.
                        </p>
                    </div>

                    {/* Product Column */}
                    <div>
                        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)]">
                            Product
                        </h4>
                        <ul className="space-y-2.5 text-sm">
                            <li>
                                <Link
                                    href="/downloads"
                                    className="text-[var(--footer-muted)] transition-colors hover:text-[var(--text)]"
                                >
                                    Downloads
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/changelog"
                                    className="text-[var(--footer-muted)] transition-colors hover:text-[var(--text)]"
                                >
                                    Changelog
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={USER_GUIDE_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[var(--footer-muted)] transition-colors hover:text-[var(--text)]"
                                >
                                    Documentation
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Community Column */}
                    <div>
                        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)]">
                            Community
                        </h4>
                        <ul className="space-y-2.5 text-sm">
                            <li>
                                <Link
                                    href={GITHUB_REPO_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[var(--footer-muted)] transition-colors hover:text-[var(--text)]"
                                >
                                    GitHub
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={DISCORD_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[var(--footer-muted)] transition-colors hover:text-[var(--text)]"
                                >
                                    Discord
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={TELEGRAM_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[var(--footer-muted)] transition-colors hover:text-[var(--text)]"
                                >
                                    Telegram
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/community"
                                    className="text-[var(--footer-muted)] transition-colors hover:text-[var(--text)]"
                                >
                                    Contributors
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Project & Legal Column */}
                    <div>
                        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)]">
                            Project
                        </h4>
                        <ul className="space-y-2.5 text-sm">
                            <li>
                                <Link
                                    href={`mailto:${CONTACT_EMAIL}`}
                                    className="text-[var(--footer-muted)] transition-colors hover:text-[var(--text)]"
                                >
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={LICENSE_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[var(--footer-muted)] transition-colors hover:text-[var(--text)]"
                                >
                                    MIT License
                                </Link>
                            </li>
                            <li className="pt-0.5">
                                <ShortcutsLink />
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[var(--border-light)] pt-8 text-xs text-[var(--footer-muted)] sm:flex-row">
                    <div className="flex flex-col items-center gap-1 text-center sm:items-start sm:text-left">
                        <p>
                            Copyright &copy; Jeel Dobariya 2025–2026. All rights
                            reserved.
                        </p>
                        <p>
                            Design by{" "}
                            <Link
                                href="https://github.com/harsha-vardhan-burra"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[var(--footer-muted)] underline underline-offset-2 transition-colors hover:text-[var(--text)]"
                                title="Harsha Vardhan Burra"
                                aria-label="Harsha Vardhan Burra (@harsha-vardhan-burra) on GitHub"
                            >
                                @harsha-vardhan-burra
                            </Link>
                        </p>
                    </div>
                    <p className="text-[var(--text-dim)]">
                        Crafted for privacy and local control.
                    </p>
                </div>
            </div>
        </footer>
    );
}
