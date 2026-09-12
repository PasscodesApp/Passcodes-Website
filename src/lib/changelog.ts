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
