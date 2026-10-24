import {
    Smartphone,
    WifiOff,
    Code2,
    RefreshCw,
    Database,
    CheckCircle2,
    ArrowRight,
    FileSpreadsheet,
    Layers,
    ShieldCheck,
} from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

export function FeatureGrid() {
    return (
        <section
            className="px-4 py-16 sm:px-6 sm:py-20"
            aria-labelledby="features-heading"
        >
            <div className="mx-auto max-w-6xl">
                <ScrollReveal>
                    <SectionHeader
                        badge="Core Architecture"
                        title="Engineered for Privacy & Control"
                        subtitle="Every architectural decision in Passcodes prioritizes user ownership, local storage, and technical transparency."
                    />
                </ScrollReveal>

                {/* Asymmetric Bento Grid (4 Coordinated Feature Cards) */}
                <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {/* 1. PRIMARY HERO CARD (Spans 2 columns on lg, 2 columns on sm): On-Device Storage */}
                    <ScrollReveal
                        delay={0}
                        className="min-w-0 sm:col-span-2 lg:col-span-2"
                    >
                        <div className="feature-card group relative flex h-full min-w-0 flex-col justify-between overflow-hidden bg-gradient-to-br from-[var(--card-bg-solid)] via-[var(--card-bg)] to-[var(--bg-base)] p-5 text-left sm:p-7">
                            <div
                                className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--accent-light)] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                                aria-hidden="true"
                            />
                            <div className="min-w-0">
                                <div className="mb-4 flex items-center justify-between gap-2">
                                    <span className="feature-icon shrink-0">
                                        <Database
                                            className="h-4 w-4"
                                            aria-hidden="true"
                                        />
                                    </span>
                                    <span className="editorial-badge border border-[var(--border-light)] bg-[var(--card-bg)] text-[var(--accent-light)]">
                                        Local Architecture
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold tracking-tight text-[var(--text)] transition-colors group-hover:text-[var(--accent-light)] sm:text-2xl">
                                    On-Device Storage
                                </h3>
                                <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-[var(--text-muted)] sm:text-base">
                                    Your passwords live strictly on your device
                                    — never uploaded to any server or cloud
                                    database. Passcodes operates with a
                                    self-contained local database, guaranteeing
                                    complete ownership over your stored
                                    credentials.
                                </p>

                                {/* Technical Architectural Pipeline: On-Device Data Flow */}
                                <div className="bg-[var(--bg-base)]/80 mt-6 min-w-0 rounded-xl border border-[var(--border-light)] p-3.5 font-mono text-xs sm:p-4">
                                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border-lighter)] pb-2.5">
                                        <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text)]">
                                            <WifiOff
                                                className="h-3.5 w-3.5 shrink-0 text-emerald-400"
                                                aria-hidden="true"
                                            />
                                            {/* Sub-heading preserves semantic test expectation for "Designed for Offline Privacy" */}
                                            <h4 className="font-sans text-xs font-semibold text-[var(--text)]">
                                                Designed for Offline Privacy
                                            </h4>
                                        </div>
                                        <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                                            Zero Network Permissions
                                        </span>
                                    </div>

                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--card-bg-hover)] text-[var(--text)]">
                                                <Smartphone
                                                    className="h-3.5 w-3.5"
                                                    aria-hidden="true"
                                                />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-[var(--text)]">
                                                    Android Client
                                                </div>
                                                <div className="text-[10px] text-[var(--text-dim)]">
                                                    Local IPC Only
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1.5 text-[var(--accent-light)]">
                                            <span
                                                className="hidden h-[1px] w-6 bg-[var(--border)] sm:block"
                                                aria-hidden="true"
                                            />
                                            <ArrowRight
                                                className="h-3.5 w-3.5 shrink-0"
                                                aria-hidden="true"
                                            />
                                            <span className="text-[11px] font-semibold">
                                                Direct SQLite
                                            </span>
                                            <span
                                                className="hidden h-[1px] w-6 bg-[var(--border)] sm:block"
                                                aria-hidden="true"
                                            />
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                                                <Database
                                                    className="h-3.5 w-3.5"
                                                    aria-hidden="true"
                                                />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-[var(--text)]">
                                                    Local SQLite
                                                </div>
                                                <div className="text-[10px] text-emerald-400">
                                                    Zero Network Sockets
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-5 flex flex-col gap-2 border-t border-[var(--border-lighter)] pt-3 text-xs text-[var(--text-dim)] sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2
                                        className="h-3.5 w-3.5 shrink-0 text-emerald-400"
                                        aria-hidden="true"
                                    />
                                    <span>
                                        100% self-contained database with no
                                        remote server reliance
                                    </span>
                                </div>
                                <span className="font-mono text-[11px] text-[var(--accent-light)]">
                                    No Internet Permission
                                </span>
                            </div>
                        </div>
                    </ScrollReveal>

                    {/* 2. SUPPORTING CARD (Spans 1 column on lg, 1 column on sm): Modern Material UI */}
                    <ScrollReveal
                        delay={80}
                        className="min-w-0 sm:col-span-1 lg:col-span-1"
                    >
                        <div className="feature-card group relative flex h-full min-w-0 flex-col justify-between overflow-hidden bg-gradient-to-br from-[var(--card-bg-solid)] via-[var(--card-bg)] to-[var(--bg-base)] p-5 text-left sm:p-7">
                            <div
                                className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--accent-light)] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                                aria-hidden="true"
                            />
                            <div className="min-w-0">
                                <div className="mb-4 flex items-center justify-between gap-2">
                                    <span className="feature-icon shrink-0">
                                        <Smartphone
                                            className="h-4 w-4"
                                            aria-hidden="true"
                                        />
                                    </span>
                                    <span className="editorial-badge border border-[var(--border-light)] bg-[var(--card-bg)] text-[var(--text-dim)]">
                                        Android M3
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold tracking-tight text-[var(--text)] transition-colors group-hover:text-[var(--accent-light)]">
                                    Modern Material UI
                                </h3>
                                <p className="mt-2.5 text-sm leading-relaxed text-[var(--text-muted)]">
                                    Engineered with Android Material Design 3
                                    guidelines, gesture navigation, and split
                                    ABIs for minimal disk footprint.
                                </p>

                                {/* Material Design Micro-Visual */}
                                <div className="bg-[var(--bg-base)]/80 mt-6 min-w-0 space-y-2 rounded-xl border border-[var(--border-light)] p-3.5">
                                    <div className="flex items-center justify-between gap-1 text-xs">
                                        <span className="flex items-center gap-1.5 font-medium text-[var(--text)]">
                                            <Layers
                                                className="h-3.5 w-3.5 shrink-0 text-[var(--accent-light)]"
                                                aria-hidden="true"
                                            />
                                            Material 3 UI
                                        </span>
                                        <span className="font-mono text-[10px] text-[var(--accent-light)]">
                                            Dynamic Color
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[10px]">
                                        <div className="truncate rounded-lg border border-[var(--border-lighter)] bg-[var(--card-bg)] px-2.5 py-1.5 text-center text-[var(--text-muted)]">
                                            arm64-v8a
                                        </div>
                                        <div className="truncate rounded-lg border border-[var(--border-lighter)] bg-[var(--card-bg)] px-2.5 py-1.5 text-center text-[var(--text-muted)]">
                                            armeabi-v7a
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-5 flex items-center justify-between border-t border-[var(--border-lighter)] pt-3 text-xs text-[var(--text-dim)]">
                                <span>Material 3 Guidelines</span>
                                <span className="font-mono text-emerald-400">
                                    Split ABIs
                                </span>
                            </div>
                        </div>
                    </ScrollReveal>

                    {/* 3. SUPPORTING CARD (Spans 1 column on lg, 1 column on sm): 100% Open Source */}
                    <ScrollReveal
                        delay={160}
                        className="min-w-0 sm:col-span-1 lg:col-span-1"
                    >
                        <div className="feature-card group relative flex h-full min-w-0 flex-col justify-between overflow-hidden bg-gradient-to-br from-[var(--card-bg-solid)] via-[var(--card-bg)] to-[var(--bg-base)] p-5 text-left sm:p-7">
                            <div
                                className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--accent-light)] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                                aria-hidden="true"
                            />
                            <div className="min-w-0">
                                <div className="mb-4 flex items-center justify-between gap-2">
                                    <span className="feature-icon shrink-0">
                                        <Code2
                                            className="h-4 w-4"
                                            aria-hidden="true"
                                        />
                                    </span>
                                    <span className="editorial-badge border border-[var(--border-light)] bg-[var(--card-bg)] text-[var(--text-dim)]">
                                        Transparency
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold tracking-tight text-[var(--text)] transition-colors group-hover:text-[var(--accent-light)]">
                                    100% Open Source
                                </h3>
                                <p className="mt-2.5 text-sm leading-relaxed text-[var(--text-muted)]">
                                    Publicly auditable on GitHub under the MIT
                                    License. Built with community transparency
                                    and open development.
                                </p>

                                {/* Open Source Trust Indicator Panel */}
                                <div className="bg-[var(--bg-base)]/80 mt-6 min-w-0 space-y-2 rounded-xl border border-[var(--border-light)] p-3.5">
                                    <div className="flex items-center justify-between gap-1 text-xs">
                                        <span className="flex items-center gap-1.5 font-medium text-[var(--text)]">
                                            <ShieldCheck
                                                className="h-3.5 w-3.5 shrink-0 text-emerald-400"
                                                aria-hidden="true"
                                            />
                                            Auditable
                                        </span>
                                        <span className="font-mono text-[10px] text-emerald-400">
                                            MIT License
                                        </span>
                                    </div>
                                    <div className="truncate rounded-lg border border-[var(--border-lighter)] bg-[var(--card-bg)] px-2.5 py-1.5 font-mono text-[11px] text-[var(--text-muted)]">
                                        github.com/PasscodesApp
                                    </div>
                                </div>
                            </div>

                            <div className="mt-5 flex items-center justify-between border-t border-[var(--border-lighter)] pt-3 text-xs text-[var(--text-dim)]">
                                <span>Zero Proprietary Blobs</span>
                                <span className="font-mono text-[var(--accent-light)]">
                                    Public Code
                                </span>
                            </div>
                        </div>
                    </ScrollReveal>

                    {/* 4. WIDE SUPPORTING CARD (Spans 2 columns on lg, 2 columns on sm): Import & Export */}
                    <ScrollReveal
                        delay={240}
                        className="min-w-0 sm:col-span-2 lg:col-span-2"
                    >
                        <div className="feature-card group relative flex h-full min-w-0 flex-col justify-between overflow-hidden bg-gradient-to-br from-[var(--card-bg-solid)] via-[var(--card-bg)] to-[var(--bg-base)] p-5 text-left sm:p-7">
                            <div
                                className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--accent-light)] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                                aria-hidden="true"
                            />
                            <div className="min-w-0">
                                <div className="mb-4 flex items-center justify-between gap-2">
                                    <span className="feature-icon shrink-0">
                                        <RefreshCw
                                            className="h-4 w-4"
                                            aria-hidden="true"
                                        />
                                    </span>
                                    <span className="editorial-badge border border-[var(--border-light)] bg-[var(--card-bg)] text-[var(--accent-light)]">
                                        Data Portability
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold tracking-tight text-[var(--text)] transition-colors group-hover:text-[var(--accent-light)] sm:text-2xl">
                                    Import & Export
                                </h3>
                                <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-[var(--text-muted)] sm:text-base">
                                    Import and export compatible password data
                                    using Google Passwords CSV format. Easily
                                    manage and migrate your credentials across
                                    devices with zero vendor lock-in.
                                </p>

                                {/* CSV Portability Visual Schema Preview */}
                                <div className="bg-[var(--bg-base)]/80 mt-6 min-w-0 rounded-xl border border-[var(--border-light)] p-3.5 font-mono text-xs sm:p-4">
                                    <div className="mb-2.5 flex flex-wrap items-center justify-between gap-1.5 text-[11px] text-[var(--text-dim)]">
                                        <span className="flex items-center gap-1.5 font-medium text-[var(--text)]">
                                            <FileSpreadsheet
                                                className="h-3.5 w-3.5 shrink-0 text-[var(--accent-light)]"
                                                aria-hidden="true"
                                            />
                                            Google Passwords CSV Format
                                        </span>
                                        <span className="rounded bg-[var(--accent-subtle)] px-2 py-0.5 text-[10px] font-semibold text-[var(--accent-light)]">
                                            Zero Lock-In
                                        </span>
                                    </div>
                                    <div className="min-w-0 overflow-x-auto rounded-lg border border-[var(--border-lighter)] bg-[var(--card-bg)] p-2.5 text-[11px]">
                                        <div className="whitespace-nowrap text-[var(--text-dim)]">
                                            <span className="text-[var(--accent-light)]">
                                                name
                                            </span>
                                            ,
                                            <span className="text-[var(--accent-light)]">
                                                url
                                            </span>
                                            ,
                                            <span className="text-[var(--accent-light)]">
                                                username
                                            </span>
                                            ,
                                            <span className="text-[var(--accent-light)]">
                                                password
                                            </span>
                                            ,
                                            <span className="text-[var(--accent-light)]">
                                                note
                                            </span>
                                        </div>
                                        <div className="mt-1 whitespace-nowrap text-[var(--text-muted)]">
                                            github.com,https://github.com,user@email.com,••••••••,Sample
                                            Key
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-5 flex flex-col gap-2 border-t border-[var(--border-lighter)] pt-3 text-xs text-[var(--text-dim)] sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2
                                        className="h-3.5 w-3.5 shrink-0 text-emerald-400"
                                        aria-hidden="true"
                                    />
                                    <span>
                                        Local file storage processing —
                                        credentials never leave your custody
                                    </span>
                                </div>
                                <span className="font-mono text-[11px] text-[var(--accent-light)]">
                                    RFC 4180 Format
                                </span>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </div>
        </section>
    );
}
