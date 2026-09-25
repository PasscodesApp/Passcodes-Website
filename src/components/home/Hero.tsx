"use client";

import Link from "next/link";
import {
    Download,
    BookOpen,
    ArrowRight,
    ShieldCheck,
    WifiOff,
    Lock,
    Cpu,
    HardDrive,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Logo } from "@/components/layout/Logo";
import { GithubIcon, DiscordIcon } from "@/components/ui/BrandIcons";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { useDownloadCount } from "@/hooks/useDownloadCount";
import { useLatestRelease } from "@/hooks/useGithubRelease";
import {
    getLatestProductionRelease,
    getLatestChangelogEntry,
} from "@/lib/changelog";
import { formatNumber } from "@passcodes/passalgo";
import { GITHUB_REPO_URL, DISCORD_URL, USER_GUIDE_URL } from "@/lib/constants";

export function Hero() {
    const { data: downloadStats } = useDownloadCount();
    const { data: latestRelease } = useLatestRelease();
    const latestEntry =
        getLatestProductionRelease() || getLatestChangelogEntry();

    const displayVersion = latestRelease
        ? `v${latestRelease.tag_name.replace(/^v/, "")}`
        : latestEntry.version;

    return (
        <section className="hero-shell relative px-4 pb-16 pt-8 sm:px-6 sm:pb-20 sm:pt-12">
            <div className="mx-auto max-w-6xl">
                {/* Two-Column Responsive Split Composition */}
                <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:items-center lg:gap-12 xl:gap-16">
                    {/* LEFT — PRODUCT STORY (Desktop: Left Column, Mobile: Primary Story Flow) */}
                    <div className="order-1 flex flex-col items-center text-center lg:col-span-7 lg:items-start lg:text-left">
                        {/* Mobile Brand Identity Anchor (Mobile only: Logo / Product Identity top anchor) */}
                        <div className="mb-5 flex flex-col items-center justify-center lg:hidden">
                            <div className="flex items-center gap-3">
                                <div className="flex shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--card-bg-solid)] p-2 shadow-sm shadow-black/20">
                                    <Logo className="h-9 w-9 rounded-lg" />
                                </div>
                                <div className="text-left">
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg font-bold tracking-tight text-[var(--text)]">
                                            Passcodes
                                        </span>
                                        <span className="rounded-md border border-[var(--accent-border)] bg-[var(--accent-subtle)] px-2 py-0.5 font-mono text-[10px] font-semibold text-[var(--accent-light)]">
                                            {displayVersion}
                                        </span>
                                    </div>
                                    <p className="text-[11px] font-medium text-[var(--text-muted)]">
                                        Android Password Manager
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* 1. Release Announcement Pill */}
                        <ScrollReveal
                            delay={0}
                            className="flex w-full justify-center lg:justify-start"
                        >
                            <Link
                                href={`/changelog/${latestEntry.slug}`}
                                className="group inline-flex items-center gap-2 rounded-full border border-[var(--border-light)] bg-[var(--card-bg)] px-3.5 py-1 text-xs font-medium text-[var(--text-muted)] backdrop-blur-md transition-all hover:border-[var(--border)] hover:bg-[var(--card-bg-hover)] hover:text-[var(--text)]"
                            >
                                <span className="inline-block rounded-full bg-[var(--accent)] px-2 py-0.5 text-[10px] font-bold text-white">
                                    {displayVersion}
                                </span>
                                <span className="font-medium text-[var(--text)]">
                                    Passcodes {latestEntry.version} is live
                                </span>
                                <span
                                    className="text-[var(--text-dim)]"
                                    aria-hidden="true"
                                >
                                    ·
                                </span>
                                <span className="flex items-center gap-1 font-semibold text-[var(--accent)] transition-transform group-hover:translate-x-0.5 dark:text-[var(--accent-light)]">
                                    See what&apos;s new{" "}
                                    <ArrowRight
                                        className="h-3 w-3"
                                        aria-hidden="true"
                                    />
                                </span>
                            </Link>
                        </ScrollReveal>

                        {/* 2. Hero Headline & Supporting Description */}
                        <ScrollReveal delay={40} className="mt-5 w-full">
                            <h1 className="text-3xl font-extrabold tracking-tight text-[var(--text)] sm:text-5xl lg:text-[2.75rem] lg:leading-[1.12] xl:text-[3.15rem]">
                                Your passwords,{" "}
                                <span className="bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:via-sky-300 dark:to-indigo-300">
                                    stored locally
                                </span>{" "}
                                on your device.
                            </h1>
                            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-[var(--text-muted)] sm:text-lg lg:mx-0">
                                Passcodes is a free, open-source password
                                manager for Android. Local-first on-device
                                storage with no credential cloud synchronization
                                and complete data ownership.
                            </p>
                        </ScrollReveal>

                        {/* 3. Primary & Secondary Action CTAs */}
                        <ScrollReveal delay={80} className="mt-7 w-full">
                            <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                                <ButtonLink href="/downloads" variant="filled">
                                    <Download
                                        className="h-4 w-4"
                                        aria-hidden="true"
                                    />
                                    <span>Download for Android</span>
                                </ButtonLink>
                                <ButtonLink
                                    href={GITHUB_REPO_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    variant="secondary"
                                >
                                    <GithubIcon className="h-4 w-4" />
                                    <span>View on GitHub</span>
                                </ButtonLink>
                            </div>

                            <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
                                <ButtonLink
                                    href={USER_GUIDE_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    variant="ghost"
                                    size="sm"
                                >
                                    <BookOpen className="h-3.5 w-3.5" />
                                    <span>Documentation</span>
                                </ButtonLink>
                                <ButtonLink
                                    href={DISCORD_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    variant="ghost"
                                    size="sm"
                                >
                                    <DiscordIcon className="h-3.5 w-3.5" />
                                    <span>Join Discord</span>
                                </ButtonLink>
                            </div>

                            {/* Keyboard Shortcuts Hint */}
                            <div className="kb-tip mt-6 inline-flex flex-wrap items-center justify-center gap-2 rounded-xl border border-[var(--border-light)] bg-[var(--card-bg)] px-3.5 py-1.5 text-xs text-[var(--text-muted)] backdrop-blur-sm lg:justify-start">
                                <span className="font-medium text-[var(--text)]">
                                    Shortcuts:
                                </span>
                                <span className="inline-flex items-center gap-1">
                                    <kbd className="kbd">P</kbd>
                                    <span className="kb-plus">+</span>
                                    <kbd className="kbd">D</kbd>
                                </span>
                                <span>download APK</span>
                                <span className="kb-dot" aria-hidden="true">
                                    ·
                                </span>
                                <span className="inline-flex items-center gap-1">
                                    <kbd className="kbd">P</kbd>
                                    <span className="kb-plus">+</span>
                                    <kbd className="kbd">?</kbd>
                                </span>
                                <span>all shortcuts</span>
                            </div>
                        </ScrollReveal>
                    </div>

                    {/* RIGHT — PRODUCT IDENTITY PANEL (Desktop: Right Column, Mobile: Supporting Panel) */}
                    <div className="order-2 w-full lg:col-span-5">
                        <ScrollReveal delay={60}>
                            <div className="from-[var(--card-bg-solid)]/90 relative overflow-hidden rounded-2xl border border-[var(--border-light)] bg-gradient-to-b via-[var(--card-bg)] to-[var(--bg-base)] p-5 shadow-xl shadow-black/25 backdrop-blur-md transition-colors duration-300 hover:border-[var(--border)] sm:p-7">
                                {/* Subtle Ambient Radial Accent (Engineered, not glowing blob) */}
                                <div
                                    className="bg-[var(--accent)]/10 pointer-events-none absolute -top-24 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full blur-3xl"
                                    aria-hidden="true"
                                />

                                {/* Brand Mark & Product Label */}
                                <div className="relative flex items-center gap-4">
                                    <div className="relative flex shrink-0 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--card-bg-solid)] p-2.5 shadow-md shadow-black/30">
                                        <Logo className="h-12 w-12 rounded-xl sm:h-14 sm:w-14" />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl font-bold tracking-tight text-[var(--text)]">
                                                Passcodes
                                            </span>
                                            <span className="rounded-md border border-[var(--accent-border)] bg-[var(--accent-subtle)] px-2 py-0.5 font-mono text-[10px] font-semibold text-[var(--accent-light)]">
                                                {displayVersion}
                                            </span>
                                        </div>
                                        <p className="mt-0.5 text-xs font-medium text-[var(--text-muted)]">
                                            Android Password Manager
                                        </p>
                                    </div>
                                </div>

                                {/* Fine Separator */}
                                <div className="my-5 border-t border-[var(--border-light)]" />

                                {/* Three Concise Product Principles */}
                                <div className="space-y-3 text-left">
                                    <div className="bg-[var(--card-bg)]/50 group rounded-xl border border-[var(--border-lighter)] p-3 transition-colors hover:border-[var(--border-light)] hover:bg-[var(--card-bg)]">
                                        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[var(--accent-light)]">
                                            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-light)]" />
                                            <span>Local-first</span>
                                        </div>
                                        <p className="mt-1 text-xs text-[var(--text-muted)] sm:text-sm">
                                            No cloud account or server required.
                                        </p>
                                    </div>

                                    <div className="bg-[var(--card-bg)]/50 group rounded-xl border border-[var(--border-lighter)] p-3 transition-colors hover:border-[var(--border-light)] hover:bg-[var(--card-bg)]">
                                        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[var(--accent-light)]">
                                            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-light)]" />
                                            <span>On-Device</span>
                                        </div>
                                        <p className="mt-1 text-xs text-[var(--text-muted)] sm:text-sm">
                                            Credentials stay on your device.
                                        </p>
                                    </div>

                                    <div className="bg-[var(--card-bg)]/50 group rounded-xl border border-[var(--border-lighter)] p-3 transition-colors hover:border-[var(--border-light)] hover:bg-[var(--card-bg)]">
                                        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[var(--accent-light)]">
                                            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-light)]" />
                                            <span>Open source</span>
                                        </div>
                                        <p className="mt-1 text-xs text-[var(--text-muted)] sm:text-sm">
                                            Transparent software you can
                                            inspect.
                                        </p>
                                    </div>
                                </div>

                                {/* Supporting Capability Detail */}
                                <div className="mt-5 flex items-center justify-center gap-2 border-t border-[var(--border-light)] pt-3.5 text-[11px] font-medium text-[var(--text-dim)]">
                                    <span>Local Storage</span>
                                    <span className="text-[var(--text-dim)]/50">
                                        ·
                                    </span>
                                    <span>Biometric App Lock</span>
                                    <span className="text-[var(--text-dim)]/50">
                                        ·
                                    </span>
                                    <span>Auto-Lock</span>
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>
                </div>

                {/* Technical Stats & Trust Signals Strip */}
                <ScrollReveal delay={120} className="mx-auto mt-14 max-w-5xl">
                    <div className="grid grid-cols-2 gap-4 border-t border-[var(--border-light)] pt-8 sm:grid-cols-4 sm:gap-6">
                        <div className="flex flex-col items-center">
                            <div className="flex items-center gap-1.5 text-xs text-[var(--text-dim)]">
                                <HardDrive className="h-3.5 w-3.5" />
                                <span>Downloads</span>
                            </div>
                            <div className="mt-1 text-lg font-bold text-[var(--text)]">
                                {downloadStats
                                    ? formatNumber(downloadStats.totalDownloads)
                                    : "—"}
                            </div>
                        </div>

                        <div className="flex flex-col items-center">
                            <div className="flex items-center gap-1.5 text-xs text-[var(--text-dim)]">
                                <Cpu className="h-3.5 w-3.5" />
                                <span>Architecture</span>
                            </div>
                            <div className="mt-1 text-lg font-bold text-[var(--text)]">
                                Split ABIs
                            </div>
                        </div>

                        <div className="flex flex-col items-center">
                            <div className="flex items-center gap-1.5 text-xs text-[var(--text-dim)]">
                                <ShieldCheck className="h-3.5 w-3.5" />
                                <span>Storage</span>
                            </div>
                            <div className="mt-1 text-lg font-bold text-[var(--text)]">
                                Local (SQLite)
                            </div>
                        </div>

                        <div className="flex flex-col items-center">
                            <div className="flex items-center gap-1.5 text-xs text-[var(--text-dim)]">
                                <GithubIcon className="h-3.5 w-3.5" />
                                <span>Version</span>
                            </div>
                            <div className="mt-1 font-mono text-lg font-bold text-[var(--text)]">
                                {displayVersion}
                            </div>
                        </div>
                    </div>

                    <div className="trust-strip mt-8 border-t border-[var(--border-light)] pt-6">
                        <span className="trust-item">
                            <ShieldCheck
                                className="h-4 w-4"
                                aria-hidden="true"
                            />
                            MIT Licensed
                        </span>
                        <span className="trust-item">
                            <WifiOff className="h-4 w-4" aria-hidden="true" />
                            No Cloud Sync
                        </span>
                        <span className="trust-item">
                            <Lock className="h-4 w-4" aria-hidden="true" />
                            Biometric App Lock
                        </span>
                        <span className="trust-item">
                            <GithubIcon className="h-4 w-4" />
                            Community Driven
                        </span>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    );
}
