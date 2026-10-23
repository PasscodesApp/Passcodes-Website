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
import { AndroidVaultPreview } from "@/components/home/AndroidVaultPreview";
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
                                className="group inline-flex items-center gap-2 rounded-full border border-[var(--border-light)] bg-[var(--card-bg)] px-3.5 py-1 text-xs font-medium text-[var(--text-muted)] backdrop-blur-md transition-all duration-200 hover:border-[var(--accent-border)] hover:bg-[var(--card-bg-hover)] hover:text-[var(--text)] hover:shadow-sm hover:shadow-[var(--shadow-accent)]"
                            >
                                <span className="shadow-xs inline-flex items-center gap-1.5 rounded-full bg-[var(--accent)] px-2 py-0.5 text-[10px] font-bold text-white">
                                    <span className="relative flex h-1.5 w-1.5">
                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
                                    </span>
                                    {displayVersion}
                                </span>
                                <span className="font-medium text-[var(--text)]">
                                    Passcodes {displayVersion} is live
                                </span>
                                <span
                                    className="text-[var(--text-dim)]"
                                    aria-hidden="true"
                                >
                                    ·
                                </span>
                                <span className="flex items-center gap-1 font-semibold text-[var(--accent)] transition-transform duration-150 group-hover:translate-x-0.5 dark:text-[var(--accent-light)]">
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

                    {/* RIGHT — ANDROID VAULT PRODUCT PREVIEW */}
                    <div className="order-2 w-full lg:col-span-5">
                        <ScrollReveal delay={60}>
                            <AndroidVaultPreview
                                displayVersion={displayVersion}
                            />
                        </ScrollReveal>
                    </div>
                </div>

                {/* Technical Stats & Trust Signals Strip */}
                <ScrollReveal delay={120} className="mx-auto mt-14 max-w-5xl">
                    <div className="grid grid-cols-2 gap-3.5 border-t border-[var(--border-light)] pt-8 sm:grid-cols-4 sm:gap-4">
                        <div className="bg-[var(--card-bg)]/50 flex flex-col items-center rounded-xl border border-[var(--border-light)] p-4 backdrop-blur-sm transition-all duration-200 hover:-translate-y-1 hover:border-[var(--border)] hover:bg-[var(--card-bg-hover)] hover:shadow-sm">
                            <div className="flex items-center gap-1.5 text-xs text-[var(--text-dim)]">
                                <HardDrive className="h-3.5 w-3.5 text-[var(--accent-light)]" />
                                <span>Downloads</span>
                            </div>
                            <div className="mt-1 text-lg font-bold text-[var(--text)] sm:text-xl">
                                {downloadStats
                                    ? formatNumber(downloadStats.totalDownloads)
                                    : "—"}
                            </div>
                        </div>

                        <div className="bg-[var(--card-bg)]/50 flex flex-col items-center rounded-xl border border-[var(--border-light)] p-4 backdrop-blur-sm transition-all duration-200 hover:-translate-y-1 hover:border-[var(--border)] hover:bg-[var(--card-bg-hover)] hover:shadow-sm">
                            <div className="flex items-center gap-1.5 text-xs text-[var(--text-dim)]">
                                <Cpu className="h-3.5 w-3.5 text-[var(--accent-light)]" />
                                <span>Architecture</span>
                            </div>
                            <div className="mt-1 text-lg font-bold text-[var(--text)] sm:text-xl">
                                Split ABIs
                            </div>
                        </div>

                        <div className="bg-[var(--card-bg)]/50 flex flex-col items-center rounded-xl border border-[var(--border-light)] p-4 backdrop-blur-sm transition-all duration-200 hover:-translate-y-1 hover:border-[var(--border)] hover:bg-[var(--card-bg-hover)] hover:shadow-sm">
                            <div className="flex items-center gap-1.5 text-xs text-[var(--text-dim)]">
                                <ShieldCheck className="h-3.5 w-3.5 text-[var(--accent-light)]" />
                                <span>Storage</span>
                            </div>
                            <div className="mt-1 text-lg font-bold text-[var(--text)] sm:text-xl">
                                Local (SQLite)
                            </div>
                        </div>

                        <div className="bg-[var(--card-bg)]/50 flex flex-col items-center rounded-xl border border-[var(--border-light)] p-4 backdrop-blur-sm transition-all duration-200 hover:-translate-y-1 hover:border-[var(--border)] hover:bg-[var(--card-bg-hover)] hover:shadow-sm">
                            <div className="flex items-center gap-1.5 text-xs text-[var(--text-dim)]">
                                <GithubIcon className="h-3.5 w-3.5 text-[var(--accent-light)]" />
                                <span>Version</span>
                            </div>
                            <div className="mt-1 font-mono text-lg font-bold text-[var(--text)] sm:text-xl">
                                {displayVersion}
                            </div>
                        </div>
                    </div>

                    <div className="trust-strip mt-8 border-t border-[var(--border-light)] pt-6">
                        <span className="trust-item transition-all duration-150 hover:-translate-y-0.5">
                            <ShieldCheck
                                className="h-4 w-4"
                                aria-hidden="true"
                            />
                            MIT Licensed
                        </span>
                        <span className="trust-item transition-all duration-150 hover:-translate-y-0.5">
                            <WifiOff className="h-4 w-4" aria-hidden="true" />
                            No Cloud Sync
                        </span>
                        <span className="trust-item transition-all duration-150 hover:-translate-y-0.5">
                            <Lock className="h-4 w-4" aria-hidden="true" />
                            Biometric App Lock
                        </span>
                        <span className="trust-item transition-all duration-150 hover:-translate-y-0.5">
                            <GithubIcon className="h-4 w-4" />
                            Community Driven
                        </span>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    );
}
