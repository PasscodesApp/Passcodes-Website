"use client";

import {
    Download,
    Calendar,
    ExternalLink,
    AlertTriangle,
    Search,
    ArrowRight,
} from "lucide-react";
import { ArchDownload } from "@/components/downloads/ArchDownload";
import {
    classifyRelease,
    isYankedRelease,
    isDeprecatedRelease,
} from "@/hooks/useGithubRelease";
import type { GithubRelease } from "@/types/github";
import Link from "next/link";
import { formatDate, formatNumber } from "@passcodes/passalgo";
import { getChangelogEntryByTagName } from "@/lib/changelog";

export function ReleaseList({
    releases,
    onResetFilters,
}: {
    releases: GithubRelease[];
    onResetFilters?: () => void;
}) {
    if (releases.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-[var(--border)] p-10 text-center">
                <Search
                    className="mx-auto mb-3 h-8 w-8 text-[var(--text-dim)] opacity-50"
                    aria-hidden="true"
                />
                <p className="text-base font-semibold text-[var(--text)]">
                    No releases match your filter
                </p>
                <p className="mt-1 text-xs text-[var(--text-muted)] max-w-sm mx-auto">
                    Try adjusting your search query or channel filter to view available builds.
                </p>
                {onResetFilters && (
                    <button
                        type="button"
                        onClick={onResetFilters}
                        className="mt-4 inline-flex items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--card-bg)] px-3.5 py-1.5 text-xs font-semibold text-[var(--text)] transition-colors hover:bg-[var(--card-bg-hover)]"
                    >
                        Reset filters
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="mx-auto grid max-w-3xl gap-4">
            {releases.map((release) => {
                const totalDownloads = release.assets.reduce(
                    (sum, a) => sum + a.download_count,
                    0
                );
                const channel = classifyRelease(release);
                const isYanked = isYankedRelease(release);
                const isDeprecated = isDeprecatedRelease(release);
                const changelogEntry = getChangelogEntryByTagName(release.tag_name);

                return (
                    <div
                        key={release.id}
                        className={`release-card ${isDeprecated ? "deprecated" : ""}`}
                    >
                        <div className="release-top">
                            <div className="min-w-0">
                                <h3 className="flex flex-wrap items-center gap-2">
                                    <span className="truncate">
                                        {release.name || release.tag_name}
                                    </span>
                                    {isDeprecated && (
                                        <span className="tag deprecated shrink-0">
                                            Deprecated
                                        </span>
                                    )}
                                    {isYanked && (
                                        <span className="tag border-amber-500/40 bg-amber-500/10 font-semibold text-amber-600 dark:text-amber-400 shrink-0">
                                            Yanked
                                        </span>
                                    )}
                                    <span className={`tag ${channel} shrink-0`}>
                                        {channel === "stable" ? "Stable" : channel === "beta" ? "Beta" : "Alpha"}
                                    </span>
                                </h3>
                                <p className="release-date flex items-center gap-1.5">
                                    <Calendar
                                        className="h-3.5 w-3.5 text-[var(--text-dim)]"
                                        aria-hidden="true"
                                    />
                                    <span>
                                        {formatDate(release.published_at)}
                                    </span>
                                </p>
                            </div>
                            <span className="release-download-count">
                                <Download
                                    className="mr-1 inline h-3 w-3"
                                    aria-hidden="true"
                                />
                                {formatNumber(totalDownloads)}
                            </span>
                        </div>

                        {isDeprecated && (
                            <div className="mt-3 rounded-lg border border-red-500/25 bg-red-500/5 p-2.5 text-xs leading-relaxed text-red-700 dark:text-red-300">
                                <div className="flex items-center gap-1.5 font-semibold text-red-600 dark:text-red-400">
                                    <AlertTriangle
                                        className="h-3.5 w-3.5 shrink-0"
                                        aria-hidden="true"
                                    />
                                    <span>Deprecated Release</span>
                                </div>
                                <p className="mt-1 text-[var(--text-muted)]">
                                    This release is no longer supported.
                                    Superseded by the newer database
                                    architecture introduced in later releases.
                                    Please use a current release instead.
                                </p>
                            </div>
                        )}

                        {isYanked && (
                            <div className="mt-3 rounded-lg border border-amber-500/25 bg-amber-500/5 p-2.5 text-xs leading-relaxed text-amber-700 dark:text-amber-300">
                                <div className="flex items-center gap-1.5 font-semibold text-amber-600 dark:text-amber-400">
                                    <AlertTriangle
                                        className="h-3.5 w-3.5 shrink-0"
                                        aria-hidden="true"
                                    />
                                    <span>Yanked Release</span>
                                </div>
                                <p className="mt-1 text-[var(--text-muted)]">
                                    This release was withdrawn from active distribution.
                                    Preserved for documentation and project history only.
                                </p>
                            </div>
                        )}

                        <div className="release-actions mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--border-light)] pt-3">
                            {isYanked ? (
                                <span className="text-xs text-[var(--text-dim)] italic">
                                    Downloads withdrawn for this release
                                </span>
                            ) : (
                                <ArchDownload
                                    assets={release.assets}
                                    variant="compact"
                                />
                            )}
                            <div className="flex items-center gap-2">
                                <Link
                                    href={
                                        changelogEntry
                                            ? `/changelog/${changelogEntry.slug}`
                                            : "/changelog"
                                    }
                                    className="inline-flex items-center gap-1 text-xs font-medium text-[var(--accent-light)] transition-opacity hover:opacity-80"
                                >
                                    <span>Project Updates</span>
                                    <ArrowRight className="h-3 w-3" aria-hidden="true" />
                                </Link>
                                <Link
                                    href={release.html_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-ghost btn-small"
                                    aria-label="View release notes on GitHub"
                                >
                                    <ExternalLink className="h-3.5 w-3.5" />
                                    <span className="hidden sm:inline">GitHub</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
