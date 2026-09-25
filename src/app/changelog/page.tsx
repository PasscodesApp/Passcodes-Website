"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
    Search,
    X,
    ExternalLink,
    ArrowRight,
    Calendar,
    GitCommit,
    AlertTriangle,
    Layers,
    Filter,
} from "lucide-react";
import {
    CHANGELOG_ENTRIES,
    CHANGELOG_CATEGORIES,
    RELEASE_CHANNEL_FILTERS,
    isDeprecatedEntry,
    getLatestProductionRelease,
    getRecentUpdates,
    getProjectMilestones,
    matchesReleaseSearch,
    type CategoryFilter,
    type ReleaseChannelFilter,
} from "@/lib/changelog";
import { GITHUB_RELEASES_URL, DOCS_RELEASE_NOTES_URL } from "@/lib/constants";
import { ReleaseVisual } from "@/components/visuals/ReleaseVisual";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { CurrentReleaseHero } from "@/components/changelog/CurrentReleaseHero";
import { RecentUpdatesGrid } from "@/components/changelog/RecentUpdatesGrid";
import { MilestonesSection } from "@/components/changelog/MilestonesSection";
import { formatDate } from "@passcodes/passalgo";
import { cn } from "@/lib/utils";

export default function ChangelogPage() {
    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState<CategoryFilter>("All");
    const [activeChannel, setActiveChannel] =
        useState<ReleaseChannelFilter>("All");

    const latestProduction = useMemo(() => getLatestProductionRelease(), []);
    const recentUpdates = useMemo(() => getRecentUpdates(3), []);
    const projectMilestones = useMemo(() => getProjectMilestones(), []);

    const filteredEntries = useMemo(() => {
        return CHANGELOG_ENTRIES.filter((entry) => {
            // Category filter
            const matchesCategory =
                activeCategory === "All" || entry.category === activeCategory;
            if (!matchesCategory) return false;

            // Channel filter
            if (activeChannel !== "All") {
                const isDep = isDeprecatedEntry(entry);
                const isYank = !!entry.isYanked;
                const isMs = !!entry.isMilestone;

                if (activeChannel === "Milestones" && !isMs) return false;
                if (activeChannel === "Deprecated" && !isDep) return false;
                if (activeChannel === "Yanked" && !isYank) return false;
                if (
                    activeChannel === "Stable" &&
                    (entry.releaseType !== "Stable" || isDep || isYank || isMs)
                ) {
                    return false;
                }
                if (
                    activeChannel === "Beta" &&
                    (entry.releaseType !== "Beta" || isYank || isMs)
                ) {
                    return false;
                }
                if (
                    activeChannel === "Alpha" &&
                    (entry.releaseType !== "Alpha" || isYank || isMs)
                ) {
                    return false;
                }
            }

            // Search query across version, title, summary, highlights, technical details, release states
            return matchesReleaseSearch(entry, search);
        });
    }, [search, activeCategory, activeChannel]);

    const isFilterActive =
        search.trim().length > 0 ||
        activeCategory !== "All" ||
        activeChannel !== "All";

    const handleResetFilters = () => {
        setSearch("");
        setActiveCategory("All");
        setActiveChannel("All");
    };

    return (
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-20 space-y-16">
            {/* 1. Editorial Header */}
            <ScrollReveal delay={0}>
                <div className="border-b border-[var(--border-light)] pb-10">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <span className="editorial-badge mb-3 border border-[var(--border-light)] bg-[var(--card-bg)] text-[var(--accent-light)]">
                                Release Highlights
                            </span>
                            <h1 className="section-heading">
                                Release Highlights &amp; Milestones
                            </h1>
                            <p className="section-subheading max-w-2xl">
                                Curated milestones, architecture transitions, and
                                feature updates across Passcodes releases. Complete
                                historical notes and tags are maintained in our official
                                documentation and GitHub releases.
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2.5 text-xs text-[var(--text-muted)]">
                            <Link
                                href={GITHUB_RELEASES_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-light)] bg-[var(--card-bg)] px-3 py-1.5 transition-colors hover:border-[var(--border)] hover:text-[var(--text)]"
                            >
                                <GitCommit className="h-3.5 w-3.5" aria-hidden="true" />
                                <span>GitHub Tags</span>
                                <ExternalLink className="h-3 w-3 opacity-60" aria-hidden="true" />
                            </Link>
                            <Link
                                href={DOCS_RELEASE_NOTES_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-light)] bg-[var(--card-bg)] px-3 py-1.5 transition-colors hover:border-[var(--border)] hover:text-[var(--text)]"
                            >
                                <span>Docs Notes</span>
                                <ExternalLink className="h-3 w-3 opacity-60" aria-hidden="true" />
                            </Link>
                        </div>
                    </div>

                    {/* Quick navigation anchor bar */}
                    <div className="mt-8 flex flex-wrap items-center gap-2 border-t border-[var(--border-lighter)] pt-4 text-xs">
                        <span className="font-semibold text-[var(--text-dim)]">Jump to:</span>
                        <a
                            href="#current-release"
                            className="rounded-md border border-[var(--border-light)] bg-[var(--card-bg)] px-2.5 py-1 text-[var(--text-muted)] transition-colors hover:border-[var(--border)] hover:text-[var(--text)]"
                        >
                            Current Production
                        </a>
                        <a
                            href="#recent-updates"
                            className="rounded-md border border-[var(--border-light)] bg-[var(--card-bg)] px-2.5 py-1 text-[var(--text-muted)] transition-colors hover:border-[var(--border)] hover:text-[var(--text)]"
                        >
                            Recent Updates
                        </a>
                        <a
                            href="#milestones"
                            className="rounded-md border border-[var(--border-light)] bg-[var(--card-bg)] px-2.5 py-1 text-[var(--text-muted)] transition-colors hover:border-[var(--border)] hover:text-[var(--text)]"
                        >
                            Architecture Milestones
                        </a>
                        <a
                            href="#archive"
                            className="rounded-md border border-[var(--border-light)] bg-[var(--card-bg)] px-2.5 py-1 text-[var(--text-muted)] transition-colors hover:border-[var(--border)] hover:text-[var(--text)]"
                        >
                            Full Release Archive
                        </a>
                    </div>
                </div>
            </ScrollReveal>

            {/* 2. Featured Current Production Release */}
            {latestProduction && (
                <div id="current-release" className="scroll-mt-24">
                    <ScrollReveal delay={30}>
                        <CurrentReleaseHero release={latestProduction} />
                    </ScrollReveal>
                </div>
            )}

            {/* 3. Recent Updates */}
            {recentUpdates.length > 0 && (
                <div id="recent-updates" className="scroll-mt-24">
                    <ScrollReveal delay={50}>
                        <RecentUpdatesGrid entries={recentUpdates} />
                    </ScrollReveal>
                </div>
            )}

            {/* 4. Major Architectural Milestones */}
            {projectMilestones.length > 0 && (
                <div id="milestones" className="scroll-mt-24">
                    <ScrollReveal delay={60}>
                        <MilestonesSection milestones={projectMilestones} />
                    </ScrollReveal>
                </div>
            )}

            {/* 5. Historical Release Archive & Timeline */}
            <div id="archive" className="scroll-mt-24 pt-6 border-t border-[var(--border-light)]">
                <ScrollReveal delay={70}>
                    <div className="mb-8">
                        <span className="editorial-badge mb-2 border border-[var(--border-light)] bg-[var(--card-bg)] text-[var(--accent-light)]">
                            Release Archive
                        </span>
                        <h2 className="text-2xl font-bold tracking-tight text-[var(--text)] sm:text-3xl">
                            Full Release History &amp; Timeline
                        </h2>
                        <p className="mt-1.5 text-sm text-[var(--text-muted)] sm:text-base">
                            Explore the complete chronological stream of production builds, preview releases, and archived tags.
                        </p>
                    </div>

                    {/* Filter and Search Controls */}
                    <div className="mb-8 space-y-4 rounded-xl border border-[var(--border-light)] bg-[var(--card-bg)] p-4 sm:p-5">
                        {/* Top row: Search input & summary */}
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="relative w-full sm:max-w-md">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-dim)]" aria-hidden="true" />
                                <input
                                    type="text"
                                    placeholder="Filter updates by version, keyword, state, or build..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full rounded-lg border border-[var(--border-light)] bg-[var(--card-bg-solid)] py-2 pl-9 pr-8 text-sm text-[var(--text)] placeholder-[var(--text-dim)] outline-none transition-colors focus:border-[var(--accent-light)]"
                                    aria-label="Search changelog entries"
                                />
                                {search && (
                                    <button
                                        type="button"
                                        onClick={() => setSearch("")}
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-dim)] hover:text-[var(--text)]"
                                        aria-label="Clear search"
                                    >
                                        <X className="h-3.5 w-3.5" aria-hidden="true" />
                                    </button>
                                )}
                            </div>

                            <div className="flex items-center justify-between gap-3 text-xs text-[var(--text-muted)]">
                                <span>
                                    Showing <strong className="text-[var(--text)]">{filteredEntries.length}</strong> of {CHANGELOG_ENTRIES.length} entries
                                </span>
                                {isFilterActive && (
                                    <button
                                        type="button"
                                        onClick={handleResetFilters}
                                        className="font-medium text-[var(--accent-light)] hover:underline"
                                    >
                                        Clear active filters
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Middle row: Category Filters */}
                        <div className="border-t border-[var(--border-lighter)] pt-3">
                            <div className="mb-2 text-xs font-semibold text-[var(--text-dim)]">
                                Categories:
                            </div>
                            <div
                                className="flex flex-wrap gap-1.5"
                                role="tablist"
                                aria-label="Changelog categories"
                            >
                                {CHANGELOG_CATEGORIES.map((cat) => {
                                    const isSelected = activeCategory === cat;
                                    return (
                                        <button
                                            key={cat}
                                            role="tab"
                                            aria-selected={isSelected}
                                            onClick={() => setActiveCategory(cat)}
                                            className={cn(
                                                "rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-150",
                                                isSelected
                                                    ? "bg-[var(--text)] font-semibold text-[var(--primary-dark)] shadow-sm"
                                                    : "border border-[var(--border-light)] bg-[var(--card-bg-solid)] text-[var(--text-muted)] hover:bg-[var(--card-bg-hover)] hover:text-[var(--text)]"
                                            )}
                                        >
                                            {cat}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Bottom row: Release Channel / State Filters */}
                        <div className="border-t border-[var(--border-lighter)] pt-3">
                            <div className="mb-2 text-xs font-semibold text-[var(--text-dim)]">
                                Release State &amp; Channel:
                            </div>
                            <div className="flex flex-wrap gap-1.5" aria-label="Filter by release channel">
                                {RELEASE_CHANNEL_FILTERS.map((channel) => {
                                    const isSelected = activeChannel === channel;
                                    return (
                                        <button
                                            key={channel}
                                            type="button"
                                            aria-pressed={isSelected}
                                            onClick={() => setActiveChannel(channel)}
                                            className={cn(
                                                "rounded-lg px-2.5 py-1 text-xs font-medium transition-all duration-150",
                                                isSelected
                                                    ? "border border-[var(--accent-light)] bg-[var(--accent-subtle)] text-[var(--accent-light)] font-semibold"
                                                    : "border border-[var(--border-light)] bg-[var(--card-bg-solid)] text-[var(--text-dim)] hover:text-[var(--text)]"
                                            )}
                                        >
                                            {channel}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </ScrollReveal>

                {/* 6. Release Timeline Stream */}
                {filteredEntries.length === 0 ? (
                    <div className="rounded-2xl border border-[var(--border-light)] bg-[var(--card-bg)] p-12 text-center">
                        <p className="text-base font-medium text-[var(--text)]">
                            No updates match your filter
                        </p>
                        <p className="mt-1 text-sm text-[var(--text-muted)]">
                            Try clearing your search query or selecting &quot;All&quot; categories.
                        </p>
                        <button
                            type="button"
                            onClick={handleResetFilters}
                            className="btn btn-outline btn-small mt-4"
                        >
                            Reset Filters
                        </button>
                    </div>
                ) : (
                    <div className="relative space-y-12">
                        {filteredEntries.map((entry, index) => {
                            const isLatest =
                                index === 0 &&
                                activeCategory === "All" &&
                                activeChannel === "All" &&
                                !search;

                            if (entry.isMilestone) {
                                return (
                                    <ScrollReveal
                                        key={entry.slug}
                                        delay={Math.min(index * 30, 150)}
                                        distance={16}
                                    >
                                        <div className="relative overflow-hidden rounded-2xl border border-[var(--accent-border)] bg-gradient-to-r from-[var(--card-bg)] via-[var(--accent-subtle)]/30 to-[var(--card-bg)] p-6 sm:p-8">
                                            <div className="mb-3 flex flex-wrap items-center gap-2.5">
                                                <span className="editorial-badge border-[var(--accent-light)]/40 bg-[var(--accent-light)]/15 font-semibold text-[var(--accent-light)]">
                                                    Architecture Milestone
                                                </span>
                                                <span className="font-mono text-xs text-[var(--text-dim)]">
                                                    {formatDate(entry.date)}
                                                </span>
                                            </div>

                                            <h2 className="text-xl font-bold tracking-tight text-[var(--text)] sm:text-2xl">
                                                <Link
                                                    href={`/changelog/${entry.slug}`}
                                                    className="transition-colors hover:text-[var(--accent-light)]"
                                                >
                                                    {entry.title}
                                                </Link>
                                            </h2>

                                            <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)] sm:text-base">
                                                {entry.summary}
                                            </p>

                                            {entry.highlights &&
                                                entry.highlights.length > 0 && (
                                                    <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
                                                        {entry.highlights.map(
                                                            (h, hIdx) => (
                                                                <div
                                                                    key={hIdx}
                                                                    className="flex items-start gap-2.5 text-xs text-[var(--text-muted)] sm:text-sm"
                                                                >
                                                                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent-light)]" />
                                                                    <span className="leading-relaxed">
                                                                        {h}
                                                                    </span>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                )}

                                            <div className="mt-6">
                                                <Link
                                                    href={`/changelog/${entry.slug}`}
                                                    aria-label={`Read architectural overview for ${entry.title}`}
                                                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--accent-light)] transition-all hover:gap-2"
                                                >
                                                    <span>
                                                        Read architectural overview
                                                    </span>
                                                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                                                </Link>
                                            </div>
                                        </div>
                                    </ScrollReveal>
                                );
                            }

                            const isDeprecated = isDeprecatedEntry(entry);

                            return (
                                <ScrollReveal
                                    key={entry.slug}
                                    delay={Math.min(index * 30, 150)}
                                    distance={16}
                                >
                                    <article
                                        className={cn(
                                            "relative grid gap-6 border-b border-[var(--border-light)] pb-12 sm:grid-cols-12 sm:gap-8",
                                            isDeprecated && "opacity-95"
                                        )}
                                    >
                                        {/* Left Column: Metadata & Category Node */}
                                        <div className="sm:col-span-4 lg:col-span-3">
                                            <div className="sticky top-24 flex flex-col gap-2.5">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    {isDeprecated && (
                                                        <span className="tag deprecated">
                                                            Deprecated
                                                        </span>
                                                    )}
                                                    {entry.isYanked ? (
                                                        <span className="tag border-amber-500/40 bg-amber-500/10 font-semibold text-amber-600 dark:text-amber-400">
                                                            Yanked
                                                        </span>
                                                    ) : (
                                                        <span
                                                            className={cn(
                                                                "tag",
                                                                entry.releaseType ===
                                                                    "Stable" &&
                                                                    "tag stable",
                                                                entry.releaseType ===
                                                                    "Beta" &&
                                                                    "tag beta",
                                                                entry.releaseType ===
                                                                    "Alpha" &&
                                                                    "tag alpha"
                                                            )}
                                                        >
                                                            {entry.releaseType}
                                                        </span>
                                                    )}
                                                    {isLatest && (
                                                        <span className="editorial-badge border-[var(--accent-light)]/30 bg-[var(--accent-light)]/15 border text-[var(--accent-light)]">
                                                            Latest
                                                        </span>
                                                    )}
                                                    {entry.isMajor && !isLatest && (
                                                        <span className="editorial-badge border-[var(--border-light)] bg-[var(--card-bg)] text-[var(--text-muted)]">
                                                            Major
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className={cn(
                                                            "font-mono text-sm font-bold",
                                                            isDeprecated
                                                                ? "text-red-500 dark:text-red-400"
                                                                : "text-[var(--text)]"
                                                        )}
                                                    >
                                                        {entry.version}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-1.5 text-xs text-[var(--text-dim)]">
                                                    <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                                                    <time dateTime={entry.date}>
                                                        {formatDate(entry.date)}
                                                    </time>
                                                </div>

                                                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[var(--text-muted)]">
                                                    <span className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border-light)] bg-[var(--card-bg)] px-2.5 py-1">
                                                        <ReleaseVisual
                                                            category={
                                                                entry.category
                                                            }
                                                            className="h-3.5 w-3.5"
                                                        />
                                                        <span>
                                                            {entry.category}
                                                        </span>
                                                    </span>
                                                </div>

                                                {entry.internalDetails && (
                                                    <div className="mt-1 font-mono text-[11px] text-[var(--text-dim)] space-y-0.5">
                                                        {entry.internalDetails.expoSdk && (
                                                            <div>Expo SDK {entry.internalDetails.expoSdk}</div>
                                                        )}
                                                        {entry.internalDetails.minAndroid && (
                                                            <div>Android {entry.internalDetails.minAndroid.split(" ")[0]}+</div>
                                                        )}
                                                    </div>
                                                )}

                                                {entry.githubUrl && (
                                                    <div className="mt-2 border-t border-[var(--border-light)] pt-2">
                                                        <Link
                                                            href={entry.githubUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1 text-xs text-[var(--text-dim)] transition-colors hover:text-[var(--accent-light)]"
                                                        >
                                                            <span>
                                                                GitHub Release
                                                            </span>
                                                            <ExternalLink className="h-3 w-3" aria-hidden="true" />
                                                        </Link>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Right Column: Editorial Summary & Highlights */}
                                        <div className="sm:col-span-8 lg:col-span-9">
                                            <h2 className="text-xl font-bold tracking-tight text-[var(--text)] sm:text-2xl">
                                                <Link
                                                    href={`/changelog/${entry.slug}`}
                                                    className="transition-colors hover:text-[var(--accent-light)]"
                                                >
                                                    {entry.title}
                                                </Link>
                                            </h2>

                                            {isDeprecated && (
                                                <div className="mt-3 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs leading-relaxed text-red-700 dark:text-red-300">
                                                    <div className="flex items-center gap-1.5 font-semibold text-red-600 dark:text-red-400">
                                                        <AlertTriangle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                                                        <span>Deprecated Release</span>
                                                    </div>
                                                    <p className="mt-1 text-[var(--text-muted)]">
                                                        {entry.deprecatedReason ||
                                                            "This release is no longer supported. Superseded by the newer database architecture introduced in later releases. Please use a current release instead."}
                                                    </p>
                                                </div>
                                            )}

                                            {entry.isYanked && entry.yankedReason && (
                                                <div className="mt-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs leading-relaxed text-amber-700 dark:text-amber-300">
                                                    <span className="font-semibold">Release Notice: </span>
                                                    {entry.yankedReason}
                                                </div>
                                            )}

                                            <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)] sm:text-base">
                                                {entry.summary}
                                            </p>

                                            {/* Highlights Bullet List */}
                                            {entry.highlights &&
                                                entry.highlights.length > 0 && (
                                                    <div className="mt-5 space-y-2.5">
                                                        {entry.highlights.map(
                                                            (highlight, hIdx) => (
                                                                <div
                                                                    key={hIdx}
                                                                    className="flex items-start gap-2.5 text-sm text-[var(--text-muted)]"
                                                                >
                                                                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent-light)]" />
                                                                    <span className="leading-relaxed">
                                                                        {highlight}
                                                                    </span>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                )}

                                            {/* Link to detail page */}
                                            <div className="mt-6 flex flex-wrap items-center gap-4">
                                                <Link
                                                    href={`/changelog/${entry.slug}`}
                                                    aria-label={`Read full release notes for ${entry.version}`}
                                                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--accent-light)] transition-all hover:gap-2"
                                                >
                                                    <span>
                                                        Read full release notes
                                                    </span>
                                                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                                                </Link>
                                            </div>
                                        </div>
                                    </article>
                                </ScrollReveal>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
