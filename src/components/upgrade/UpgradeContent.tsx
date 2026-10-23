"use client";

import { useState, useMemo, useRef } from "react";
import Link from "next/link";
import {
    Sparkles,
    RefreshCw,
    ArrowLeftRight,
    AlertTriangle,
    HelpCircle,
    ArrowRight,
    RotateCcw,
    CheckCircle2,
    BookOpen,
    ExternalLink,
    Download,
    MessageSquare,
    ShieldAlert,
    Smartphone,
    Info,
    Calendar,
    Tag,
} from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { getLatestProductionRelease } from "@/lib/changelog";
import {
    USER_GUIDE_URL,
    DOCS_RELEASE_NOTES_URL,
    GITHUB_ISSUES_URL,
    DISCORD_URL,
    TELEGRAM_URL,
} from "@/lib/constants";
import { formatDate } from "@passcodes/passalgo";
import { cn } from "@/lib/utils";

export type SituationKey =
    "first-time" | "update" | "device-switch" | "legacy" | "check-version";

interface SituationOption {
    id: SituationKey;
    title: string;
    description: string;
    badge?: string;
    icon: typeof Sparkles;
}

const SITUATION_OPTIONS: SituationOption[] = [
    {
        id: "first-time",
        title: "Install Passcodes for the first time",
        description:
            "Setting up Passcodes on a clean Android phone without any existing password records.",
        icon: Sparkles,
    },
    {
        id: "update",
        title: "Update an existing installation",
        description:
            "Applying a newer release to the Passcodes app already running on your phone.",
        icon: RefreshCw,
    },
    {
        id: "device-switch",
        title: "Move to another phone or restore data",
        description:
            "Transferring your credentials to a replacement device or restoring after a reinstall.",
        icon: ArrowLeftRight,
    },
    {
        id: "legacy",
        title: "I am on an older v1.x or v2.x release",
        description:
            "Running an unsupported, deprecated release that used the older database architecture.",
        badge: "Deprecated",
        icon: AlertTriangle,
    },
    {
        id: "check-version",
        title: "I am not sure which version I have",
        description:
            "Need help finding where the version number is shown before choosing your next step.",
        icon: HelpCircle,
    },
];

interface FollowUpOption {
    id: string;
    title: string;
    description: string;
    badge?: string;
}

const UPDATE_FOLLOWUP_OPTIONS: FollowUpOption[] = [
    {
        id: "v3",
        title: "v3.x Series",
        description:
            "Modern architecture with Drizzle DB schema (v2). Direct in-place update supported.",
        badge: "Active",
    },
    {
        id: "legacy",
        title: "v2.x or v1.x (Deprecated Releases)",
        description:
            "Legacy Android-native codebase with Room database v1 or v2.",
        badge: "Deprecated",
    },
    {
        id: "not-sure",
        title: "I'm not sure which version is installed",
        description:
            "Guide me through checking my version on Android or inside the app.",
    },
];

const LEGACY_FOLLOWUP_OPTIONS: FollowUpOption[] = [
    {
        id: "v2",
        title: "v2.x releases (v2.0.0, v2.1.0, v2.1.1 - Beta)",
        description:
            "Final Android-native releases using Room DB schema v2. End-of-support reached.",
        badge: "Deprecated",
    },
    {
        id: "v1",
        title: "v1.x releases (v1.0.0, v1.1.x, v1.2.1 - Alpha/Stable)",
        description: "Early Android-native releases using Room DB schema v1.",
        badge: "Deprecated",
    },
    {
        id: "yanked",
        title: "v1.2.0 or v0.1.0 (Explicitly Yanked)",
        description:
            "Retracted historical builds with critical version tag or package name issues.",
        badge: "Yanked",
    },
    {
        id: "not-sure",
        title: "I'm not sure which legacy release I have",
        description:
            "Check version via Android settings or in-app home screen.",
    },
];

