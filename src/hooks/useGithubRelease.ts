"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    getAllReleases,
    getLatestStableRelease,
    classifyRelease,
    isYankedRelease,
    isDeprecatedRelease,
    type ReleaseChannel,
    GithubRateLimitError,
} from "@/lib/github";
import type { GithubRelease } from "@/types/github";

/** Fetch all releases with caching and error handling */
export function useReleases() {
    return useQuery<GithubRelease[], Error>({
        queryKey: ["github", "releases"],
        queryFn: getAllReleases,
    });
}

/** Fetch all releases for download history (alias for useReleases) */
export function useAllReleases() {
    return useReleases();
}

/**
 * Fetch the latest stable release derived from the canonical releases query.
 * Backward-compatible helper for consumers that only need the latest release.
 */
export function useLatestRelease() {
    const query = useReleases();
    const latestRelease = useMemo(
        () => (query.data ? getLatestStableRelease(query.data) : undefined),
        [query.data]
    );

    return {
        ...query,
        data: latestRelease,
    };
}

/** Type guard to check if an error is a rate limit error */
export function isRateLimitError(error: Error | null): boolean {
    return error instanceof GithubRateLimitError;
}

export { getLatestStableRelease, classifyRelease, isYankedRelease, isDeprecatedRelease, type ReleaseChannel };
