import rawEntries from "@/data/normalized-releases.json";

export type ChangelogCategory =
    | "Features"
    | "Improvements"
    | "Fixes"
    | "Security"
    | "Architecture";

export interface ChangelogSection {
    title: string;
    items: string[];
}

export interface InternalDetails {
    packageName?: string;
    expoSdk?: number | string;
    minAndroid?: string;
    maxAndroid?: string;
    versionCode?: number;
    versionName?: string;
    masterDbVersion?: string;
}

export interface ChangelogEntry {
    slug: string;
    version: string;
    title: string;
    date: string;
    releaseType: "Stable" | "Beta" | "Alpha";
    category: ChangelogCategory;
    summary: string;
    highlights?: string[];
    sections?: ChangelogSection[];
    internalDetails?: InternalDetails;
    tldr?: string;
    githubUrl?: string;
    compareUrl?: string;
    isMajor?: boolean;
    isYanked?: boolean;
    yankedReason?: string;
    isDeprecated?: boolean;
    deprecatedReason?: string;
    isMilestone?: boolean;
    assetsCount?: number;
    downloadCount?: number;
}

export const CHANGELOG_CATEGORIES = [
    "All",
    "Features",
    "Improvements",
    "Fixes",
    "Security",
    "Architecture",
] as const;

export type CategoryFilter = (typeof CHANGELOG_CATEGORIES)[number];

export const CHANGELOG_ENTRIES: ChangelogEntry[] =
    rawEntries as ChangelogEntry[];

export function getAllChangelogEntries(): ChangelogEntry[] {
    return CHANGELOG_ENTRIES;
}

export function getChangelogEntryBySlug(
    slug: string
): ChangelogEntry | undefined {
    return CHANGELOG_ENTRIES.find((entry) => entry.slug === slug);
}

export function getLatestChangelogEntry(): ChangelogEntry {
    return (
        CHANGELOG_ENTRIES.find((e) => !e.isMilestone) || CHANGELOG_ENTRIES[0]
    );
}

export function getAdjacentEntries(currentSlug: string): {
    prev: ChangelogEntry | null;
    next: ChangelogEntry | null;
} {
    const index = CHANGELOG_ENTRIES.findIndex((e) => e.slug === currentSlug);
    if (index === -1) {
        return { prev: null, next: null };
    }
    return {
        prev:
            index < CHANGELOG_ENTRIES.length - 1
                ? CHANGELOG_ENTRIES[index + 1]
                : null,
        next: index > 0 ? CHANGELOG_ENTRIES[index - 1] : null,
    };
}

/**
 * Check if a changelog entry is deprecated.
 * v1.x and v2.x releases are deprecated (superseded by newer database architecture).
 */
export function isDeprecatedEntry(entry: ChangelogEntry): boolean {
    if (typeof entry.isDeprecated === "boolean") {
        return entry.isDeprecated;
    }
    const match = entry.version.match(/^v?(\d+)\./i);
    if (!match) return false;
    const major = parseInt(match[1], 10);
    return major === 1 || major === 2;
}

export type ReleaseState =
    | "Stable"
    | "Beta"
    | "Alpha"
    | "Deprecated"
    | "Yanked"
    | "Milestone";

/**
 * Classify a changelog entry into its primary semantic release state.
 */
export function getReleaseState(entry: ChangelogEntry): ReleaseState {
    if (entry.isMilestone) return "Milestone";
    if (entry.isYanked) return "Yanked";
    if (isDeprecatedEntry(entry)) return "Deprecated";
    return entry.releaseType;
}

/**
 * Get the current stable production release.
 * Excludes milestones, yanked releases, deprecated releases, and non-stable channels.
 */
export function getLatestProductionRelease(): ChangelogEntry | undefined {
    return CHANGELOG_ENTRIES.find(
        (entry) =>
            !entry.isMilestone &&
            !entry.isYanked &&
            !isDeprecatedEntry(entry) &&
            entry.releaseType === "Stable"
    );
}

/**
 * Get the most recent meaningful updates (active, non-milestone releases).
 */
export function getRecentUpdates(count: number = 3): ChangelogEntry[] {
    return CHANGELOG_ENTRIES.filter(
        (entry) =>
            !entry.isMilestone &&
            !isDeprecatedEntry(entry) &&
            !entry.isYanked
    ).slice(0, count);
}

/**
 * Get documented major architectural milestones.
 * Includes the explicit architecture transition milestone and major version baseline releases.
 */
export function getProjectMilestones(): ChangelogEntry[] {
    return CHANGELOG_ENTRIES.filter(
        (entry) =>
            entry.isMilestone ||
            (entry.isMajor &&
                ["v3.0.0", "v2.0.0", "v1.0.0"].includes(entry.version))
    );
}

export const RELEASE_CHANNEL_FILTERS = [
    "All",
    "Stable",
    "Beta",
    "Alpha",
    "Milestones",
    "Deprecated",
    "Yanked",
] as const;

export type ReleaseChannelFilter = (typeof RELEASE_CHANNEL_FILTERS)[number];

/**
 * Search across version, title, summary, highlights, technical details, and release state.
 */
export function matchesReleaseSearch(
    entry: ChangelogEntry,
    query: string
): boolean {
    const searchLower = query.trim().toLowerCase();
    if (!searchLower) return true;

    const state = getReleaseState(entry).toLowerCase();
    const releaseType = entry.releaseType.toLowerCase();
    const isDep = isDeprecatedEntry(entry) ? "deprecated" : "";
    const isYank = entry.isYanked ? "yanked" : "";
    const isMs = entry.isMilestone ? "milestone" : "";

    // Version, title, summary, tldr
    if (entry.version.toLowerCase().includes(searchLower)) return true;
    if (entry.title.toLowerCase().includes(searchLower)) return true;
    if (entry.summary.toLowerCase().includes(searchLower)) return true;
    if (entry.tldr?.toLowerCase().includes(searchLower)) return true;

    // Highlights
    if (entry.highlights?.some((h) => h.toLowerCase().includes(searchLower))) {
        return true;
    }

    // Sections
    if (
        entry.sections?.some(
            (s) =>
                s.title.toLowerCase().includes(searchLower) ||
                s.items.some((item) =>
                    item.toLowerCase().includes(searchLower)
                )
        )
    ) {
        return true;
    }

    // Release states & channels
    if (
        state.includes(searchLower) ||
        releaseType.includes(searchLower) ||
        isDep.includes(searchLower) ||
        isYank.includes(searchLower) ||
        isMs.includes(searchLower)
    ) {
        return true;
    }

    // Technical build & runtime details
    if (entry.internalDetails) {
        const details = entry.internalDetails;
        if (details.packageName?.toLowerCase().includes(searchLower)) {
            return true;
        }
        if (details.versionName?.toLowerCase().includes(searchLower)) {
            return true;
        }
        if (details.masterDbVersion?.toLowerCase().includes(searchLower)) {
            return true;
        }
        if (details.minAndroid?.toLowerCase().includes(searchLower)) {
            return true;
        }
        if (details.maxAndroid?.toLowerCase().includes(searchLower)) {
            return true;
        }
        if (
            details.expoSdk &&
            String(details.expoSdk).toLowerCase().includes(searchLower)
        ) {
            return true;
        }
        if (
            details.versionCode &&
            String(details.versionCode).includes(searchLower)
        ) {
            return true;
        }
    }

    return false;
}
