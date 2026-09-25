import { notFound } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    ArrowRight,
    Tag,
    Calendar,
    ExternalLink,
    GitCompare,
    GitCommit,
    CheckCircle2,
    AlertTriangle,
    Download,
    BookOpen,
    ShieldAlert,
} from "lucide-react";
import {
    CHANGELOG_ENTRIES,
    getChangelogEntryBySlug,
    getAdjacentEntries,
    getLatestProductionRelease,
    isDeprecatedEntry,
} from "@/lib/changelog";
import {
    SITE_META,
    DOCS_RELEASE_NOTES_URL,
    USER_GUIDE_URL,
    GITHUB_REPO_URL,
} from "@/lib/constants";
import { ReleaseVisual } from "@/components/visuals/ReleaseVisual";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { formatDate } from "@passcodes/passalgo";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";

export async function generateStaticParams() {
    return CHANGELOG_ENTRIES.map((entry) => ({
        slug: entry.slug,
    }));
}

export async function generateMetadata({
    params,
}: {
    params: { slug: string };
}): Promise<Metadata> {
    const entry = getChangelogEntryBySlug(params.slug);
    if (!entry) return { title: "Release Not Found" };

    const pageTitle = `${entry.title} | Passcodes Changelog`;
    return {
        title: pageTitle,
        description: entry.summary,
        openGraph: {
            title: pageTitle,
            description: entry.summary,
            url: `${SITE_META.url}/changelog/${entry.slug}`,
            siteName: "Passcodes",
            type: "article",
        },
    };
}

