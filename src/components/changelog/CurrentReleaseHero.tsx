import Link from "next/link";
import {
    Download,
    ArrowRight,
    ExternalLink,
    Calendar,
    CheckCircle2,
} from "lucide-react";
import type { ChangelogEntry } from "@/lib/changelog";
import { formatDate } from "@passcodes/passalgo";

interface CurrentReleaseHeroProps {
    release: ChangelogEntry;
}

export function CurrentReleaseHero({ release }: CurrentReleaseHeroProps) {
    const highlights = release.highlights?.slice(0, 4) || [];

    return (
        <section
            aria-labelledby="current-production-release-heading"
            className="relative overflow-hidden rounded-2xl border border-[var(--accent-border)] bg-[var(--card-bg-solid)] p-6 sm:p-8 shadow-sm transition-all"
        >
            {/* Ambient subtle glow */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[var(--accent-subtle)] blur-3xl"
            />

            <div className="relative z-10">
                {/* Header & Badges */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-light)] pb-5">
                    <div className="flex flex-wrap items-center gap-2.5">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            Current Production Release
                        </span>
                        <span className="tag stable shrink-0">
                            {release.releaseType}
                        </span>
                        <span className="font-mono text-sm font-bold text-[var(--accent-light)]">
                            {release.version}
                        </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                        <Calendar className="h-3.5 w-3.5 text-[var(--text-dim)]" aria-hidden="true" />
                        <time dateTime={release.date}>
                            {formatDate(release.date)}
                        </time>
                    </div>
                </div>

                {/* Title & Editorial Summary */}
                <div className="mt-5">
                    <h2
                        id="current-production-release-heading"
                        className="text-xl font-bold tracking-tight text-[var(--text)] sm:text-2xl"
                    >
                        {release.title}
                    </h2>
                    <p className="mt-2.5 text-sm leading-relaxed text-[var(--text-muted)] sm:text-base">
                        {release.summary}
                    </p>
                </div>

                {/* Important Highlights */}
                {highlights.length > 0 && (
                    <div className="mt-6 rounded-xl border border-[var(--border-light)] bg-[var(--card-bg)] p-4 sm:p-5">
                        <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)]">
                            <CheckCircle2 className="h-3.5 w-3.5 text-[var(--accent-light)]" aria-hidden="true" />
                            <span>Key Highlights in this Release</span>
                        </div>
                        <ul className="grid gap-2 sm:grid-cols-2">
                            {highlights.map((item, idx) => (
                                <li
                                    key={idx}
                                    className="flex items-start gap-2.5 text-xs text-[var(--text-muted)] sm:text-sm"
                                >
                                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent-light)]" />
                                    <span className="leading-relaxed">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Build Specifications Pill Group */}
                {release.internalDetails && (
                    <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-[var(--text-dim)]">
                        <span className="font-medium text-[var(--text-muted)]">Specifications:</span>
                        {release.internalDetails.expoSdk && (
                            <span className="rounded-md border border-[var(--border-light)] bg-[var(--card-bg)] px-2 py-0.5 font-mono text-[11px]">
                                Expo SDK {release.internalDetails.expoSdk}
                            </span>
                        )}
                        {release.internalDetails.minAndroid && (
                            <span className="rounded-md border border-[var(--border-light)] bg-[var(--card-bg)] px-2 py-0.5 font-mono text-[11px]">
                                Android {release.internalDetails.minAndroid.split(" ")[0]}+
                            </span>
                        )}
                        {release.internalDetails.masterDbVersion && (
                            <span className="rounded-md border border-[var(--border-light)] bg-[var(--card-bg)] px-2 py-0.5 font-mono text-[11px]">
                                DB Schema {release.internalDetails.masterDbVersion}
                            </span>
                        )}
                        {release.internalDetails.packageName && (
                            <span className="hidden sm:inline-block rounded-md border border-[var(--border-light)] bg-[var(--card-bg)] px-2 py-0.5 font-mono text-[11px]">
                                {release.internalDetails.packageName}
                            </span>
                        )}
                    </div>
                )}

                {/* Actions */}
                <div className="mt-6 flex flex-wrap items-center gap-3 pt-3 border-t border-[var(--border-light)]">
                    <Link
                        href="/downloads"
                        className="btn btn-filled btn-small inline-flex items-center gap-1.5"
                    >
                        <Download className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Get {release.version} APK</span>
                    </Link>

                    <Link
                        href={`/changelog/${release.slug}`}
                        className="btn btn-outline btn-small inline-flex items-center gap-1.5"
                    >
                        <span>Release Details</span>
                        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>

                    {release.githubUrl && (
                        <Link
                            href={release.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-ghost btn-small inline-flex items-center gap-1.5"
                        >
                            <span>GitHub Release</span>
                            <ExternalLink className="h-3 w-3 opacity-60" aria-hidden="true" />
                        </Link>
                    )}
                </div>
            </div>
        </section>
    );
}
