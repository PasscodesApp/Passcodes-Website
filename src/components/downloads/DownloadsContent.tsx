"use client";

import { useMemo, useState } from "react";
import { Search, XCircle, AlertTriangle, Cpu, Layers, ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { DeviceWarning } from "@/components/downloads/DeviceWarning";
import { DownloadCard } from "@/components/downloads/DownloadCard";
import { ReleaseList } from "@/components/downloads/ReleaseList";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import {
    useReleases,
    isRateLimitError,
    getLatestStableRelease,
    classifyRelease,
    isYankedRelease,
    isDeprecatedRelease,
} from "@/hooks/useGithubRelease";
import {
    KOMI_STORE_URL,
    KOMI_BADGE_SRC,
    KOMI_BADGE_WEBP,
    USER_GUIDE_URL,
} from "@/lib/constants";
import Link from "next/link";

type FilterChannel =
    | "all"
    | "stable"
    | "beta"
    | "alpha"
    | "deprecated"
    | "yanked";

const FILTER_CHANNELS: { id: FilterChannel; label: string }[] = [
    { id: "all", label: "All Releases" },
    { id: "stable", label: "Stable" },
    { id: "beta", label: "Beta" },
    { id: "alpha", label: "Alpha" },
    { id: "deprecated", label: "Deprecated" },
    { id: "yanked", label: "Yanked" },
];

const CHANNEL_EXPLANATIONS: Record<FilterChannel, string> = {
    all: "Displaying all recorded releases across active, preview, and historical channels.",
    stable: "Verified production releases thoroughly tested and recommended for general use.",
    beta: "Pre-release builds for testing upcoming features and bug fixes before production.",
    alpha: "Early preview builds containing experimental features and rapid architectural changes.",
    deprecated: "Legacy releases (v1.x and v2.x) superseded by the modern v3 database architecture.",
    yanked: "Releases withdrawn from active distribution due to known issues; preserved for historical records.",
};

function KomiSection() {
    const [badgeFailed, setBadgeFailed] = useState(false);
    return (
        <section className="store-section">
            <div className="mb-2 flex items-center justify-center gap-2">
                <Layers className="h-4 w-4 text-[var(--accent-light)]" />
                <h2 className="text-base font-semibold tracking-tight text-[var(--text)]">
                    Alternative Distribution
                </h2>
            </div>
            <p>
                Prefer an alternative package source? You can also install
                Passcodes from the Komi Store.
            </p>
            {badgeFailed ? (
                <Link
                    href={KOMI_STORE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-filled"
                >
                    Get on Komi Store
                </Link>
            ) : (
                <Link
                    href={KOMI_STORE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="store-badge"
                    aria-label="Get it on Komi Store"
                >
                    <picture>
                        <source type="image/webp" srcSet={KOMI_BADGE_WEBP} />
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={KOMI_BADGE_SRC}
                            alt="Get it on Komi Store"
                            width={287}
                            height={144}
                            loading="lazy"
                            decoding="async"
                            onError={() => setBadgeFailed(true)}
                        />
                    </picture>
                </Link>
            )}
        </section>
    );
}

export function DownloadsContent() {
    const {
        data: releases,
        isLoading,
        error,
    } = useReleases();
    const [query, setQuery] = useState("");
    const [status, setStatus] = useState<FilterChannel>("all");

    const latestRelease = useMemo(
        () => (releases ? getLatestStableRelease(releases) : undefined),
        [releases]
    );

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return (releases ?? []).filter((r) => {
            const isDep = isDeprecatedRelease(r);
            const isYank = isYankedRelease(r);
            const channel = classifyRelease(r);

            const matchQ =
                !q ||
                (r.name || "").toLowerCase().includes(q) ||
                r.tag_name.toLowerCase().includes(q) ||
                (r.body || "").toLowerCase().includes(q) ||
                channel.includes(q) ||
                (isDep && "deprecated".includes(q)) ||
                (isYank && "yanked".includes(q));

            const matchS = (() => {
                if (status === "all") return true;
                if (status === "deprecated") return isDep;
                if (status === "yanked") return isYank;
                if (status === "stable")
                    return channel === "stable" && !isDep && !isYank;
                if (status === "beta") return channel === "beta" && !isYank;
                if (status === "alpha") return channel === "alpha" && !isYank;
                return channel === status;
            })();

            return matchQ && matchS;
        });
    }, [releases, query, status]);

    const hasError = !!error;
    const isRateLimited = isRateLimitError(error);
    const hasControls = query.trim() !== "" || status !== "all";

    return (
        <div className="px-4 py-12 sm:px-6 sm:py-16">
            <div className="mx-auto max-w-4xl">
                {/* 1. Header & Technical Subtitle */}
                <ScrollReveal delay={0}>
                    <SectionHeader
                        as="h1"
                        badge="Verified Binaries"
                        title="Downloads & Releases"
                        subtitle="Verified, privacy-first Android builds with optimized packages for your device architecture. Always free and open source."
                    />
                    <DeviceWarning />
                </ScrollReveal>

                {hasError && (
                    <div
                        className="alert-danger mb-8 flex items-start gap-3 rounded-2xl p-4"
                        role="alert"
                    >
                        <AlertTriangle
                            className="mt-0.5 h-5 w-5 shrink-0 text-[#ef4444]"
                            aria-hidden="true"
                        />
                        <div>
                            <p className="text-sm font-semibold">
                                {isRateLimited
                                    ? "GitHub API rate limit reached"
                                    : "Unable to fetch release information"}
                            </p>
                            <p className="mt-1 text-sm text-[var(--text-muted)]">
                                {isRateLimited
                                    ? "Please try again in a few minutes. You can still download directly from GitHub."
                                    : "Please check your connection or try again later."}
                            </p>
                        </div>
                    </div>
                )}

                {isLoading ? (
                    <LoadingSpinner label="Fetching latest release..." />
                ) : (
                    latestRelease && (
                        <ScrollReveal delay={60}>
                            <div className="mb-12">
                                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                                    <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--accent-light)]">
                                        <Cpu className="h-4 w-4" aria-hidden="true" />
                                        <span>
                                            Recommended Production Build
                                        </span>
                                    </h2>
                                    <Link
                                        href="/changelog"
                                        className="inline-flex items-center gap-1 text-xs font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--accent-light)]"
                                    >
                                        <span>Release notes &amp; milestones</span>
                                        <ArrowRight className="h-3 w-3" aria-hidden="true" />
                                    </Link>
                                </div>
                                <DownloadCard
                                    release={latestRelease}
                                    isLatest
                                />
                                <p className="mt-3 text-center text-xs text-[var(--text-muted)]">
                                    First time installing an Android APK? Follow our{" "}
                                    <Link
                                        href={USER_GUIDE_URL}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="font-medium text-[var(--accent-light)] underline hover:no-underline"
                                    >
                                        Installation &amp; Setup Guide
                                    </Link>
                                    .
                                </p>
                            </div>
                        </ScrollReveal>
                    )
                )}

                {/* 3. Alternative Distribution */}
                <ScrollReveal delay={100}>
                    <KomiSection />
                </ScrollReveal>

                {/* 4. Release Archive Group */}
                <ScrollReveal delay={140}>
                    <div className="mt-14">
                        <div className="mb-6 text-center">
                            <h2 className="section-title text-xl sm:text-2xl">
                                Release History & Archives
                            </h2>
                            <p className="mt-1 text-sm text-[var(--text-muted)]">
                                Browse previous production releases,
                                architecture packages, and change manifests.
                            </p>
                        </div>

                        <div className="release-search">
                            <div className="relative w-full max-w-[420px]">
                                <Search
                                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-dim)]"
                                    aria-hidden="true"
                                />
                                <input
                                    type="search"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search by version or notes…"
                                    aria-label="Search releases"
                                    className="w-full"
                                />
                                {query && (
                                    <button
                                        type="button"
                                        onClick={() => setQuery("")}
                                        aria-label="Clear search"
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-[var(--text-dim)] transition-colors hover:text-[var(--text)]"
                                    >
                                        <XCircle
                                            className="h-4 w-4"
                                            aria-hidden="true"
                                        />
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="release-filters">
                            {FILTER_CHANNELS.map((item) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    className={`filter-btn ${status === item.id ? "active" : ""}`}
                                    onClick={() => setStatus(item.id)}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>

                        <p className="mb-4 text-center text-xs text-[var(--text-dim)]">
                            {CHANNEL_EXPLANATIONS[status]}
                        </p>

                        {hasControls && (
                            <p className="mb-5 text-center text-sm text-[var(--text-muted)]">
                                Showing{" "}
                                <strong className="text-[var(--text)]">
                                    {filtered.length}
                                </strong>{" "}
                                {filtered.length === 1 ? "release" : "releases"}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setQuery("");
                                        setStatus("all");
                                    }}
                                    className="ml-2 font-medium"
                                    style={{ color: "var(--accent-light)" }}
                                >
                                    Clear
                                </button>
                            </p>
                        )}

                        {isLoading ? (
                            <LoadingSpinner label="Loading release archive..." />
                        ) : (
                            <ReleaseList
                                releases={filtered}
                                onResetFilters={() => {
                                    setQuery("");
                                    setStatus("all");
                                }}
                            />
                        )}
                    </div>
                </ScrollReveal>
            </div>
        </div>
    );
}
