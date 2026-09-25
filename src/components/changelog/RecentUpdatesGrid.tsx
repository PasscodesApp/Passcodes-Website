import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import type { ChangelogEntry } from "@/lib/changelog";
import { ReleaseVisual } from "@/components/visuals/ReleaseVisual";
import { formatDate } from "@passcodes/passalgo";
import { cn } from "@/lib/utils";

interface RecentUpdatesGridProps {
    entries: ChangelogEntry[];
}

export function RecentUpdatesGrid({ entries }: RecentUpdatesGridProps) {
    if (entries.length === 0) return null;

    return (
        <section aria-labelledby="recent-updates-heading" className="space-y-6">
            <div>
                <span className="editorial-badge mb-2 border border-[var(--border-light)] bg-[var(--card-bg)] text-[var(--accent-light)]">
                    What&apos;s New
                </span>
                <h2
                    id="recent-updates-heading"
                    className="text-2xl font-bold tracking-tight text-[var(--text)] sm:text-3xl"
                >
                    Recent Updates
                </h2>
                <p className="mt-1.5 text-sm text-[var(--text-muted)] sm:text-base">
                    The latest stable releases, iterative improvements, and maintenance builds.
                </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {entries.map((entry) => (
                    <div
                        key={entry.slug}
                        className="subtle-card group flex h-full flex-col justify-between transition-all hover:border-[var(--accent-border)] hover:shadow-sm"
                    >
                        <div>
                            {/* Card Top: Channel, Date, Category */}
                            <div className="mb-3.5 flex items-center justify-between gap-2">
                                <div className="flex flex-wrap items-center gap-1.5">
                                    <span
                                        className={cn(
                                            "tag",
                                            entry.releaseType === "Stable" && "tag stable",
                                            entry.releaseType === "Beta" && "tag beta",
                                            entry.releaseType === "Alpha" && "tag alpha"
                                        )}
                                    >
                                        {entry.releaseType}
                                    </span>
                                    <span className="font-mono text-xs font-semibold text-[var(--accent-light)]">
                                        {entry.version}
                                    </span>
                                </div>

                                <div className="rounded-md border border-[var(--border-light)] bg-[var(--card-bg)] p-1">
                                    <ReleaseVisual
                                        category={entry.category}
                                        className="h-3.5 w-3.5"
                                    />
                                </div>
                            </div>

                            {/* Date */}
                            <div className="mb-2 flex items-center gap-1 text-[11px] text-[var(--text-dim)]">
                                <Calendar className="h-3 w-3" aria-hidden="true" />
                                <time dateTime={entry.date}>
                                    {formatDate(entry.date)}
                                </time>
                            </div>

                            {/* Title */}
                            <h3 className="text-base font-bold tracking-tight text-[var(--text)] transition-colors group-hover:text-[var(--accent-light)]">
                                <Link href={`/changelog/${entry.slug}`}>
                                    {entry.title}
                                </Link>
                            </h3>

                            {/* Summary */}
                            <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[var(--text-muted)]">
                                {entry.summary}
                            </p>

                            {/* Highlights Preview */}
                            {entry.highlights && entry.highlights.length > 0 && (
                                <ul className="mt-3 space-y-1.5 border-t border-[var(--border-lighter)] pt-2.5">
                                    {entry.highlights.slice(0, 2).map((h, i) => (
                                        <li
                                            key={i}
                                            className="flex items-start gap-2 text-[11px] text-[var(--text-dim)]"
                                        >
                                            <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-[var(--accent-light)]" />
                                            <span className="line-clamp-1">{h}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Card Footer Link */}
                        <div className="mt-4 pt-3 border-t border-[var(--border-light)]">
                            <Link
                                href={`/changelog/${entry.slug}`}
                                className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--accent-light)] transition-all hover:gap-1.5"
                            >
                                <span>Read release notes</span>
                                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
