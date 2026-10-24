"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CHANGELOG_ENTRIES } from "@/lib/changelog";
import { ReleaseVisual } from "@/components/visuals/ReleaseVisual";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { cn } from "@/lib/utils";

export function LatestUpdates() {
    const recent = CHANGELOG_ENTRIES.filter(
        (entry) => !entry.isMilestone
    ).slice(0, 2);

    return (
        <section className="bg-[var(--card-bg)]/30 border-t border-[var(--border-light)] py-16 sm:py-24">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <ScrollReveal>
                    <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <span className="editorial-badge mb-2 border border-[var(--border-light)] bg-[var(--card-bg)] text-[var(--accent-light)]">
                                Product Stream
                            </span>
                            <h2 className="section-heading">
                                Latest from Passcodes
                            </h2>
                            <p className="section-subheading">
                                Stay informed with our recent releases and
                                development progress.
                            </p>
                        </div>
                        <Link
                            href="/changelog"
                            className="hidden items-center gap-1.5 text-sm font-semibold text-[var(--accent-light)] transition-all hover:gap-2 sm:flex"
                        >
                            <span>View all updates in Changelog</span>
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </ScrollReveal>

                <div className="grid gap-6 sm:grid-cols-2">
                    {recent.map((entry, idx) => (
                        <ScrollReveal key={entry.slug} delay={idx * 100}>
                            <Link
                                href={`/changelog/${entry.slug}`}
                                className="subtle-card group relative flex h-full flex-col justify-between overflow-hidden transition-all hover:border-[var(--border)]"
                            >
                                <div
                                    className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--accent-light)] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                                    aria-hidden="true"
                                />
                                <div>
                                    <div className="mb-3.5 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={cn(
                                                    "tag",
                                                    entry.releaseType ===
                                                        "Stable" &&
                                                        "tag stable",
                                                    entry.releaseType ===
                                                        "Beta" && "tag beta",
                                                    entry.releaseType ===
                                                        "Alpha" && "tag alpha"
                                                )}
                                            >
                                                {entry.releaseType}
                                            </span>
                                            <span className="text-xs text-[var(--text-dim)]">
                                                {new Date(
                                                    entry.date
                                                ).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                            </span>
                                            <span className="text-xs text-[var(--text-dim)]">
                                                ·
                                            </span>
                                            <span className="font-mono text-xs font-medium text-[var(--accent-light)]">
                                                {entry.version}
                                            </span>
                                        </div>

                                        {/* Category Visual Token */}
                                        <div className="rounded-lg border border-[var(--border-light)] bg-[var(--card-bg)] p-1.5">
                                            <ReleaseVisual
                                                category={entry.category}
                                                className="h-4 w-4"
                                            />
                                        </div>
                                    </div>

                                    <h3 className="text-lg font-bold tracking-tight text-[var(--text)] transition-colors group-hover:text-[var(--accent-light)]">
                                        {entry.title}
                                    </h3>

                                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[var(--text-muted)]">
                                        {entry.summary}
                                    </p>

                                    {entry.highlights &&
                                        entry.highlights.length > 0 && (
                                            <div className="mt-4 space-y-1.5">
                                                {entry.highlights
                                                    .slice(0, 2)
                                                    .map((h, i) => (
                                                        <div
                                                            key={i}
                                                            className="flex items-start gap-2 text-xs text-[var(--text-muted)]"
                                                        >
                                                            <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-[var(--accent-light)]" />
                                                            <span className="line-clamp-1">
                                                                {h}
                                                            </span>
                                                        </div>
                                                    ))}
                                            </div>
                                        )}
                                </div>

                                <div className="mt-6 flex items-center gap-1 text-xs font-semibold text-[var(--accent-light)]">
                                    <span>Read release notes</span>
                                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                                </div>
                            </Link>
                        </ScrollReveal>
                    ))}
                </div>

                <div className="mt-8 text-center sm:hidden">
                    <Link
                        href="/changelog"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent-light)]"
                    >
                        <span>View all updates in Changelog</span>
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
