"use client";

import { useState, useEffect } from "react";
import * as React from "react";
import type { ComponentType, SVGProps } from "react";
import {
    Download,
    FileSearch,
    ShieldAlert,
    CheckCircle2,
    AlertTriangle,
    HelpCircle,
    RefreshCw,
    ChevronDown,
    ChevronUp,
    ExternalLink,
    Smartphone,
    HardDrive,
    Upload,
    AlertCircle,
    Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

type LucideIcon = ComponentType<SVGProps<SVGSVGElement>>;

const INSTALL_STEPS = [
    {
        id: "download",
        label: "Download",
        shortLabel: "Download APK",
        icon: Download,
        description: "Tap the download button on your Android device. The APK downloads to your browser's Downloads folder.",
        visual: "phone-download",
    },
    {
        id: "locate",
        label: "Locate",
        shortLabel: "Find File",
        icon: FileSearch,
        description: "Open Files/My Files app → Downloads folder. File is named like v4.0.0-passcodes-arm64-v8a-app.apk",
        visual: "folder-search",
    },
    {
        id: "permission",
        label: "Permission",
        shortLabel: "Allow Install",
        icon: ShieldAlert,
        description: "If blocked, tap Settings on the prompt → enable 'Allow from this source' for your browser/file manager → retry.",
        visual: "settings-toggle",
        note: "Per-app permission, not a global security downgrade.",
    },
    {
        id: "install",
        label: "Install",
        shortLabel: "Install App",
        icon: CheckCircle2,
        description: "Tap Install (or Update if updating). Wait for completion → tap Open. Your passwords are preserved on update.",
        visual: "install-prompt",
    },
];

const TROUBLESHOOTING_ITEMS: {
    id: string;
    title: string;
    icon: LucideIcon;
    iconBg: string;
    iconColor: string;
    cardColor: string;
    steps: string[];
    warning?: string;
}[] = [
    {
        id: "conflict",
        title: "App not installed / Package conflict",
        icon: AlertTriangle,
        iconBg: "bg-red-500/15 dark:bg-red-500/25",
        iconColor: "text-red-600 dark:text-red-400",
        cardColor: "bg-red-500/10 text-red-600 dark:bg-red-500/15 dark:text-red-400",
        steps: [
            "Ensure APK is from official GitHub Releases (this site links directly).",
            "If a dev/preview build is installed, export passwords first (Settings → Export passwords), then uninstall it.",
            "Try the universal APK if architecture-specific build fails.",
            "Open a GitHub Issue with exact error + Android version if persistent.",
        ],
    },
    {
        id: "parse",
        title: "Parse error / Corrupted package",
        icon: AlertCircle,
        iconBg: "bg-amber-500/15 dark:bg-amber-500/25",
        iconColor: "text-amber-600 dark:text-amber-400",
        cardColor: "bg-amber-500/10 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
        steps: [
            "Delete the partial APK from Downloads folder.",
            "Clear browser cache for GitHub or use a different browser.",
            "Re-download with stable connection; verify file size matches (~48 MB for arm64-v8a in v4.0.0).",
        ],
    },
    {
        id: "generic",
        title: "Install fails silently",
        icon: HelpCircle,
        iconBg: "bg-[var(--accent-subtle)] dark:bg-[var(--accent-subtle)]",
        iconColor: "text-[var(--accent-light)] dark:text-[var(--accent-light)]",
        cardColor: "bg-[var(--accent-subtle)] text-[var(--accent-light)]",
        steps: [
            "Restart phone and retry.",
            "Ensure 200 MB+ free storage.",
            "Try universal APK as fallback.",
            "Check for custom ROM/system policies blocking APK install.",
            "Report on GitHub with device model, Android version, exact error.",
        ],
    },
    {
        id: "update",
        title: "Updating v3.x → v4.0.0",
        icon: RefreshCw,
        iconBg: "bg-blue-500/15 dark:bg-blue-500/25",
        iconColor: "text-blue-600 dark:text-blue-400",
        cardColor: "bg-blue-500/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
        steps: [
            "Export passwords as backup: Settings → Export passwords (Google Passwords CSV).",
            "Tap new APK → choose Update (never uninstall first — that deletes your database).",
            "If passwords don't appear, try Settings → Troubleshooting → Data Recovery (not a substitute for CSV backup).",
        ],
        warning: "Exported CSV contains credentials in plaintext. Store securely and delete after verification.",
    },
];

export function InstallationGuide() {
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        steps: false,
        troubleshooting: false,
    });
    const [reducedMotion, setReducedMotion] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        setReducedMotion(mediaQuery.matches);
        const handler = (event: MediaQueryListEvent) => setReducedMotion(event.matches);
        mediaQuery.addEventListener("change", handler);
        return () => mediaQuery.removeEventListener("change", handler);
    }, []);

    const toggleSection = (section: string) => {
        setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
    };

    const transitionClasses = reducedMotion
        ? "transition-none duration-0"
        : "transition-[max-height,opacity] duration-200 ease-out";

    return (
        <div className="mt-8 space-y-3">
            {/* Steps Section - Compact Stepper */}
            <section className="rounded-2xl border border-[var(--border-light)] bg-[var(--card-bg)] overflow-hidden">
                <button
                    type="button"
                    onClick={() => toggleSection("steps")}
                    className="w-full flex items-center justify-between gap-4 p-3.5 text-left transition-colors duration-160 ease-out hover:bg-[var(--card-bg-hover)]"
                    aria-expanded={expandedSections.steps}
                    aria-controls="install-steps-content"
                >
                    <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-[var(--accent-subtle)] flex items-center justify-center">
                            <Download className="h-3.5 w-3.5 text-[var(--accent-light)]" aria-hidden="true" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-[var(--text)] text-sm">How to Install Passcodes on Android</h3>
                            <p className="text-[11px] text-[var(--text-muted)]">4-step visual guide</p>
                        </div>
                    </div>
                    {expandedSections.steps ? (
                        <ChevronUp className="h-4 w-4 text-[var(--text-dim)] transition-transform duration-160 ease-out" aria-hidden="true" />
                    ) : (
                        <ChevronDown className="h-4 w-4 text-[var(--text-dim)] transition-transform duration-160 ease-out" aria-hidden="true" />
                    )}
                </button>

                <div
                    id="install-steps-content"
                    className={cn(
                        "border-t border-[var(--border-light)] overflow-hidden",
                        transitionClasses,
                        expandedSections.steps ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                    )}
                >
                    <div className="p-4 space-y-3">
                        {/* Visual Stepper */}
                        <div className="relative">
                            {/* Connecting line */}
                            <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-[var(--border-light)]" aria-hidden="true" />

                            {INSTALL_STEPS.map((step, index) => (
                                <div key={step.id} className="relative flex gap-3 pb-3 last:pb-0">
                                    <div className="flex-shrink-0 relative z-10">
                                        <div
                                            className={cn(
                                                "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors duration-160 ease-out",
                                                index === 0
                                                    ? "bg-[var(--accent-light)] border-[var(--accent-light)]"
                                                    : "bg-[var(--card-bg)] border-[var(--border-light)]"
                                            )}
                                        >
                                            {index === 0 ? (
                                                <Check className="h-3 w-3 text-white" aria-hidden="true" />
                                            ) : (
                                                <span className="text-[10px] font-bold text-[var(--text-dim)]" aria-hidden="true">
                                                    {index + 1}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0 pt-0.5">
                                        <div className="flex items-center justify-between gap-2">
                                            <h4 className="font-medium text-[var(--text)] text-sm">{step.shortLabel}</h4>
                                            <span className="text-[10px] text-[var(--text-dim)] font-mono">
                                                Step {index + 1} of {INSTALL_STEPS.length}
                                            </span>
                                        </div>
                                        <p className="mt-1 text-[12px] text-[var(--text-muted)] leading-relaxed">
                                            {step.description}
                                        </p>
                                        {step.note && (
                                            <p className="mt-1.5 text-[11px] text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                                                <AlertCircle className="h-3 w-3 shrink-0" aria-hidden="true" />
                                                <span>{step.note}</span>
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Quick reference icons */}
                        <div className="pt-2 border-t border-[var(--border-light)] flex flex-wrap gap-4">
                            <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-dim)]">
                                <Smartphone className="h-3.5 w-3.5" aria-hidden="true" />
                                <span>Best on Android device</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-dim)]">
                                <HardDrive className="h-3.5 w-3.5" aria-hidden="true" />
                                <span>Desktop: download → transfer via USB/Nearby Share</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Troubleshooting Section */}
            <section className="rounded-2xl border border-[var(--border-light)] bg-[var(--card-bg)] overflow-hidden">
                <button
                    type="button"
                    onClick={() => toggleSection("troubleshooting")}
                    className="w-full flex items-center justify-between gap-4 p-3.5 text-left transition-colors duration-160 ease-out hover:bg-[var(--card-bg-hover)]"
                    aria-expanded={expandedSections.troubleshooting}
                    aria-controls="install-troubleshooting-content"
                >
                    <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center">
                            <AlertTriangle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" aria-hidden="true" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-[var(--text)] text-sm">Troubleshooting & Common Errors</h3>
                            <p className="text-[11px] text-[var(--text-muted)]">Parse errors, install failures, update guidance</p>
                        </div>
                    </div>
                    {expandedSections.troubleshooting ? (
                        <ChevronUp className="h-4 w-4 text-[var(--text-dim)] transition-transform duration-160 ease-out" aria-hidden="true" />
                    ) : (
                        <ChevronDown className="h-4 w-4 text-[var(--text-dim)] transition-transform duration-160 ease-out" aria-hidden="true" />
                    )}
                </button>

                <div
                    id="install-troubleshooting-content"
                    className={cn(
                        "border-t border-[var(--border-light)] overflow-hidden",
                        transitionClasses,
                        expandedSections.troubleshooting ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                    )}
                >
                    <div className="p-4 space-y-3">
                        {TROUBLESHOOTING_ITEMS.map((item, index) => (
                            <div
                                key={item.id}
                                className={cn(
                                    "rounded-xl border p-3 transition-colors duration-160 ease-out",
                                    item.cardColor
                                )}
                            >
                                <div className="flex items-start gap-3">
                                    <div className={cn(
                                        "flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center transition-colors duration-160 ease-out",
                                        item.iconBg
                                    )}>
                                        {React.createElement(item.icon, { className: cn("h-3.5 w-3.5", item.iconColor), "aria-hidden": "true" })}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-medium text-[var(--text)] text-sm">{item.title}</h4>
                                        <ol className="mt-2 space-y-1.5 list-decimal list-inside text-[12px] text-[var(--text-muted)]">
                                            {item.steps.map((s, i) => (
                                                <li key={i}>{s}</li>
                                            ))}
                                        </ol>
                                        {item.warning && (
                                            <p className="mt-2 text-[11px] text-amber-600 dark:text-amber-400 flex items-start gap-1.5">
                                                <AlertCircle className="h-3 w-3 shrink-0 mt-0.5" aria-hidden="true" />
                                                <span><strong>⚠</strong> {item.warning}</span>
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}