import { API_ENDPOINTS } from "./constants";
import type {
    GithubRelease,
    GithubContributor,
    GithubRepoInfo,
    DownloadStats,
} from "@/types/github";

/** Custom error for GitHub API rate limiting */
export class GithubRateLimitError extends Error {
    resetTime: Date;

    constructor(resetTimestamp: number) {
        super("GitHub API rate limit exceeded");
        this.name = "GithubRateLimitError";
        this.resetTime = new Date(resetTimestamp * 1000);
    }
}

/**
 * Base fetch wrapper with error handling and rate limit detection.
 */
async function githubFetch<T>(url: string): Promise<T> {
    const response = await fetch(url, {
        headers: {
            Accept: "application/vnd.github.v3+json",
        },
    });

    const remaining = response.headers.get("X-RateLimit-Remaining");
    if (remaining !== null && parseInt(remaining, 10) <= 0) {
        const resetTime = response.headers.get("X-RateLimit-Reset");
        throw new GithubRateLimitError(resetTime ? parseInt(resetTime, 10) : 0);
    }

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error(
                "Resource not found. The repository or release may not exist."
            );
        }
        if (response.status === 403) {
            const resetTime = response.headers.get("X-RateLimit-Reset");
            throw new GithubRateLimitError(
                resetTime ? parseInt(resetTime, 10) : 0
            );
        }
        throw new Error(
            `GitHub API error: ${response.status} ${response.statusText}`
        );
    }

    return response.json() as Promise<T>;
}

/** Fetch the latest release from the Passcodes repository */
export async function getLatestRelease(): Promise<GithubRelease> {
    return githubFetch<GithubRelease>(API_ENDPOINTS.latestRelease);
}

/** Fetch all releases (for download history) */
export async function getAllReleases(): Promise<GithubRelease[]> {
    return githubFetch<GithubRelease[]>(
        `${API_ENDPOINTS.allReleases}?per_page=30`
    );
}

/** Fetch repository contributors */
export async function getContributors(): Promise<GithubContributor[]> {
    return githubFetch<GithubContributor[]>(
        `${API_ENDPOINTS.contributors}?per_page=50`
    );
}

/** Fetch repository metadata (stars, forks, etc.) */
export async function getRepoInfo(): Promise<GithubRepoInfo> {
    return githubFetch<GithubRepoInfo>(API_ENDPOINTS.repoInfo);
}

export type ReleaseChannel = "stable" | "beta" | "alpha";

/**
 * Check if a release was marked as yanked in its title or tag.
 * Follows the repository's convention: e.g. `[YANKED RELEASE]` or `[Yanked Released]`.
 */
export function isYankedRelease(release: GithubRelease): boolean {
    const text = `${release.name || ""} ${release.tag_name || ""}`.toLowerCase();
    return text.includes("yanked");
}

/**
 * Check if a release is deprecated.
 * v1.x and v2.x releases are deprecated (superseded by newer database architecture).
 */
export function isDeprecatedRelease(release: GithubRelease): boolean {
    const text = release.tag_name || release.name || "";
    const match = text.match(/v?(\d+)\./i);
    if (!match) return false;
    const major = parseInt(match[1], 10);
    return major === 1 || major === 2;
}

/**
 * Classify a release into Stable, Beta, or Alpha channels based on metadata and naming conventions.
 * Primary classification:
 * - inspect explicit alpha/beta markers in release title or tag name
 * - if not explicitly marked, inspect GitHub `prerelease` flag
 * - fallback for pre-releases without alpha/beta keyword defaults to beta
 */
export function classifyRelease(release: GithubRelease): ReleaseChannel {
    const text = `${release.name || ""} ${release.tag_name || ""}`.toLowerCase();

    // Explicit alpha marker in tag or release title (e.g. "v3.0.0 - Alpha", "v1.1.2-alpha")
    if (text.includes("alpha")) {
        return "alpha";
    }

    // Explicit beta marker in tag or release title (e.g. "v2.1.1 - Beta", "v2.0.0-beta")
    if (text.includes("beta")) {
        return "beta";
    }

    // Explicit stable marker in title
    if (text.includes("stable")) {
        return "stable";
    }

    // Pre-release flag fallback: if marked as prerelease on GitHub without explicit keyword,
    // classify as beta (safest preview channel fallback)
    if (release.prerelease) {
        return "beta";
    }

    // Default non-prerelease is stable
    return "stable";
}

/**
 * Find the latest stable release from a list of releases.
 * Follows GitHub's /releases/latest semantics:
 * - not a draft
 * - classified as stable (not prerelease, not alpha/beta, not yanked, not deprecated)
 * - newest according to created_at
 * Pure function that does not mutate the source array.
 */
export function getLatestStableRelease(
    releases: GithubRelease[]
): GithubRelease | undefined {
    return releases.reduce<GithubRelease | undefined>((latest, release) => {
        if (release.draft || isYankedRelease(release) || isDeprecatedRelease(release)) return latest;
        if (classifyRelease(release) !== "stable") return latest;
        if (!latest) return release;

        return new Date(release.created_at).getTime() >
            new Date(latest.created_at).getTime()
            ? release
            : latest;
    }, undefined);
}

/**
 * Calculate aggregated download statistics.
 */
export async function getDownloadStats(): Promise<DownloadStats> {
    const releases = await getAllReleases();

    const totalDownloads = releases.reduce((total, release) => {
        const releaseDownloads = release.assets.reduce(
            (sum, asset) => sum + asset.download_count,
            0
        );
        return total + releaseDownloads;
    }, 0);

    const latestRelease = getLatestStableRelease(releases);
    const latestReleaseDownloads = latestRelease
        ? latestRelease.assets.reduce(
              (sum, asset) => sum + asset.download_count,
              0
          )
        : 0;

    return {
        totalDownloads,
        latestReleaseDownloads,
        releaseCount: releases.length,
    };
}