export function UpgradeContent() {
    const [situation, setSituation] = useState<SituationKey | null>(null);
    const [followUp, setFollowUp] = useState<string | null>(null);

    const latestProd = useMemo(() => getLatestProductionRelease(), []);

    const situationRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const updateFollowupRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const legacyFollowupRefs = useRef<(HTMLButtonElement | null)[]>([]);

    const resetSelection = () => {
        setSituation(null);
        setFollowUp(null);
    };

    const handleSelectSituation = (id: SituationKey) => {
        setSituation(id);
        setFollowUp(null);
    };

    const handleSituationKeyDown = (
        e: React.KeyboardEvent<HTMLButtonElement>,
        index: number
    ) => {
        let nextIndex = -1;
        if (e.key === "ArrowDown" || e.key === "ArrowRight") {
            e.preventDefault();
            nextIndex = (index + 1) % SITUATION_OPTIONS.length;
        } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
            e.preventDefault();
            nextIndex =
                (index - 1 + SITUATION_OPTIONS.length) %
                SITUATION_OPTIONS.length;
        } else if (e.key === "Home") {
            e.preventDefault();
            nextIndex = 0;
        } else if (e.key === "End") {
            e.preventDefault();
            nextIndex = SITUATION_OPTIONS.length - 1;
        }

        if (nextIndex >= 0) {
            const nextOpt = SITUATION_OPTIONS[nextIndex];
            handleSelectSituation(nextOpt.id);
            situationRefs.current[nextIndex]?.focus();
        }
    };

    const handleUpdateFollowupKeyDown = (
        e: React.KeyboardEvent<HTMLButtonElement>,
        index: number
    ) => {
        let nextIndex = -1;
        if (e.key === "ArrowDown" || e.key === "ArrowRight") {
            e.preventDefault();
            nextIndex = (index + 1) % UPDATE_FOLLOWUP_OPTIONS.length;
        } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
            e.preventDefault();
            nextIndex =
                (index - 1 + UPDATE_FOLLOWUP_OPTIONS.length) %
                UPDATE_FOLLOWUP_OPTIONS.length;
        } else if (e.key === "Home") {
            e.preventDefault();
            nextIndex = 0;
        } else if (e.key === "End") {
            e.preventDefault();
            nextIndex = UPDATE_FOLLOWUP_OPTIONS.length - 1;
        }

        if (nextIndex >= 0) {
            const nextOpt = UPDATE_FOLLOWUP_OPTIONS[nextIndex];
            setFollowUp(nextOpt.id);
            updateFollowupRefs.current[nextIndex]?.focus();
        }
    };

    const handleLegacyFollowupKeyDown = (
        e: React.KeyboardEvent<HTMLButtonElement>,
        index: number
    ) => {
        let nextIndex = -1;
        if (e.key === "ArrowDown" || e.key === "ArrowRight") {
            e.preventDefault();
            nextIndex = (index + 1) % LEGACY_FOLLOWUP_OPTIONS.length;
        } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
            e.preventDefault();
            nextIndex =
                (index - 1 + LEGACY_FOLLOWUP_OPTIONS.length) %
                LEGACY_FOLLOWUP_OPTIONS.length;
        } else if (e.key === "Home") {
            e.preventDefault();
            nextIndex = 0;
        } else if (e.key === "End") {
            e.preventDefault();
            nextIndex = LEGACY_FOLLOWUP_OPTIONS.length - 1;
        }

        if (nextIndex >= 0) {
            const nextOpt = LEGACY_FOLLOWUP_OPTIONS[nextIndex];
            setFollowUp(nextOpt.id);
            legacyFollowupRefs.current[nextIndex]?.focus();
        }
    };

    // Determine current active result key
    const activeResult = useMemo(() => {
        if (!situation) return null;
        if (situation === "first-time") return "first-time";
        if (situation === "device-switch") return "device-switch";
        if (situation === "check-version") return "check-version";

        if (situation === "update") {
            if (!followUp) return null;
            if (followUp === "v3") return "update-v3";
            if (followUp === "legacy") return "legacy-general";
            if (followUp === "not-sure") return "check-version";
        }

        if (situation === "legacy") {
            if (!followUp) return null;
            if (followUp === "v2") return "legacy-v2";
            if (followUp === "v1") return "legacy-v1";
            if (followUp === "yanked") return "yanked";
            if (followUp === "not-sure") return "check-version";
        }

        return null;
    }, [situation, followUp]);

    return (
        <div className="px-4 py-12 sm:px-6 sm:py-16">
            <div className="mx-auto max-w-4xl">
                {/* 1. Breadcrumbs */}
                <ScrollReveal delay={0}>
                    <nav aria-label="Breadcrumb" className="mb-6">
                        <ol className="flex flex-wrap items-center gap-1.5 text-xs text-[var(--text-dim)]">
                            <li>
                                <Link
                                    href="/"
                                    className="transition-colors hover:text-[var(--text)]"
                                >
                                    Home
                                </Link>
                            </li>
                            <li aria-hidden="true">/</li>
                            <li>
                                <span
                                    aria-current="page"
                                    className="font-semibold text-[var(--text)]"
                                >
                                    Upgrade &amp; Migration Center
                                </span>
                            </li>
                        </ol>
                    </nav>

                    <SectionHeader
                        as="h1"
                        badge="Guided Decision Layer"
                        title="Upgrade & Migration Center"
                        subtitle="Find the right next step for your Passcodes installation. Choose your situation, review the important checks, and continue to verified official resources."
                    />
                </ScrollReveal>

                {/* 2. Step 1: Primary Situation Selection */}
                <ScrollReveal delay={60}>
                    <section
                        aria-labelledby="step-1-heading"
                        className="mb-10 rounded-2xl border border-[var(--border-light)] bg-[var(--card-bg)] p-6 backdrop-blur-md sm:p-8"
                    >
                        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent-light)]">
                                    Step 1 of{" "}
                                    {situation === "update" ||
                                    situation === "legacy"
                                        ? "2"
                                        : "1"}
                                </span>
                                <h2
                                    id="step-1-heading"
                                    className="mt-1 text-xl font-bold text-[var(--text)] sm:text-2xl"
                                >
                                    What are you trying to do?
                                </h2>
                                <p className="mt-1 text-xs text-[var(--text-muted)] sm:text-sm">
                                    Select the scenario that best describes your
                                    current setup.
                                </p>
                            </div>

                            {situation && (
                                <button
                                    type="button"
                                    onClick={resetSelection}
                                    className="btn btn-ghost btn-small inline-flex items-center gap-1.5"
                                    aria-label="Start over and reset choices"
                                >
                                    <RotateCcw
                                        className="h-3.5 w-3.5"
                                        aria-hidden="true"
                                    />
                                    <span>Start over</span>
                                </button>
                            )}
                        </div>

                        <div
                            role="radiogroup"
                            aria-label="What are you trying to do?"
                            className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
                        >
                            {SITUATION_OPTIONS.map((opt, index) => {
                                const isSelected = situation === opt.id;
                                const isFirstOption = index === 0;
                                const tabIndex = situation
                                    ? isSelected
                                        ? 0
                                        : -1
                                    : isFirstOption
                                      ? 0
                                      : -1;
                                const Icon = opt.icon;
                                return (
                                    <button
                                        key={opt.id}
                                        ref={(el) => {
                                            situationRefs.current[index] = el;
                                        }}
                                        type="button"
                                        role="radio"
                                        aria-checked={isSelected}
                                        tabIndex={tabIndex}
                                        onKeyDown={(e) =>
                                            handleSituationKeyDown(e, index)
                                        }
                                        onClick={() =>
                                            handleSelectSituation(opt.id)
                                        }
                                        className={cn(
                                            "flex flex-col justify-between rounded-xl border p-4 text-left transition-all duration-150 hover:-translate-y-0.5",
                                            isSelected
                                                ? "border-[var(--accent-light)] bg-[var(--card-bg-hover)] shadow-sm ring-1 ring-[var(--accent-light)]"
                                                : "border-[var(--border-light)] bg-[var(--card-bg)] hover:border-[var(--border)] hover:bg-[var(--card-bg-hover)]"
                                        )}
                                    >
                                        <div>
                                            <div className="mb-3 flex items-center justify-between gap-2">
                                                <div
                                                    className={cn(
                                                        "flex h-8 w-8 items-center justify-center rounded-lg border",
                                                        isSelected
                                                            ? "border-[var(--accent-light)] bg-[var(--accent-subtle)] text-[var(--accent-light)]"
                                                            : "border-[var(--border-light)] bg-[var(--card-bg)] text-[var(--text-dim)]"
                                                    )}
                                                >
                                                    <Icon
                                                        className="h-4 w-4"
                                                        aria-hidden="true"
                                                    />
                                                </div>
                                                {opt.badge && (
                                                    <span className="tag deprecated !text-[10px]">
                                                        {opt.badge}
                                                    </span>
                                                )}
                                            </div>
                                            <span className="block text-sm font-semibold text-[var(--text)]">
                                                {opt.title}
                                            </span>
                                            <p className="mt-1.5 text-xs leading-relaxed text-[var(--text-muted)]">
                                                {opt.description}
                                            </p>
                                        </div>
                                        <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-[var(--accent-light)]">
                                            <span>
                                                {isSelected
                                                    ? "Selected"
                                                    : "Select this"}
                                            </span>
                                            <ArrowRight
                                                className="h-3 w-3"
                                                aria-hidden="true"
                                            />
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </section>
                </ScrollReveal>

                {/* 3. Step 2: Follow-up question if situation is Update */}
                {situation === "update" && (
                    <div className="animate-fade-in">
                        <section
                            aria-labelledby="step-2-update-heading"
                            className="mb-10 rounded-2xl border border-[var(--border-light)] bg-[var(--card-bg)] p-6 backdrop-blur-md sm:p-8"
                        >
                            <div className="mb-5">
                                <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent-light)]">
                                    Step 2 of 2
                                </span>
                                <h2
                                    id="step-2-update-heading"
                                    className="mt-1 text-lg font-bold text-[var(--text)] sm:text-xl"
                                >
                                    Which version family is currently installed
                                    on your phone?
                                </h2>
                                <p className="mt-1 text-xs text-[var(--text-muted)] sm:text-sm">
                                    Updating within the same major version is
                                    straightforward; jumping across legacy
                                    architectures requires special precautions.
                                </p>
                            </div>

                            <div
                                role="radiogroup"
                                aria-label="Installed version family"
                                className="grid gap-3 sm:grid-cols-3"
                            >
                                {UPDATE_FOLLOWUP_OPTIONS.map((opt, index) => {
                                    const isSelected = followUp === opt.id;
                                    const isFirstOption = index === 0;
                                    const tabIndex = followUp
                                        ? isSelected
                                            ? 0
                                            : -1
                                        : isFirstOption
                                          ? 0
                                          : -1;
                                    return (
                                        <button
                                            key={opt.id}
                                            ref={(el) => {
                                                updateFollowupRefs.current[
                                                    index
                                                ] = el;
                                            }}
                                            type="button"
                                            role="radio"
                                            aria-checked={isSelected}
                                            tabIndex={tabIndex}
                                            onKeyDown={(e) =>
                                                handleUpdateFollowupKeyDown(
                                                    e,
                                                    index
                                                )
                                            }
                                            onClick={() => setFollowUp(opt.id)}
                                            className={cn(
                                                "flex flex-col justify-between rounded-xl border p-4 text-left transition-all duration-150 hover:-translate-y-0.5",
                                                isSelected
                                                    ? "border-[var(--accent-light)] bg-[var(--card-bg-hover)] shadow-sm ring-1 ring-[var(--accent-light)]"
                                                    : "border-[var(--border-light)] bg-[var(--card-bg)] hover:border-[var(--border)] hover:bg-[var(--card-bg-hover)]"
                                            )}
                                        >
                                            <div>
                                                <div className="mb-2 flex items-center justify-between gap-2">
                                                    <span className="text-xs font-semibold text-[var(--text)]">
                                                        {opt.title}
                                                    </span>
                                                    {opt.badge && (
                                                        <span
                                                            className={cn(
                                                                "tag !text-[10px]",
                                                                opt.badge ===
                                                                    "Active"
                                                                    ? "stable"
                                                                    : "deprecated"
                                                            )}
                                                        >
                                                            {opt.badge}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs leading-relaxed text-[var(--text-muted)]">
                                                    {opt.description}
                                                </p>
                                            </div>
                                            <div className="mt-3 text-xs font-medium text-[var(--accent-light)]">
                                                {isSelected
                                                    ? "✓ Selected"
                                                    : "Select"}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </section>
                    </div>
                )}

                {/* 4. Step 2: Follow-up question if situation is Legacy */}
                {situation === "legacy" && (
                    <div className="animate-fade-in">
                        <section
                            aria-labelledby="step-2-legacy-heading"
                            className="mb-10 rounded-2xl border border-[var(--border-light)] bg-[var(--card-bg)] p-6 backdrop-blur-md sm:p-8"
                        >
                            <div className="mb-5">
                                <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent-light)]">
                                    Step 2 of 2
                                </span>
                                <h2
                                    id="step-2-legacy-heading"
                                    className="mt-1 text-lg font-bold text-[var(--text)] sm:text-xl"
                                >
                                    Which legacy release family are you using?
                                </h2>
                                <p className="mt-1 text-xs text-[var(--text-muted)] sm:text-sm">
                                    Legacy releases differ fundamentally in
                                    database schema and Android architecture
                                    from current v3.x releases.
                                </p>
                            </div>

                            <div
                                role="radiogroup"
                                aria-label="Legacy release version"
                                className="grid gap-3 sm:grid-cols-2"
                            >
                                {LEGACY_FOLLOWUP_OPTIONS.map((opt, index) => {
                                    const isSelected = followUp === opt.id;
                                    const isFirstOption = index === 0;
                                    const tabIndex = followUp
                                        ? isSelected
                                            ? 0
                                            : -1
                                        : isFirstOption
                                          ? 0
                                          : -1;
                                    return (
                                        <button
                                            key={opt.id}
                                            ref={(el) => {
                                                legacyFollowupRefs.current[
                                                    index
                                                ] = el;
                                            }}
                                            type="button"
                                            role="radio"
                                            aria-checked={isSelected}
                                            tabIndex={tabIndex}
                                            onKeyDown={(e) =>
                                                handleLegacyFollowupKeyDown(
                                                    e,
                                                    index
                                                )
                                            }
                                            onClick={() => setFollowUp(opt.id)}
                                            className={cn(
                                                "flex flex-col justify-between rounded-xl border p-4 text-left transition-all duration-150 hover:-translate-y-0.5",
                                                isSelected
                                                    ? "border-[var(--accent-light)] bg-[var(--card-bg-hover)] shadow-sm ring-1 ring-[var(--accent-light)]"
                                                    : "border-[var(--border-light)] bg-[var(--card-bg)] hover:border-[var(--border)] hover:bg-[var(--card-bg-hover)]"
                                            )}
                                        >
                                            <div>
                                                <div className="mb-2 flex items-center justify-between gap-2">
                                                    <span className="text-xs font-semibold text-[var(--text)]">
                                                        {opt.title}
                                                    </span>
                                                    {opt.badge && (
                                                        <span
                                                            className={cn(
                                                                "tag !text-[10px]",
                                                                opt.badge ===
                                                                    "Yanked"
                                                                    ? "border-amber-500/40 bg-amber-500/10 font-semibold text-amber-600 dark:text-amber-400"
                                                                    : "deprecated"
                                                            )}
                                                        >
                                                            {opt.badge}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs leading-relaxed text-[var(--text-muted)]">
                                                    {opt.description}
                                                </p>
                                            </div>
                                            <div className="mt-3 text-xs font-medium text-[var(--accent-light)]">
                                                {isSelected
                                                    ? "✓ Selected"
                                                    : "Select"}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </section>
                    </div>
                )}

                {/* 5. Recommendation Result Panel */}
                {activeResult && (
                    <div className="animate-fade-in">
                        <div
                            aria-live="polite"
                            className="rounded-2xl border border-[var(--accent-border)] bg-[var(--card-bg-solid)] p-6 shadow-sm transition-all sm:p-8"
                        >
                            {/* Result: First-Time Installation */}
                            {activeResult === "first-time" && (
                                <ResultPanelFirstTime latestProd={latestProd} />
                            )}

                            {/* Result: Standard v3.x Update */}
                            {activeResult === "update-v3" && (
                                <ResultPanelUpdateV3 latestProd={latestProd} />
                            )}

                            {/* Result: Legacy Migration (v1 or v2) */}
                            {(activeResult === "legacy-general" ||
                                activeResult === "legacy-v1" ||
                                activeResult === "legacy-v2") && (
                                <ResultPanelLegacy
                                    tier={
                                        activeResult === "legacy-v1"
                                            ? "v1"
                                            : activeResult === "legacy-v2"
                                              ? "v2"
                                              : "general"
                                    }
                                    latestProd={latestProd}
                                />
                            )}

                            {/* Result: Device Switch / Reinstall / Restore */}
                            {activeResult === "device-switch" && (
                                <ResultPanelDeviceSwitch
                                    latestProd={latestProd}
                                />
                            )}

                            {/* Result: How to identify version */}
                            {activeResult === "check-version" && (
                                <ResultPanelCheckVersion
                                    onSelectV3={() => {
                                        setSituation("update");
                                        setFollowUp("v3");
                                    }}
                                    onSelectLegacy={() => {
                                        setSituation("legacy");
                                        setFollowUp("v2");
                                    }}
                                    onSelectFresh={() => {
                                        setSituation("first-time");
                                        setFollowUp(null);
                                    }}
                                />
                            )}

                            {/* Result: Explicitly Yanked Release */}
                            {activeResult === "yanked" && (
                                <ResultPanelYanked latestProd={latestProd} />
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

/* ========================================================================= */
/* Result Component: First-Time Installation                                 */
/* ========================================================================= */
function ResultPanelFirstTime({
    latestProd,
}: {
    latestProd: ReturnType<typeof getLatestProductionRelease>;
}) {
    return (
        <div>
            <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                    New Installation Pathway
                </span>
                <span className="tag stable">Production Build</span>
            </div>

            <h3 className="text-xl font-bold text-[var(--text)] sm:text-2xl">
                Installing Passcodes for the First Time
            </h3>

            {/* Recommended next step callout */}
            <div className="mt-4 rounded-xl border border-[var(--border-light)] bg-[var(--card-bg)] p-4">
                <div className="flex items-start gap-3">
                    <Sparkles
                        className="mt-0.5 h-5 w-5 shrink-0 text-[var(--accent-light)]"
                        aria-hidden="true"
                    />
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-[var(--accent-light)]">
                            Recommended Next Step
                        </p>
                        <p className="mt-1 text-sm font-medium leading-relaxed text-[var(--text)]">
                            Verify your Android version meets the minimum
                            requirement (Android 8.0+), download the recommended
                            Stable production build, and install the APK
                            package.
                        </p>
                    </div>
                </div>
            </div>

            {/* Before You Continue */}
            <div className="mt-6">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-dim)]">
                    Before You Continue — Pre-Flight Checklist
                </h4>
                <ul className="mt-3 space-y-2.5 text-xs text-[var(--text-muted)] sm:text-sm">
                    <li className="flex items-start gap-2.5">
                        <CheckCircle2
                            className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500"
                            aria-hidden="true"
                        />
                        <span>
                            <strong className="text-[var(--text)]">
                                Check Android version:
                            </strong>{" "}
                            Passcodes requires Android 8.0 (API level 26) or
                            higher.
                        </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                        <CheckCircle2
                            className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500"
                            aria-hidden="true"
                        />
                        <span>
                            <strong className="text-[var(--text)]">
                                Select the right package:
                            </strong>{" "}
                            Modern Android phones generally use the{" "}
                            <code className="rounded bg-[var(--code-bg)] px-1 py-0.5 font-mono text-xs text-[var(--code-fg)]">
                                arm64-v8a
                            </code>{" "}
                            build. If unsure about your phone&apos;s processor,
                            download the{" "}
                            <code className="rounded bg-[var(--code-bg)] px-1 py-0.5 font-mono text-xs text-[var(--code-fg)]">
                                universal
                            </code>{" "}
                            APK.
                        </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                        <CheckCircle2
                            className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500"
                            aria-hidden="true"
                        />
                        <span>
                            <strong className="text-[var(--text)]">
                                Use Stable channel:
                            </strong>{" "}
                            Stick to verified Stable production releases rather
                            than Alpha or Beta test channels for daily password
                            storage.
                        </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                        <CheckCircle2
                            className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500"
                            aria-hidden="true"
                        />
                        <span>
                            <strong className="text-[var(--text)]">
                                Local-only architecture:
                            </strong>{" "}
                            Passcodes does not connect to cloud sync servers or
                            require an online account. Your data remains
                            strictly on your local device.
                        </span>
                    </li>
                </ul>
            </div>

            {/* Target Release Info */}
            {latestProd && (
                <div className="mt-6 rounded-xl border border-[var(--border-light)] bg-[var(--card-bg)] p-4 text-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border-light)] pb-2.5">
                        <div className="flex items-center gap-2">
                            <Tag
                                className="h-3.5 w-3.5 text-[var(--accent-light)]"
                                aria-hidden="true"
                            />
                            <span className="font-semibold text-[var(--text)]">
                                Recommended Release: {latestProd.version}
                            </span>
                        </div>
                        <span className="flex items-center gap-1 text-[var(--text-muted)]">
                            <Calendar className="h-3 w-3" aria-hidden="true" />
                            {formatDate(latestProd.date)}
                        </span>
                    </div>
                    <p className="mt-2 leading-relaxed text-[var(--text-muted)]">
                        {latestProd.summary}
                    </p>
                </div>
            )}

            {/* CTAs */}
            <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-[var(--border-light)] pt-5">
                <Link
                    href="/downloads"
                    className="btn btn-filled inline-flex items-center gap-2"
                >
                    <Download className="h-4 w-4" aria-hidden="true" />
                    <span>Go to Downloads</span>
                </Link>
                <Link
                    href={USER_GUIDE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline inline-flex items-center gap-1.5"
                >
                    <BookOpen className="h-4 w-4" aria-hidden="true" />
                    <span>Official Setup Guide</span>
                    <ExternalLink
                        className="h-3 w-3 opacity-60"
                        aria-hidden="true"
                    />
                </Link>
                {latestProd && (
                    <Link
                        href={`/changelog/${latestProd.slug}`}
                        className="btn btn-ghost inline-flex items-center gap-1.5"
                    >
                        <span>Release Notes</span>
                        <ArrowRight
                            className="h-3.5 w-3.5"
                            aria-hidden="true"
                        />
                    </Link>
                )}
            </div>
        </div>
    );
}

/* ========================================================================= */
/* Result Component: Standard v3.x Update                                    */
/* ========================================================================= */
function ResultPanelUpdateV3({
    latestProd,
}: {
    latestProd: ReturnType<typeof getLatestProductionRelease>;
}) {
    return (
        <div>
            <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
                    <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                    Standard Update Pathway
                </span>
                <span className="tag stable">v3.x Series</span>
            </div>

            <h3 className="text-xl font-bold text-[var(--text)] sm:text-2xl">
                Updating Within the v3.x Series
            </h3>

            {/* Recommended next step callout */}
            <div className="mt-4 rounded-xl border border-[var(--border-light)] bg-[var(--card-bg)] p-4">
                <div className="flex items-start gap-3">
                    <RefreshCw
                        className="mt-0.5 h-5 w-5 shrink-0 text-[var(--accent-light)]"
                        aria-hidden="true"
                    />
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-[var(--accent-light)]">
                            Recommended Next Step
                        </p>
                        <p className="mt-1 text-sm font-medium leading-relaxed text-[var(--text)]">
                            Export your passwords as a precautionary backup,
                            then download and install the latest Stable APK
                            directly over your current application without
                            uninstalling.
                        </p>
                    </div>
                </div>
            </div>

            {/* Before You Continue */}
            <div className="mt-6">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-dim)]">
                    Before You Continue — Pre-Update Checklist
                </h4>
                <ul className="mt-3 space-y-2.5 text-xs text-[var(--text-muted)] sm:text-sm">
                    <li className="flex items-start gap-2.5">
                        <CheckCircle2
                            className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500"
                            aria-hidden="true"
                        />
                        <span>
                            <strong className="text-[var(--text)]">
                                Export your passwords first:
                            </strong>{" "}
                            In Passcodes, navigate to{" "}
                            <code className="rounded bg-[var(--code-bg)] px-1 py-0.5 font-mono text-xs text-[var(--code-fg)]">
                                Settings &rarr; Export passwords
                            </code>{" "}
                            (Google Passwords CSV format) and save the file to a
                            secure location before updating.
                        </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                        <ShieldAlert
                            className="mt-0.5 h-4 w-4 shrink-0 text-amber-500"
                            aria-hidden="true"
                        />
                        <span>
                            <strong className="text-[var(--text)]">
                                CSV data safety:
                            </strong>{" "}
                            An exported password CSV contains your credentials
                            in unencrypted readable plaintext. Keep this file
                            private, avoid uploading or sharing it, and securely
                            delete temporary copies once you have verified your
                            passwords after updating.
                        </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                        <AlertTriangle
                            className="mt-0.5 h-4 w-4 shrink-0 text-amber-500"
                            aria-hidden="true"
                        />
                        <span>
                            <strong className="text-[var(--text)]">
                                Never uninstall the app:
                            </strong>{" "}
                            Tap the new APK file to update in-place. If you
                            uninstall Passcodes from your phone, Android deletes
                            your local database and credentials.
                        </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                        <CheckCircle2
                            className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500"
                            aria-hidden="true"
                        />
                        <span>
                            <strong className="text-[var(--text)]">
                                Documented update path:
                            </strong>{" "}
                            In-series v3.x in-place updates are the documented
                            update path. However, because unforeseen update
                            issues can occur, a verified backup should always be
                            completed first rather than assuming credentials
                            will automatically be preserved.
                        </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                        <Info
                            className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent-light)]"
                            aria-hidden="true"
                        />
                        <span>
                            <strong className="text-[var(--text)]">
                                Optional troubleshooting mechanism:
                            </strong>{" "}
                            If passwords do not show immediately after updating,{" "}
                            <code className="rounded bg-[var(--code-bg)] px-1 py-0.5 font-mono text-xs text-[var(--code-fg)]">
                                Settings &rarr; Troubleshooting &rarr; Data
                                Recovery
                            </code>{" "}
                            (or{" "}
                            <code className="rounded bg-[var(--code-bg)] px-1 py-0.5 font-mono text-xs text-[var(--code-fg)]">
                                Settings &rarr; Recovery
                            </code>{" "}
                            in recent builds) is available as an optional in-app
                            troubleshooting mechanism. It is not a guaranteed
                            recovery process or a substitute for an exported
                            backup.
                        </span>
                    </li>
                </ul>
            </div>

            {/* Target Release Info */}
            {latestProd && (
                <div className="mt-6 rounded-xl border border-[var(--border-light)] bg-[var(--card-bg)] p-4 text-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border-light)] pb-2.5">
                        <span className="font-semibold text-[var(--text)]">
                            Target Update: {latestProd.version} (Stable)
                        </span>
                        <span className="text-[var(--text-muted)]">
                            Published {formatDate(latestProd.date)}
                        </span>
                    </div>
                    <p className="mt-2 leading-relaxed text-[var(--text-muted)]">
                        {latestProd.summary}
                    </p>
                </div>
            )}

            {/* CTAs */}
            <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-[var(--border-light)] pt-5">
                <Link
                    href="/downloads"
                    className="btn btn-filled inline-flex items-center gap-2"
                >
                    <Download className="h-4 w-4" aria-hidden="true" />
                    <span>Get Latest APK</span>
                </Link>
                {latestProd && (
                    <Link
                        href={`/changelog/${latestProd.slug}`}
                        className="btn btn-outline inline-flex items-center gap-1.5"
                    >
                        <span>View Release Notes</span>
                        <ArrowRight className="h-3 w-3" aria-hidden="true" />
                    </Link>
                )}
                <Link
                    href={USER_GUIDE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ghost inline-flex items-center gap-1.5"
                >
                    <BookOpen className="h-4 w-4" aria-hidden="true" />
                    <span>Update Docs</span>
                    <ExternalLink
                        className="h-3 w-3 opacity-60"
                        aria-hidden="true"
                    />
                </Link>
            </div>
        </div>
    );
}

/* ========================================================================= */
/* Result Component: Legacy Upgrade (v1.x or v2.x to v3.x)                   */
/* ========================================================================= */
function ResultPanelLegacy({
    tier,
    latestProd,
}: {
    tier: "v1" | "v2" | "general";
    latestProd: ReturnType<typeof getLatestProductionRelease>;
}) {
    return (
        <div>
            <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="tag deprecated">
                    Deprecated Release Family
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-600 dark:text-red-400">
                    <ShieldAlert className="h-3.5 w-3.5" aria-hidden="true" />
                    Major Architecture Jump
                </span>
            </div>

            <h3 className="text-xl font-bold text-[var(--text)] sm:text-2xl">
                Upgrading from Legacy{" "}
                {tier === "v1"
                    ? "v1.x"
                    : tier === "v2"
                      ? "v2.x"
                      : "v1.x / v2.x"}
            </h3>

            {/* Warning Callout */}
            <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-700 dark:text-red-300">
                <div className="flex items-start gap-3">
                    <AlertTriangle
                        className="mt-0.5 h-5 w-5 shrink-0 text-red-600 dark:text-red-400"
                        aria-hidden="true"
                    />
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
                            Important Safety Notice
                        </p>
                        <p className="mt-1 text-sm font-medium leading-relaxed">
                            v1.x and v2.x releases are Deprecated and have
                            reached End of Support. Passcodes v3 was completely
                            rewritten in Expo (React Native) with a new database
                            architecture (Drizzle DB). Automated in-place
                            database migration across major generational jumps
                            carries risk of data loss.
                        </p>
                    </div>
                </div>
            </div>

            {/* Recommended next step callout */}
            <div className="mt-4 rounded-xl border border-[var(--border-light)] bg-[var(--card-bg)] p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--accent-light)]">
                    Recommended Next Step
                </p>
                <p className="mt-1 text-sm font-medium leading-relaxed text-[var(--text)]">
                    Manually export your passwords to CSV from your current app,
                    do not uninstall Passcodes, and review official guidance or
                    ask the maintainers before attempting an upgrade.
                </p>
            </div>

            {/* Before You Continue */}
            <div className="mt-6">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-dim)]">
                    Mandatory Precautions Before Proceeding
                </h4>
                <ul className="mt-3 space-y-3 text-xs text-[var(--text-muted)] sm:text-sm">
                    <li className="flex items-start gap-2.5">
                        <AlertTriangle
                            className="mt-0.5 h-4 w-4 shrink-0 text-red-500"
                            aria-hidden="true"
                        />
                        <span>
                            <strong className="text-[var(--text)]">
                                Export your passwords immediately:
                            </strong>{" "}
                            In your current v1/v2 app, go to Settings and use
                            the Google Passwords CSV export to save your
                            passwords outside the app. Note that an exported CSV
                            contains credentials in readable plaintext, so store
                            it securely. This backup is your essential safeguard
                            against data loss.
                        </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                        <AlertTriangle
                            className="mt-0.5 h-4 w-4 shrink-0 text-red-500"
                            aria-hidden="true"
                        />
                        <span>
                            <strong className="text-[var(--text)]">
                                Do NOT delete or uninstall the old app:
                            </strong>{" "}
                            Uninstalling wipes the app&apos;s local SQLite
                            database permanently. If an unverified update fails,
                            having the original installation intact may allow
                            recovery.
                        </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                        <Info
                            className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent-light)]"
                            aria-hidden="true"
                        />
                        <span>
                            <strong className="text-[var(--text)]">
                                No guaranteed automated migration:
                            </strong>{" "}
                            v1.x used Room DB (v1), v2.x used Room DB (v2), and
                            v3.x uses Drizzle DB (v2). Passcodes v3 includes an
                            optional in-app troubleshooting tool (
                            <code className="rounded bg-[var(--code-bg)] px-1 py-0.5 font-mono text-xs text-[var(--code-fg)]">
                                Settings &rarr; Troubleshooting &rarr; Data
                                Recovery
                            </code>
                            ), but this is not a guaranteed recovery process or
                            a substitute for an exported backup, and automatic
                            database migration across major architectural jumps
                            is not guaranteed.
                        </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                        <MessageSquare
                            className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent-light)]"
                            aria-hidden="true"
                        />
                        <span>
                            <strong className="text-[var(--text)]">
                                Consult the community:
                            </strong>{" "}
                            If you are unsure about the safest migration path
                            for your exact version, post in the official
                            Telegram or Discord community or open a GitHub
                            discussion before installing.
                        </span>
                    </li>
                </ul>
            </div>

            {/* Official Resources & Target */}
            <div className="mt-6 rounded-xl border border-[var(--border-light)] bg-[var(--card-bg)] p-4 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border-light)] pb-2.5">
                    <span className="font-semibold text-[var(--text)]">
                        Latest Production Target
                        {latestProd ? `: ${latestProd.version}` : ""}
                    </span>
                    <Link
                        href="/changelog/end-of-android-only"
                        className="font-medium text-[var(--accent-light)] underline hover:no-underline"
                    >
                        Read Architecture Transition Milestone
                    </Link>
                </div>
                <p className="mt-2 leading-relaxed text-[var(--text-muted)]">
                    Refer to the v3.0.0 and v3.1.0 release notes for technical
                    background on the Drizzle DB migration and the
                    troubleshooting recovery workflow.
                </p>
            </div>

            {/* CTAs */}
            <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-[var(--border-light)] pt-5">
                <Link
                    href={DISCORD_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-filled inline-flex items-center gap-2"
                >
                    <MessageSquare className="h-4 w-4" aria-hidden="true" />
                    <span>Ask Maintainers on Discord</span>
                    <ExternalLink
                        className="h-3 w-3 opacity-60"
                        aria-hidden="true"
                    />
                </Link>
                <Link
                    href={GITHUB_ISSUES_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline inline-flex items-center gap-1.5"
                >
                    <span>GitHub Issues</span>
                    <ExternalLink
                        className="h-3 w-3 opacity-60"
                        aria-hidden="true"
                    />
                </Link>
                <Link
                    href="/downloads"
                    className="btn btn-ghost inline-flex items-center gap-1.5"
                >
                    <Download className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Current Downloads</span>
                </Link>
            </div>
        </div>
    );
}

/* ========================================================================= */
/* Result Component: Moving Phones / Reinstalling / Restoring Data          */
/* ========================================================================= */
function ResultPanelDeviceSwitch({
    latestProd,
}: {
    latestProd: ReturnType<typeof getLatestProductionRelease>;
}) {
    return (
        <div>
            <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-600 dark:text-purple-400">
                    <ArrowLeftRight
                        className="h-3.5 w-3.5"
                        aria-hidden="true"
                    />
                    Device Migration &amp; Restore
                </span>
                <span className="tag stable">Local Storage Only</span>
            </div>

            <h3 className="text-xl font-bold text-[var(--text)] sm:text-2xl">
                Moving to Another Phone or Restoring Data
            </h3>

            {/* Recommended next step callout */}
            <div className="mt-4 rounded-xl border border-[var(--border-light)] bg-[var(--card-bg)] p-4">
                <div className="flex items-start gap-3">
                    <Smartphone
                        className="mt-0.5 h-5 w-5 shrink-0 text-[var(--accent-light)]"
                        aria-hidden="true"
                    />
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-[var(--accent-light)]">
                            Recommended Next Step
                        </p>
                        <p className="mt-1 text-sm font-medium leading-relaxed text-[var(--text)]">
                            Export your passwords as a CSV file on your old
                            phone, transfer that file securely to your new
                            phone, install the current Stable release, and
                            import your credentials.
                        </p>
                    </div>
                </div>
            </div>

            {/* CSV Data Safety Warning */}
            <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-amber-700 dark:text-amber-300">
                <div className="flex items-start gap-3">
                    <ShieldAlert
                        className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400"
                        aria-hidden="true"
                    />
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                            CSV Data Safety Warning
                        </p>
                        <p className="mt-1 text-sm font-medium leading-relaxed">
                            Exported password CSV files store credentials in
                            readable, unencrypted plaintext. Keep the file
                            strictly private, avoid cloud uploads or messaging
                            channels, and remove temporary copies from both
                            devices once your passwords have been successfully
                            imported and verified.
                        </p>
                    </div>
                </div>
            </div>

            {/* Before You Continue */}
            <div className="mt-6">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-dim)]">
                    Important Facts &amp; Step-by-Step Procedure
                </h4>
                <ul className="mt-3 space-y-3 text-xs text-[var(--text-muted)] sm:text-sm">
                    <li className="flex items-start gap-2.5">
                        <AlertTriangle
                            className="mt-0.5 h-4 w-4 shrink-0 text-amber-500"
                            aria-hidden="true"
                        />
                        <span>
                            <strong className="text-[var(--text)]">
                                No cloud synchronization:
                            </strong>{" "}
                            Passcodes does not provide cloud backup or automatic
                            device-to-device synchronization. Your passwords
                            reside exclusively in your phone&apos;s local
                            storage.
                        </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                        <CheckCircle2
                            className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500"
                            aria-hidden="true"
                        />
                        <span>
                            <strong className="text-[var(--text)]">
                                Step 1 — Export on old phone:
                            </strong>{" "}
                            In Passcodes, navigate to{" "}
                            <code className="rounded bg-[var(--code-bg)] px-1 py-0.5 font-mono text-xs text-[var(--code-fg)]">
                                Settings &rarr; Export passwords
                            </code>{" "}
                            (Google Passwords CSV format). Confirm the file is
                            saved locally to your device.
                        </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                        <CheckCircle2
                            className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500"
                            aria-hidden="true"
                        />
                        <span>
                            <strong className="text-[var(--text)]">
                                Step 2 — Transfer the file securely:
                            </strong>{" "}
                            Send the CSV file directly to your new device using
                            a trusted local method (e.g. USB cable, Nearby
                            Share, or direct transfer). Never upload the file to
                            unencrypted cloud storage.
                        </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                        <CheckCircle2
                            className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500"
                            aria-hidden="true"
                        />
                        <span>
                            <strong className="text-[var(--text)]">
                                Step 3 — Install on new phone:
                            </strong>{" "}
                            Download the latest Stable release
                            {latestProd ? ` (${latestProd.version})` : ""} on
                            your new phone and install the APK package.
                        </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                        <CheckCircle2
                            className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500"
                            aria-hidden="true"
                        />
                        <span>
                            <strong className="text-[var(--text)]">
                                Step 4 — Import credentials:
                            </strong>{" "}
                            In the new app, open{" "}
                            <code className="rounded bg-[var(--code-bg)] px-1 py-0.5 font-mono text-xs text-[var(--code-fg)]">
                                Settings &rarr; Import passwords
                            </code>
                            , select your CSV file, and verify your credentials
                            appear correctly. Securely delete temporary CSV
                            files after verification.
                        </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                        <ShieldAlert
                            className="mt-0.5 h-4 w-4 shrink-0 text-amber-500"
                            aria-hidden="true"
                        />
                        <span>
                            <strong className="text-[var(--text)]">
                                Do NOT wipe your old phone yet:
                            </strong>{" "}
                            Keep your old phone and installation intact until
                            you have confirmed that all your passwords open and
                            work on the new phone.
                        </span>
                    </li>
                </ul>
            </div>

            {/* CTAs */}
            <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-[var(--border-light)] pt-5">
                <Link
                    href="/downloads"
                    className="btn btn-filled inline-flex items-center gap-2"
                >
                    <Download className="h-4 w-4" aria-hidden="true" />
                    <span>Download for New Phone</span>
                </Link>
                <Link
                    href={USER_GUIDE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline inline-flex items-center gap-1.5"
                >
                    <BookOpen className="h-4 w-4" aria-hidden="true" />
                    <span>Official Setup Guide</span>
                    <ExternalLink
                        className="h-3 w-3 opacity-60"
                        aria-hidden="true"
                    />
                </Link>
                <Link
                    href={GITHUB_ISSUES_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ghost inline-flex items-center gap-1.5"
                >
                    <span>Support &amp; Questions</span>
                    <ExternalLink
                        className="h-3 w-3 opacity-60"
                        aria-hidden="true"
                    />
                </Link>
            </div>
        </div>
    );
}

/* ========================================================================= */
/* Result Component: How to identify installed version                       */
/* ========================================================================= */
function ResultPanelCheckVersion({
    onSelectV3,
    onSelectLegacy,
    onSelectFresh,
}: {
    onSelectV3: () => void;
    onSelectLegacy: () => void;
    onSelectFresh: () => void;
}) {
    return (
        <div>
            <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-600 dark:text-sky-400">
                    <HelpCircle className="h-3.5 w-3.5" aria-hidden="true" />
                    Version Identification
                </span>
                <span className="tag beta">Inspection Guide</span>
            </div>

            <h3 className="text-xl font-bold text-[var(--text)] sm:text-2xl">
                How to Check Which Version You Have
            </h3>

            {/* Recommended next step callout */}
            <div className="mt-4 rounded-xl border border-[var(--border-light)] bg-[var(--card-bg)] p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--accent-light)]">
                    Recommended Next Step
                </p>
                <p className="mt-1 text-sm font-medium leading-relaxed text-[var(--text)]">
                    Check your installed version number on the app&apos;s home
                    screen or under Android system App Info, then select your
                    matching path below.
                </p>
            </div>

            {/* Methods */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-[var(--border-light)] bg-[var(--card-bg)] p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text)]">
                        <Smartphone
                            className="h-4 w-4 text-[var(--accent-light)]"
                            aria-hidden="true"
                        />
                        <span>Method 1: Inside the App</span>
                    </div>
                    <ol className="mt-2.5 list-decimal space-y-1.5 pl-5 text-xs text-[var(--text-muted)]">
                        <li>Open the Passcodes application.</li>
                        <li>
                            Look at the bottom of the main passwords list or
                            dashboard.
                        </li>
                        <li>
                            The version label will display the release tag (for
                            example,{" "}
                            <code className="rounded bg-[var(--code-bg)] px-1 py-0.5 font-mono text-[var(--code-fg)]">
                                v3.x-Stable
                            </code>{" "}
                            or{" "}
                            <code className="rounded bg-[var(--code-bg)] px-1 py-0.5 font-mono text-[var(--code-fg)]">
                                v2.x-Beta
                            </code>
                            ).
                        </li>
                    </ol>
                </div>

                <div className="rounded-xl border border-[var(--border-light)] bg-[var(--card-bg)] p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text)]">
                        <Info
                            className="h-4 w-4 text-[var(--accent-light)]"
                            aria-hidden="true"
                        />
                        <span>Method 2: Android System Settings</span>
                    </div>
                    <ol className="mt-2.5 list-decimal space-y-1.5 pl-5 text-xs text-[var(--text-muted)]">
                        <li>
                            Open your phone&apos;s{" "}
                            <strong className="text-[var(--text)]">
                                Settings
                            </strong>{" "}
                            app.
                        </li>
                        <li>
                            Tap{" "}
                            <strong className="text-[var(--text)]">Apps</strong>{" "}
                            &rarr; find{" "}
                            <strong className="text-[var(--text)]">
                                Passcodes
                            </strong>
                            .
                        </li>
                        <li>
                            Scroll to the very bottom of the App Info page to
                            view the installed version number.
                        </li>
                    </ol>
                </div>
            </div>

            {/* Quick action buttons based on findings */}
            <div className="mt-6">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-dim)]">
                    Once You Find Your Version, Continue Here:
                </h4>
                <div className="mt-3 grid gap-2.5 sm:grid-cols-3">
                    <button
                        type="button"
                        onClick={onSelectV3}
                        className="rounded-xl border border-[var(--border-light)] bg-[var(--card-bg)] p-3 text-left transition-colors hover:border-[var(--accent-light)] hover:bg-[var(--card-bg-hover)]"
                    >
                        <p className="text-xs font-bold text-[var(--text)]">
                            I have v3.x
                        </p>
                        <p className="mt-0.5 text-[11px] text-[var(--text-muted)]">
                            Proceed to standard update guidance &rarr;
                        </p>
                    </button>
                    <button
                        type="button"
                        onClick={onSelectLegacy}
                        className="rounded-xl border border-[var(--border-light)] bg-[var(--card-bg)] p-3 text-left transition-colors hover:border-red-500/50 hover:bg-[var(--card-bg-hover)]"
                    >
                        <p className="text-xs font-bold text-red-600 dark:text-red-400">
                            I have v1.x or v2.x
                        </p>
                        <p className="mt-0.5 text-[11px] text-[var(--text-muted)]">
                            Proceed to legacy migration cautions &rarr;
                        </p>
                    </button>
                    <button
                        type="button"
                        onClick={onSelectFresh}
                        className="rounded-xl border border-[var(--border-light)] bg-[var(--card-bg)] p-3 text-left transition-colors hover:border-[var(--accent-light)] hover:bg-[var(--card-bg-hover)]"
                    >
                        <p className="text-xs font-bold text-[var(--text)]">
                            App is not installed
                        </p>
                        <p className="mt-0.5 text-[11px] text-[var(--text-muted)]">
                            Proceed to new installation checklist &rarr;
                        </p>
                    </button>
                </div>
            </div>

            {/* CTAs */}
            <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-[var(--border-light)] pt-5">
                <Link
                    href={USER_GUIDE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-filled inline-flex items-center gap-1.5"
                >
                    <BookOpen className="h-4 w-4" aria-hidden="true" />
                    <span>Official Setup Guide</span>
                    <ExternalLink
                        className="h-3 w-3 opacity-60"
                        aria-hidden="true"
                    />
                </Link>
                <Link
                    href="/changelog"
                    className="btn btn-outline inline-flex items-center gap-1.5"
                >
                    <span>Browse Release History</span>
                    <ArrowRight className="h-3 w-3" aria-hidden="true" />
                </Link>
                <Link
                    href={DISCORD_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ghost inline-flex items-center gap-1.5"
                >
                    <MessageSquare className="h-4 w-4" aria-hidden="true" />
                    <span>Ask Community</span>
                    <ExternalLink
                        className="h-3 w-3 opacity-60"
                        aria-hidden="true"
                    />
                </Link>
            </div>
        </div>
    );
}

/* ========================================================================= */
/* Result Component: Explicitly Yanked Release                               */
/* ========================================================================= */
function ResultPanelYanked({
    latestProd,
}: {
    latestProd: ReturnType<typeof getLatestProductionRelease>;
}) {
    return (
        <div>
            <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="tag border-amber-500/40 bg-amber-500/10 font-semibold text-amber-600 dark:text-amber-400">
                    Yanked / Withdrawn Release
                </span>
                <span className="tag deprecated">Do Not Install</span>
            </div>

            <h3 className="text-xl font-bold text-[var(--text)] sm:text-2xl">
                Handling a Withdrawn or Yanked Release
            </h3>

            {/* Warning Box */}
            <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-amber-700 dark:text-amber-300">
                <div className="flex items-start gap-3">
                    <AlertTriangle
                        className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400"
                        aria-hidden="true"
                    />
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                            Withdrawn from Active Distribution
                        </p>
                        <p className="mt-1 text-sm font-medium leading-relaxed">
                            Yanked releases (such as v1.2.0 or v0.1.0) were
                            pulled due to packaging or naming defects and are
                            not suitable for daily use. Downloads for these
                            releases are disabled.
                        </p>
                    </div>
                </div>
            </div>

            {/* Recommended next step callout */}
            <div className="mt-4 rounded-xl border border-[var(--border-light)] bg-[var(--card-bg)] p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--accent-light)]">
                    Recommended Next Step
                </p>
                <p className="mt-1 text-sm font-medium leading-relaxed text-[var(--text)]">
                    Export any credentials currently stored in the yanked build
                    and upgrade to the recommended Stable production build.
                </p>
            </div>

            {/* Checklist */}
            <div className="mt-6">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-dim)]">
                    Important Checks for Yanked Releases
                </h4>
                <ul className="mt-3 space-y-2.5 text-xs text-[var(--text-muted)] sm:text-sm">
                    <li className="flex items-start gap-2.5">
                        <CheckCircle2
                            className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500"
                            aria-hidden="true"
                        />
                        <span>
                            <strong className="text-[var(--text)]">
                                Why it was yanked:
                            </strong>{" "}
                            For example, v1.2.0 was published with an
                            unincremented version number causing version
                            collision, and v0.1.0 was a prototype under the old
                            package name{" "}
                            <code className="rounded bg-[var(--code-bg)] px-1 py-0.5 font-mono text-xs text-[var(--code-fg)]">
                                com.passwordmanager
                            </code>
                            .
                        </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                        <AlertTriangle
                            className="mt-0.5 h-4 w-4 shrink-0 text-amber-500"
                            aria-hidden="true"
                        />
                        <span>
                            <strong className="text-[var(--text)]">
                                Do not download or redistribute:
                            </strong>{" "}
                            These builds are preserved strictly for repository
                            history and documentation.
                        </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                        <CheckCircle2
                            className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500"
                            aria-hidden="true"
                        />
                        <span>
                            <strong className="text-[var(--text)]">
                                Export your vault:
                            </strong>{" "}
                            If the app can still be opened, use the in-app
                            export feature before removing the build.
                        </span>
                    </li>
                </ul>
            </div>

            {/* CTAs */}
            <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-[var(--border-light)] pt-5">
                <Link
                    href="/downloads"
                    className="btn btn-filled inline-flex items-center gap-2"
                >
                    <Download className="h-4 w-4" aria-hidden="true" />
                    <span>
                        Get Recommended Release
                        {latestProd ? ` (${latestProd.version})` : ""}
                    </span>
                </Link>
                <Link
                    href="/changelog"
                    className="btn btn-outline inline-flex items-center gap-1.5"
                >
                    <span>Read Release Archive</span>
                    <ArrowRight className="h-3 w-3" aria-hidden="true" />
                </Link>
                <Link
                    href={GITHUB_ISSUES_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ghost inline-flex items-center gap-1.5"
                >
                    <span>Report Issues</span>
                    <ExternalLink
                        className="h-3 w-3 opacity-60"
                        aria-hidden="true"
                    />
                </Link>
            </div>
        </div>
    );
}