export default function ChangelogEntryPage({
    params,
}: {
    params: { slug: string };
}) {
    const entry = getChangelogEntryBySlug(params.slug);
    if (!entry) notFound();

    const { prev, next } = getAdjacentEntries(params.slug);
    const isDeprecated = isDeprecatedEntry(entry);
    const latestProd = getLatestProductionRelease();
    const isCurrentProduction = latestProd?.slug === entry.slug;

    return (
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-20">
            {/* 1. Header & Release Metadata */}
            <ScrollReveal delay={0}>
                <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
                    <Link
                        href="/changelog"
                        className="inline-flex items-center gap-2 text-xs font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Back to all updates</span>
                    </Link>

                    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[var(--text-dim)]">
                        <Link href="/" className="transition-colors hover:text-[var(--text)]">Home</Link>
                        <span>/</span>
                        <Link href="/changelog" className="transition-colors hover:text-[var(--text)]">Project Updates</Link>
                        <span>/</span>
                        <span className="font-mono text-[var(--text)]">{entry.version}</span>
                    </nav>
                </div>

                <header className="mb-10 space-y-4">
                    <div className="flex flex-wrap items-center gap-2.5">
                        {isDeprecated && (
                            <span className="tag deprecated">
                                Deprecated Release
                            </span>
                        )}
                        {entry.isYanked ? (
                            <span className="tag border-amber-500/40 bg-amber-500/10 font-semibold text-amber-600 dark:text-amber-400">
                                Yanked Release
                            </span>
                        ) : entry.isMilestone ? (
                            <span className="editorial-badge border-[var(--accent-light)]/40 bg-[var(--accent-light)]/15 font-semibold text-[var(--accent-light)]">
                                Architecture Milestone
                            </span>
                        ) : (
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
                        )}

                        {isCurrentProduction && (
                            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                Current Production
                            </span>
                        )}

                        <span className="inline-flex items-center gap-1 rounded-md border border-[var(--border-light)] bg-[var(--card-bg)] px-2.5 py-1 text-xs text-[var(--text-muted)]">
                            <Calendar className="h-3.5 w-3.5 text-[var(--text-dim)]" aria-hidden="true" />
                            <time dateTime={entry.date}>
                                {formatDate(entry.date)}
                            </time>
                        </span>

                        <span
                            className={cn(
                                "inline-flex items-center gap-1 rounded-md border border-[var(--border-light)] bg-[var(--card-bg)] px-2.5 py-1 font-mono text-xs",
                                isDeprecated
                                    ? "text-red-500 dark:text-red-400"
                                    : "text-[var(--accent-light)]"
                            )}
                        >
                            <Tag className="h-3.5 w-3.5" aria-hidden="true" />
                            {entry.version}
                        </span>

                        <span className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border-light)] bg-[var(--card-bg)] px-2.5 py-1 text-xs text-[var(--text-dim)]">
                            <ReleaseVisual
                                category={entry.category}
                                className="h-3.5 w-3.5"
                            />
                            <span>{entry.category}</span>
                        </span>
                    </div>

                    <h1 className="text-3xl font-bold tracking-tight text-[var(--text)] sm:text-4xl">
                        {entry.title}
                    </h1>

                    <p className="text-base leading-relaxed text-[var(--text-muted)] sm:text-lg">
                        {entry.summary}
                    </p>

                    {/* Action Links */}
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                        {!isDeprecated && !entry.isYanked && !entry.isMilestone && (
                            <Link
                                href="/downloads"
                                className="btn btn-filled btn-small inline-flex items-center gap-1.5"
                            >
                                <Download className="h-3.5 w-3.5" aria-hidden="true" />
                                <span>Get {entry.version} APK</span>
                            </Link>
                        )}
                        <Link
                            href={USER_GUIDE_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-outline btn-small inline-flex items-center gap-1.5"
                        >
                            <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>Setup Guide</span>
                            <ExternalLink className="h-3 w-3 opacity-60" aria-hidden="true" />
                        </Link>
                        {entry.githubUrl && (
                            <Link
                                href={entry.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-ghost btn-small"
                            >
                                <GitCommit className="h-3.5 w-3.5" aria-hidden="true" />
                                <span>GitHub Release</span>
                                <ExternalLink className="h-3 w-3 opacity-60" aria-hidden="true" />
                            </Link>
                        )}
                        {entry.compareUrl && (
                            <Link
                                href={entry.compareUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-ghost btn-small"
                            >
                                <GitCompare className="h-3.5 w-3.5" aria-hidden="true" />
                                <span>Compare Diffs</span>
                                <ExternalLink className="h-3 w-3 opacity-60" aria-hidden="true" />
                            </Link>
                        )}
                    </div>
                </header>

                {/* Deprecated Notice */}
                {isDeprecated && (
                    <div className="mb-8 rounded-xl border border-red-500/30 bg-red-500/10 p-5 text-sm text-red-700 dark:text-red-300">
                        <div className="flex items-center gap-2 font-semibold text-red-600 dark:text-red-400">
                            <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
                            <span>Deprecated Release Notice</span>
                        </div>
                        <p className="mt-1.5 leading-relaxed text-xs sm:text-sm text-[var(--text-muted)]">
                            {entry.deprecatedReason ||
                                "This release is no longer supported. Superseded by the newer database architecture introduced in later releases. Please use a current release instead."}
                        </p>
                        <div className="mt-3.5 flex flex-wrap items-center gap-3">
                            <Link
                                href="/downloads"
                                className="inline-flex items-center gap-1 text-xs font-semibold text-red-700 dark:text-red-300 underline hover:no-underline"
                            >
                                <span>View current production downloads</span>
                                <ArrowRight className="h-3 w-3" aria-hidden="true" />
                            </Link>
                        </div>
                    </div>
                )}

                {/* Yanked Notice */}
                {entry.isYanked && (
                    <div className="mb-8 rounded-xl border border-amber-500/30 bg-amber-500/10 p-5 text-sm text-amber-700 dark:text-amber-300">
                        <div className="flex items-center gap-2 font-semibold">
                            <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                            <span>Yanked Release Notice</span>
                        </div>
                        <p className="mt-1.5 leading-relaxed text-xs sm:text-sm">
                            {entry.yankedReason ||
                                "This release has been explicitly yanked from active distribution. It is preserved here strictly for documentation and project history."}
                        </p>
                        <div className="mt-3.5 flex flex-wrap items-center gap-3">
                            <Link
                                href="/downloads"
                                className="inline-flex items-center gap-1 text-xs font-semibold text-amber-800 dark:text-amber-200 underline hover:no-underline"
                            >
                                <span>View current production downloads</span>
                                <ArrowRight className="h-3 w-3" aria-hidden="true" />
                            </Link>
                        </div>
                    </div>
                )}

                {/* Technical Build Specifications */}
                {entry.internalDetails && (
                    <div className="mb-8 rounded-xl border border-[var(--border-light)] bg-[var(--card-bg)] p-5">
                        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)]">
                            Build &amp; Runtime Specifications
                        </h2>
                        <div className="grid grid-cols-2 gap-4 font-mono text-xs sm:grid-cols-4">
                            {entry.internalDetails.packageName && (
                                <div>
                                    <span className="block text-[var(--text-dim)]">Package</span>
                                    <span className="font-semibold text-[var(--text)]">{entry.internalDetails.packageName}</span>
                                </div>
                            )}
                            {entry.internalDetails.expoSdk && (
                                <div>
                                    <span className="block text-[var(--text-dim)]">Expo SDK</span>
                                    <span className="font-semibold text-[var(--text)]">v{entry.internalDetails.expoSdk}</span>
                                </div>
                            )}
                            {entry.internalDetails.minAndroid && (
                                <div>
                                    <span className="block text-[var(--text-dim)]">Min Android</span>
                                    <span className="font-semibold text-[var(--text)]">{entry.internalDetails.minAndroid}</span>
                                </div>
                            )}
                            {entry.internalDetails.maxAndroid && (
                                <div>
                                    <span className="block text-[var(--text-dim)]">Max Android</span>
                                    <span className="font-semibold text-[var(--text)]">{entry.internalDetails.maxAndroid}</span>
                                </div>
                            )}
                            {entry.internalDetails.versionCode && (
                                <div>
                                    <span className="block text-[var(--text-dim)]">Version Code</span>
                                    <span className="font-semibold text-[var(--text)]">{entry.internalDetails.versionCode}</span>
                                </div>
                            )}
                            {entry.internalDetails.masterDbVersion && (
                                <div>
                                    <span className="block text-[var(--text-dim)]">Database Schema</span>
                                    <span className="font-semibold text-[var(--text)]">{entry.internalDetails.masterDbVersion}</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </ScrollReveal>

            {/* 2. Article Content (Highlights + Release Sections) */}
            <ScrollReveal delay={60}>
                <article className="border-b border-[var(--border-light)] pb-14">
                    {/* Highlights Callout */}
                    {entry.highlights && entry.highlights.length > 0 && (
                        <div className="mb-10 rounded-xl border border-[var(--border-light)] bg-[var(--card-bg)] p-6 sm:p-8">
                            <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-[var(--text)]">
                                <CheckCircle2 className="h-4 w-4 text-[var(--accent-light)]" aria-hidden="true" />
                                <span>Release Highlights</span>
                            </h2>
                            <ul className="space-y-3">
                                {entry.highlights.map((highlight, index) => (
                                    <li
                                        key={index}
                                        className="flex items-start gap-3 text-sm text-[var(--text-muted)]"
                                    >
                                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent-light)]" />
                                        <span className="leading-relaxed">
                                            {highlight}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Detailed Sections */}
                    {entry.sections && entry.sections.length > 0 && (
                        <div className="space-y-8">
                            {entry.sections.map((section, sIdx) => (
                                <div key={sIdx} className="space-y-3">
                                    <h3 className="text-lg font-bold tracking-tight text-[var(--text)]">
                                        {section.title}
                                    </h3>
                                    <ul className="space-y-2.5">
                                        {section.items.map((item, iIdx) => (
                                            <li
                                                key={iIdx}
                                                className="flex items-start gap-2.5 text-sm text-[var(--text-muted)]"
                                            >
                                                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--text-dim)]" />
                                                <span className="leading-relaxed">
                                                    {item}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Documentation & Resources Box */}
                    <div className="mt-12 rounded-xl border border-[var(--border-light)] bg-[var(--card-bg)] p-5">
                        <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)]">
                            <BookOpen className="h-3.5 w-3.5 text-[var(--accent-light)]" aria-hidden="true" />
                            <span>Relevant Documentation &amp; Resources</span>
                        </div>
                        <div className="flex flex-wrap gap-3 text-xs">
                            <Link
                                href={DOCS_RELEASE_NOTES_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-light)] bg-[var(--card-bg-solid)] px-3 py-2 text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
                            >
                                <span>Official Docs Release Notes</span>
                                <ExternalLink className="h-3 w-3 opacity-60" aria-hidden="true" />
                            </Link>
                            <Link
                                href={USER_GUIDE_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-light)] bg-[var(--card-bg-solid)] px-3 py-2 text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
                            >
                                <span>Installation &amp; Setup Guide</span>
                                <ExternalLink className="h-3 w-3 opacity-60" aria-hidden="true" />
                            </Link>
                            <Link
                                href={GITHUB_REPO_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-light)] bg-[var(--card-bg-solid)] px-3 py-2 text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
                            >
                                <span>Passcodes GitHub Repository</span>
                                <ExternalLink className="h-3 w-3 opacity-60" aria-hidden="true" />
                            </Link>
                        </div>
                    </div>

                    {/* Next Steps Journey Card */}
                    <div className="mt-10 rounded-xl border border-[var(--border-light)] bg-gradient-to-br from-[var(--card-bg)] to-[var(--bg-secondary)] p-6 sm:p-8">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--accent-light)]">
                                    Next Steps
                                </span>
                                <h3 className="mt-1 text-lg font-bold tracking-tight text-[var(--text)]">
                                    Ready to run Passcodes?
                                </h3>
                                <p className="mt-1 max-w-xl text-xs leading-relaxed text-[var(--text-muted)] sm:text-sm">
                                    {isDeprecated || entry.isYanked
                                        ? "This build is deprecated or yanked. Download the verified production release or review the setup guide."
                                        : "Download the latest signed Android package, read our configuration walkthrough, or explore all releases."}
                                </p>
                            </div>
                            <div className="flex flex-wrap items-center gap-2.5 sm:shrink-0">
                                <Link
                                    href="/downloads"
                                    className="btn btn-filled btn-small inline-flex items-center gap-1.5"
                                >
                                    <Download className="h-3.5 w-3.5" aria-hidden="true" />
                                    <span>Download APK</span>
                                </Link>
                                <Link
                                    href={USER_GUIDE_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-outline btn-small inline-flex items-center gap-1.5"
                                >
                                    <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                                    <span>Documentation</span>
                                    <ExternalLink className="h-3 w-3 opacity-60" aria-hidden="true" />
                                </Link>
                                <Link
                                    href="/changelog"
                                    className="btn btn-ghost btn-small inline-flex items-center gap-1.5"
                                >
                                    <span>All Updates</span>
                                    <ArrowRight className="h-3 w-3" aria-hidden="true" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </article>
            </ScrollReveal>

            {/* 3. Adjacent Release Pagination */}
            <ScrollReveal delay={100}>
                <nav
                    aria-label="Release pagination"
                    className="mt-12 grid gap-4 sm:grid-cols-2"
                >
                    {prev ? (
                        <Link
                            href={`/changelog/${prev.slug}`}
                            className="subtle-card group flex flex-col gap-1 text-left"
                        >
                            <span className="flex items-center gap-1.5 text-xs text-[var(--text-dim)]">
                                <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-0.5" aria-hidden="true" />
                                <span>Previous Release</span>
                            </span>
                            <span className="text-sm font-semibold text-[var(--text)] transition-colors group-hover:text-[var(--accent-light)]">
                                {prev.version} — {prev.title}
                            </span>
                        </Link>
                    ) : (
                        <div />
                    )}

                    {next ? (
                        <Link
                            href={`/changelog/${next.slug}`}
                            className="subtle-card group flex flex-col gap-1 text-right sm:items-end"
                        >
                            <span className="flex items-center gap-1.5 text-xs text-[var(--text-dim)]">
                                <span>Next Release</span>
                                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                            </span>
                            <span className="text-sm font-semibold text-[var(--text)] transition-colors group-hover:text-[var(--accent-light)]">
                                {next.version} — {next.title}
                            </span>
                        </Link>
                    ) : (
                        <div />
                    )}
                </nav>
            </ScrollReveal>
        </div>
    );
}
