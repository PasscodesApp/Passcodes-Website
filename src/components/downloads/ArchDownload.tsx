"use client";

import { useState } from "react";
import { Download, ChevronDown, ChevronUp, Cpu, Sparkles } from "lucide-react";
import { useArchDetection } from "@/hooks/useArchDetection";
import type { ArchKey } from "@/types/arch";
import {
    ARCH_META,
    archOfAsset,
    groupApksByArch,
    orderVariants,
    pickRecommendedApk,
    cn,
} from "@/lib/utils";
import type { GithubReleaseAsset } from "@/types/github";
import Link from "next/link";
import { formatFileSize } from "@passcodes/passalgo";

interface Props {
    assets: GithubReleaseAsset[];
    variant?: "full" | "compact";
    className?: string;
}

export function ArchDownload({ assets, variant = "full", className }: Props) {
    const { arch: detected, isAndroid, isDetecting } = useArchDetection();
    const [open, setOpen] = useState(false);

    const preferred: ArchKey = isDetecting
        ? "universal"
        : (detected ?? "arm64");
    const primary = pickRecommendedApk(assets, preferred);
    if (!primary) return null;

    const primaryArch = archOfAsset(primary.name);
    const ordered = orderVariants(groupApksByArch(assets), primaryArch);
    const alts = ordered.filter((v) => v.key !== primaryArch);

    const matchedDevice = isAndroid && !!detected && detected === primaryArch;
    const recLabel = matchedDevice
        ? "Matches your device"
        : primaryArch === "universal"
          ? "Works on any device"
          : "Best for most phones";

    const note = isDetecting
        ? "Detecting your device architecture…"
        : isAndroid && detected && detected !== primaryArch
          ? `No ${ARCH_META[detected].label} build in this release — ${ARCH_META[primaryArch].label} is the closest match.`
          : isAndroid && detected
            ? `Detected Android (${ARCH_META[detected].label}) — recommended package for your hardware.`
            : `Unsure which to pick? ${ARCH_META.arm64.label} fits almost all modern Android phones; ${ARCH_META.universal.label} works on any device.`;

    /* ---------- compact (release-history rows) ---------- */
    if (variant === "compact") {
        return (
            <div className={cn("relative", className)}>
                <div className="flex items-center gap-2">
                    <Link
                        href={primary.browser_download_url}
                        download
                        className="btn btn-filled btn-small"
                    >
                        <Download className="h-4 w-4" aria-hidden="true" />{" "}
                        Download {ARCH_META[primaryArch].short}
                    </Link>
                    {alts.length > 0 && (
                        <button
                            type="button"
                            onClick={() => setOpen((o) => !o)}
                            aria-expanded={open}
                            aria-label="Show all architecture builds"
                            className="btn btn-ghost btn-small"
                        >
                            {open ? (
                                <ChevronUp className="h-4 w-4" />
                            ) : (
                                <ChevronDown className="h-4 w-4" />
                            )}
                            {ordered.length} builds
                        </button>
                    )}
                </div>

                {open && alts.length > 0 && (
                    <ul className="mt-3 grid animate-fade-in gap-2">
                        {alts.map((v) => (
                            <VariantRow key={v.key} v={v} />
                        ))}
                    </ul>
                )}
            </div>
        );
    }

    /* ---------- full (latest release card) ---------- */
    return (
        <div className={cn("mt-5", className)}>
            <p className="mb-3 flex items-center gap-2 text-xs text-[var(--text-muted)]">
                <Cpu className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>{note}</span>
            </p>

            <Link
                href={primary.browser_download_url}
                download
                className="btn btn-filled w-full sm:w-auto"
            >
                <Download className="h-5 w-5" aria-hidden="true" />
                Download {ARCH_META[primaryArch].label} APK
                <span className="opacity-80">
                    · {formatFileSize(primary.size)}
                </span>
            </Link>
            <p
                className="mt-1.5 flex items-center gap-1 text-xs"
                style={{ color: "var(--accent-light)" }}
            >
                <Sparkles className="h-3 w-3" aria-hidden="true" /> {recLabel}
            </p>

            {alts.length > 0 && (
                <div className="mt-4">
                    <p className="mb-2 text-xs uppercase tracking-wider text-[var(--text-dim)]">
                        Or pick another architecture build
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {alts.map((v) => (
                            <Chip key={v.key} v={v} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

/* ----- sub-pieces ----- */

function Chip({ v }: { v: { key: ArchKey; asset: GithubReleaseAsset } }) {
    const m = ARCH_META[v.key];
    return (
        <Link
            href={v.asset.browser_download_url}
            download
            className="group inline-flex items-center gap-2 rounded-xl border border-[var(--border-light)] bg-[var(--card-bg)] px-3 py-2 text-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--border)] hover:bg-[var(--card-bg-hover)]"
        >
            <Download
                className="h-4 w-4 text-[var(--text-dim)] transition-colors group-hover:text-[var(--accent-light)]"
                aria-hidden="true"
            />
            <span className="font-semibold">{m.short}</span>
            {m.desc && (
                <span className="hidden text-[11px] text-[var(--text-dim)] sm:inline">
                    · {m.desc}
                </span>
            )}
            <span className="text-xs text-[var(--text-dim)]">
                · {formatFileSize(v.asset.size)}
            </span>
        </Link>
    );
}

function VariantRow({ v }: { v: { key: ArchKey; asset: GithubReleaseAsset } }) {
    const m = ARCH_META[v.key];
    return (
        <li>
            <Link
                href={v.asset.browser_download_url}
                download
                className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border-light)] bg-[var(--card-bg)] px-3 py-2 transition-colors hover:border-[var(--border)] hover:bg-[var(--card-bg-hover)]"
            >
                <span className="min-w-0">
                    <span className="font-semibold">{m.label}</span>
                    {m.desc && (
                        <span className="ml-2 text-xs text-[var(--text-dim)]">
                            {m.desc}
                        </span>
                    )}
                </span>
                <span className="flex shrink-0 items-center gap-2 text-xs text-[var(--text-muted)]">
                    {formatFileSize(v.asset.size)}
                    <Download
                        className="h-4 w-4 text-[var(--accent-light)]"
                        aria-hidden="true"
                    />
                </span>
            </Link>
        </li>
    );
}
