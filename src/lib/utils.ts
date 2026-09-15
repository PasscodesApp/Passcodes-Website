import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { GithubReleaseAsset } from "@/types/github";
import type { ArchKey } from "@/types/arch";

export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
}

export function isNonAndroidDevice(): boolean {
    if (typeof navigator === "undefined") return false;
    return !navigator.userAgent.toLowerCase().includes("android");
}

export function supportsViewTransitions(): boolean {
    if (typeof document === "undefined") return false;
    return "startViewTransition" in document;
}

/**
 * Pick the best APK asset for a release, preferring the *universal* build so a
 * normal user gets a one‑click download that works on any device (no GitHub
 * release page, no architecture guessing). Falls back gracefully.
 */
export function pickApkAsset(
    assets: GithubReleaseAsset[]
): GithubReleaseAsset | undefined {
    if (!assets?.length) return undefined;
    const apks = assets.filter(
        (a) =>
            a.name.toLowerCase().endsWith(".apk") ||
            a.content_type === "application/vnd.android.package-archive"
    );
    if (!apks.length) return undefined;
    const universal = apks.find((a) =>
        a.name.toLowerCase().includes("universal")
    );
    return universal ?? apks[0];
}

/* ============================================================ */
/* ===== ARCHITECTURE-AWARE APK SELECTION ===================== */
/* ============================================================ */

export const ARCH_META: Record<
    ArchKey,
    { label: string; short: string; desc: string }
> = {
    arm64: { label: "arm64-v8a", short: "arm64", desc: "Most modern phones" },
    armv7: {
        label: "armeabi-v7a",
        short: "32-bit ARM",
        desc: "Older / budget phones",
    },
    x86_64: {
        label: "x86_64",
        short: "x86_64",
        desc: "Emulators / some tablets",
    },
    x86: { label: "x86", short: "x86", desc: "Emulators (32-bit)" },
    universal: {
        label: "universal",
        short: "Universal",
        desc: "Any device · larger file",
    },
    unknown: { label: "other", short: "Other", desc: "" },
};

/** Map an asset filename to an architecture key. Order matters (arm64 before armeabi, x86_64 before x86). */
export function archOfAsset(name: string): ArchKey {
    const n = name.toLowerCase();
    if (n.includes("universal")) return "universal";
    if (n.includes("arm64") || n.includes("aarch64")) return "arm64";
    if (
        n.includes("armeabi-v7a") ||
        n.includes("armv7") ||
        n.includes("armeabi")
    )
        return "armv7";
    if (n.includes("x86_64") || n.includes("x86-64")) return "x86_64";
    if (n.includes("x86")) return "x86";
    return "unknown";
}

export interface ArchVariant {
    key: ArchKey;
    asset: GithubReleaseAsset;
}

/** One representative APK per architecture present in the release. */
export function groupApksByArch(assets: GithubReleaseAsset[]): ArchVariant[] {
    const map = new Map<ArchKey, GithubReleaseAsset>();
    for (const a of assets) {
        const isApk =
            a.name.toLowerCase().endsWith(".apk") ||
            a.content_type === "application/vnd.android.package-archive";
        if (!isApk) continue;
        const k = archOfAsset(a.name);
        if (!map.has(k)) map.set(k, a);
    }
    return Array.from(map.entries()).map(([key, asset]) => ({ key, asset }));
}

/** Canonical ordering with the recommended arch first. */
export function orderVariants(
    variants: ArchVariant[],
    recommended: ArchKey
): ArchVariant[] {
    const canonical: ArchKey[] = [
        "arm64",
        "armv7",
        "x86_64",
        "x86",
        "universal",
        "unknown",
    ];
    const byKey = new Map(variants.map((v) => [v.key, v]));
    const out: ArchVariant[] = [];
    const rec = byKey.get(recommended);
    if (rec) out.push(rec);
    for (const k of canonical) {
        const v = byKey.get(k);
        if (v && v.key !== recommended) out.push(v);
    }
    for (const v of variants) if (!out.includes(v)) out.push(v);
    return out;
}

/** Best APK for the recommended arch → universal → any APK. */
export function pickRecommendedApk(
    assets: GithubReleaseAsset[],
    recommended: ArchKey
): GithubReleaseAsset | undefined {
    const byKey = new Map(groupApksByArch(assets).map((v) => [v.key, v.asset]));
    return (
        byKey.get(recommended) ?? byKey.get("universal") ?? pickApkAsset(assets)
    );
}
