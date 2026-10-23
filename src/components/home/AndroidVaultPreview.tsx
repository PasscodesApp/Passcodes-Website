"use client";

import { useState, useEffect, useRef, useId, useCallback } from "react";
import {
    WifiOff,
    Battery,
    Lock,
    Eye,
    EyeOff,
    Copy,
    Check,
    RefreshCw,
    ShieldCheck,
    Fingerprint,
    Search,
    KeyRound,
    Sparkles,
    Info,
} from "lucide-react";
import { GithubIcon } from "@/components/ui/BrandIcons";
import { cn } from "@/lib/utils";

// 64-character uniform charset (excluding easily confusable characters I, O, l)
// Exactly 64 characters (2^6), enabling zero-bias uniform sampling from 8-bit bytes (256 = 4 * 64)
const SECURE_CHARSET =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*";
const BITS_PER_CHAR = 6; // log2(64) = 6 bits of entropy per character

/**
 * Generates a cryptographically random password using Web Crypto API.
 * Uses exact bitwise masking (& 63) over a 64-character alphabet to eliminate modulo bias.
 */
function generateCryptographicPassword(length: number): string {
    if (
        typeof window !== "undefined" &&
        window.crypto &&
        typeof window.crypto.getRandomValues === "function"
    ) {
        const buffer = new Uint8Array(length);
        window.crypto.getRandomValues(buffer);
        let password = "";
        for (let i = 0; i < length; i++) {
            password += SECURE_CHARSET[buffer[i] & 63];
        }
        return password;
    }

    // Deterministic fallback for SSR or environments without Web Crypto
    let fallback = "";
    for (let i = 0; i < length; i++) {
        fallback +=
            SECURE_CHARSET[Math.floor(Math.random() * SECURE_CHARSET.length)];
    }
    return fallback;
}

// Illustrative sample passwords for demonstration purposes only
const SAMPLE_PASSWORDS: Record<string, string> = {
    github: "gh_demo_9k72m$xL4@qP",
    proton: "pr0t0n_demo_vM77$xQ",
};

export function AndroidVaultPreview({
    displayVersion,
}: {
    displayVersion: string;
}) {
    const [activeTab, setActiveTab] = useState<"vault" | "generator">("vault");
    const [revealed, setRevealed] = useState<Record<string, boolean>>({});
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [announcement, setAnnouncement] = useState<string>("");
    const [passLength, setPassLength] = useState<number>(18);
    const [generatedPassword, setGeneratedPassword] = useState<string>("");
    const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const sliderId = useId();

    // Generate initial password on client mount using Web Crypto
    const regeneratePassword = useCallback((length: number) => {
        setGeneratedPassword(generateCryptographicPassword(length));
    }, []);

    useEffect(() => {
        regeneratePassword(passLength);
    }, [passLength, regeneratePassword]);

    // Clean up timeout on unmount
    useEffect(() => {
        return () => {
            if (copyTimeoutRef.current) {
                clearTimeout(copyTimeoutRef.current);
            }
        };
    }, []);

    const toggleReveal = (id: string) => {
        setRevealed((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    /**
     * Resilient clipboard copy with async navigator.clipboard and fallback to execCommand.
     * Provides screen-reader feedback via aria-live status.
     */
    const handleCopy = async (id: string, text: string, label: string) => {
        let copied = false;

        try {
            if (
                typeof navigator !== "undefined" &&
                navigator.clipboard &&
                typeof navigator.clipboard.writeText === "function"
            ) {
                await navigator.clipboard.writeText(text);
                copied = true;
            } else {
                throw new Error("Clipboard API unavailable");
            }
        } catch {
            // Fallback for non-secure contexts or permission restrictions
            try {
                const textArea = document.createElement("textarea");
                textArea.value = text;
                textArea.style.position = "fixed";
                textArea.style.left = "-9999px";
                textArea.style.top = "-9999px";
                textArea.setAttribute("readonly", "");
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                copied = document.execCommand("copy");
                document.body.removeChild(textArea);
            } catch {
                copied = false;
            }
        }

        if (copied) {
            setCopiedId(id);
            setAnnouncement(`${label} copied to clipboard.`);
            if (copyTimeoutRef.current) {
                clearTimeout(copyTimeoutRef.current);
            }
            copyTimeoutRef.current = setTimeout(() => {
                setCopiedId(null);
                setAnnouncement("");
            }, 1800);
        }
    };

    // Entropy calculation: Length * log2(64) bits
    const calculatedEntropy = passLength * BITS_PER_CHAR;

    return (
        <section
            aria-label="Interactive Android vault preview (illustrative demo)"
            className="relative mx-auto w-full max-w-md select-none"
        >
            {/* Screen Reader Live Region for Clipboard Actions */}
            <div className="sr-only" role="status" aria-live="polite">
                {announcement}
            </div>

            {/* Ambient Radial Accent Glow */}
            <div
                className="pointer-events-none absolute -inset-3 -z-10 rounded-3xl opacity-40 blur-2xl transition-opacity duration-500"
                style={{
                    background:
                        "radial-gradient(circle at 50% 30%, rgba(37, 99, 235, 0.25) 0%, rgba(2, 132, 199, 0.12) 50%, transparent 75%)",
                }}
                aria-hidden="true"
            />

            {/* Android Device Mockup Shell */}
            <div className="relative overflow-hidden rounded-[2.25rem] border-2 border-[var(--border)] bg-[var(--bg-base)] shadow-2xl shadow-black/40 ring-1 ring-white/10">
                {/* Illustrative Simulation Notice Banner */}
                <div className="bg-[var(--card-bg-solid)]/90 flex items-center justify-between border-b border-[var(--border-lighter)] px-4 py-1 text-[10px] text-[var(--text-dim)]">
                    <span className="flex items-center gap-1 font-medium">
                        <Info
                            className="h-3 w-3 text-[var(--accent-light)]"
                            aria-hidden="true"
                        />
                        Illustrative Simulation
                    </span>
                    <span className="font-mono text-[9px]">Sample Data</span>
                </div>

                {/* Device Camera / Speaker Header Bezel */}
                <div className="flex items-center justify-between border-b border-[var(--border-lighter)] bg-[var(--card-bg-solid)] px-6 py-2.5 text-[11px] font-medium text-[var(--text-dim)]">
                    <span className="font-semibold text-[var(--text)]">
                        9:41
                    </span>
                    <div className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        <span className="font-mono text-[10px] uppercase tracking-wider">
                            On-Device
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span
                            title="Offline: No internet permissions requested in AndroidManifest"
                            className="flex items-center gap-1 text-emerald-400"
                        >
                            <WifiOff className="h-3 w-3" aria-hidden="true" />
                        </span>
                        <Battery className="h-3.5 w-3.5" aria-hidden="true" />
                    </div>
                </div>

                {/* In-App App Bar Header */}
                <div className="border-b border-[var(--border-light)] bg-gradient-to-b from-[var(--card-bg-solid)] to-[var(--card-bg)] px-5 py-3.5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <div className="shadow-xs flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-sky-600 text-white">
                                <Lock className="h-4 w-4" />
                            </div>
                            <div>
                                <div className="flex items-center gap-1.5">
                                    <span className="text-sm font-bold tracking-tight text-[var(--text)]">
                                        Passcodes
                                    </span>
                                    <span className="py-0.2 rounded bg-[var(--accent-subtle)] px-1.5 font-mono text-[9px] font-semibold text-[var(--accent-light)]">
                                        {displayVersion}
                                    </span>
                                </div>
                                <p className="text-[10px] text-[var(--text-dim)]">
                                    Local SQLite Storage
                                </p>
                            </div>
                        </div>

                        {/* Interactive Tab Toggle (Vault vs Generator) */}
                        <div
                            role="tablist"
                            aria-label="Vault view modes"
                            className="flex items-center rounded-lg border border-[var(--border-light)] bg-[var(--bg-base)] p-0.5 text-xs"
                        >
                            <button
                                type="button"
                                role="tab"
                                id="tab-vault"
                                aria-selected={activeTab === "vault"}
                                aria-controls="panel-vault"
                                onClick={() => setActiveTab("vault")}
                                className={cn(
                                    "rounded-md px-2.5 py-1 text-[11px] font-medium transition-all duration-150 focus-visible:outline-2 focus-visible:outline-[var(--accent-light)]",
                                    activeTab === "vault"
                                        ? "shadow-xs bg-[var(--accent)] text-white"
                                        : "text-[var(--text-muted)] hover:text-[var(--text)]"
                                )}
                            >
                                Vault
                            </button>
                            <button
                                type="button"
                                role="tab"
                                id="tab-generator"
                                aria-selected={activeTab === "generator"}
                                aria-controls="panel-generator"
                                onClick={() => setActiveTab("generator")}
                                className={cn(
                                    "rounded-md px-2.5 py-1 text-[11px] font-medium transition-all duration-150 focus-visible:outline-2 focus-visible:outline-[var(--accent-light)]",
                                    activeTab === "generator"
                                        ? "shadow-xs bg-[var(--accent)] text-white"
                                        : "text-[var(--text-muted)] hover:text-[var(--text)]"
                                )}
                            >
                                Generator
                            </button>
                        </div>
                    </div>

                    {/* Search Bar (Vault mode) */}
                    {activeTab === "vault" && (
                        <div className="bg-[var(--bg-base)]/80 mt-3 flex items-center gap-2 rounded-xl border border-[var(--border-lighter)] px-3 py-1.5 text-xs text-[var(--text-dim)]">
                            <Search
                                className="h-3.5 w-3.5 text-[var(--text-dim)]"
                                aria-hidden="true"
                            />
                            <span>Search credentials (demo)…</span>
                            <span className="ml-auto rounded bg-[var(--card-bg-hover)] px-1.5 py-0.5 font-mono text-[9px] text-[var(--text-dim)]">
                                Local Only
                            </span>
                        </div>
                    )}
                </div>

                {/* Interactive Content Body */}
                <div className="p-4 sm:p-5">
                    {activeTab === "vault" ? (
                        <div
                            id="panel-vault"
                            role="tabpanel"
                            aria-labelledby="tab-vault"
                            className="space-y-2.5"
                        >
                            {/* Vault Item 1: GitHub */}
                            <div className="group rounded-xl border border-[var(--border-light)] bg-[var(--card-bg)] p-3 transition-all duration-200 hover:border-[var(--border)] hover:bg-[var(--card-bg-hover)]">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2.5">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border-light)] bg-[var(--card-bg-solid)] text-[var(--text)]">
                                            <GithubIcon className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-xs font-semibold text-[var(--text)]">
                                                    GitHub
                                                </span>
                                                <span className="py-0.2 rounded bg-emerald-500/10 px-1.5 text-[9px] font-medium text-emerald-500">
                                                    Biometric
                                                </span>
                                            </div>
                                            <p className="font-mono text-[11px] text-[var(--text-dim)]">
                                                octocat@github.com
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                toggleReveal("github")
                                            }
                                            className="rounded-lg p-1.5 text-[var(--text-dim)] transition-colors hover:bg-[var(--card-bg-hover)] hover:text-[var(--text)] focus-visible:outline-2 focus-visible:outline-[var(--accent-light)]"
                                            aria-label={
                                                revealed.github
                                                    ? "Hide sample GitHub password"
                                                    : "Show sample GitHub password"
                                            }
                                            aria-pressed={!!revealed.github}
                                            title={
                                                revealed.github
                                                    ? "Hide password"
                                                    : "Show password"
                                            }
                                        >
                                            {revealed.github ? (
                                                <EyeOff
                                                    className="h-3.5 w-3.5"
                                                    aria-hidden="true"
                                                />
                                            ) : (
                                                <Eye
                                                    className="h-3.5 w-3.5"
                                                    aria-hidden="true"
                                                />
                                            )}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleCopy(
                                                    "github",
                                                    SAMPLE_PASSWORDS.github,
                                                    "Sample GitHub password"
                                                )
                                            }
                                            className="flex items-center gap-1 rounded-lg border border-[var(--border-lighter)] bg-[var(--card-bg-solid)] px-2 py-1 text-[10px] font-medium text-[var(--text)] transition-all hover:border-[var(--accent-border)] hover:text-[var(--accent-light)] focus-visible:outline-2 focus-visible:outline-[var(--accent-light)]"
                                            aria-label="Copy sample GitHub password"
                                        >
                                            {copiedId === "github" ? (
                                                <>
                                                    <Check
                                                        className="h-3 w-3 text-emerald-400"
                                                        aria-hidden="true"
                                                    />
                                                    <span className="text-emerald-400">
                                                        Copied
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <Copy
                                                        className="h-3 w-3"
                                                        aria-hidden="true"
                                                    />
                                                    <span>Copy</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                                <div className="mt-2 flex items-center justify-between rounded-lg border border-[var(--border-lighter)] bg-[var(--bg-base)] px-2.5 py-1.5 font-mono text-xs">
                                    <span className="tracking-wider text-[var(--text-muted)]">
                                        {revealed.github
                                            ? SAMPLE_PASSWORDS.github
                                            : "••••••••••••••••"}
                                    </span>
                                    <span className="text-[10px] text-[var(--text-dim)]">
                                        Sample Entry
                                    </span>
                                </div>
                            </div>

                            {/* Vault Item 2: Proton Mail */}
                            <div className="group rounded-xl border border-[var(--border-light)] bg-[var(--card-bg)] p-3 transition-all duration-200 hover:border-[var(--border)] hover:bg-[var(--card-bg-hover)]">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2.5">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border-light)] bg-[var(--card-bg-solid)] text-sky-400">
                                            <KeyRound className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-xs font-semibold text-[var(--text)]">
                                                    Proton Mail
                                                </span>
                                                <span className="py-0.2 rounded bg-sky-500/10 px-1.5 text-[9px] font-medium text-sky-400">
                                                    2FA (Sample)
                                                </span>
                                            </div>
                                            <p className="font-mono text-[11px] text-[var(--text-dim)]">
                                                privacy@proton.me
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                toggleReveal("proton")
                                            }
                                            className="rounded-lg p-1.5 text-[var(--text-dim)] transition-colors hover:bg-[var(--card-bg-hover)] hover:text-[var(--text)] focus-visible:outline-2 focus-visible:outline-[var(--accent-light)]"
                                            aria-label={
                                                revealed.proton
                                                    ? "Hide sample Proton password"
                                                    : "Show sample Proton password"
                                            }
                                            aria-pressed={!!revealed.proton}
                                            title={
                                                revealed.proton
                                                    ? "Hide password"
                                                    : "Show password"
                                            }
                                        >
                                            {revealed.proton ? (
                                                <EyeOff
                                                    className="h-3.5 w-3.5"
                                                    aria-hidden="true"
                                                />
                                            ) : (
                                                <Eye
                                                    className="h-3.5 w-3.5"
                                                    aria-hidden="true"
                                                />
                                            )}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleCopy(
                                                    "proton",
                                                    SAMPLE_PASSWORDS.proton,
                                                    "Sample Proton password"
                                                )
                                            }
                                            className="flex items-center gap-1 rounded-lg border border-[var(--border-lighter)] bg-[var(--card-bg-solid)] px-2 py-1 text-[10px] font-medium text-[var(--text)] transition-all hover:border-[var(--accent-border)] hover:text-[var(--accent-light)] focus-visible:outline-2 focus-visible:outline-[var(--accent-light)]"
                                            aria-label="Copy sample Proton password"
                                        >
                                            {copiedId === "proton" ? (
                                                <>
                                                    <Check
                                                        className="h-3 w-3 text-emerald-400"
                                                        aria-hidden="true"
                                                    />
                                                    <span className="text-emerald-400">
                                                        Copied
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <Copy
                                                        className="h-3 w-3"
                                                        aria-hidden="true"
                                                    />
                                                    <span>Copy</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                                <div className="mt-2 flex items-center justify-between rounded-lg border border-[var(--border-lighter)] bg-[var(--bg-base)] px-2.5 py-1.5 font-mono text-xs">
                                    <span className="tracking-wider text-[var(--text-muted)]">
                                        {revealed.proton
                                            ? SAMPLE_PASSWORDS.proton
                                            : "••••••••••••••••"}
                                    </span>
                                    <span className="font-mono text-[10px] text-emerald-400">
                                        Sample OTP: 842 190
                                    </span>
                                </div>
                            </div>

                            {/* Vault Item 3: Local SQLite Architecture Verification */}
                            <div className="bg-[var(--card-bg-solid)]/60 flex items-center justify-between rounded-xl border border-dashed border-[var(--border-light)] px-3.5 py-2.5">
                                <div className="flex items-center gap-2">
                                    <Fingerprint
                                        className="h-4 w-4 text-[var(--accent-light)]"
                                        aria-hidden="true"
                                    />
                                    <div className="text-left">
                                        <p className="text-[11px] font-semibold text-[var(--text)]">
                                            In-App Biometric Lock
                                        </p>
                                        <p className="text-[10px] text-[var(--text-dim)]">
                                            Auto-locks when app goes to
                                            background
                                        </p>
                                    </div>
                                </div>
                                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                                    Active
                                </span>
                            </div>
                        </div>
                    ) : (
                        /* Generator Tab View */
                        <div
                            id="panel-generator"
                            role="tabpanel"
                            aria-labelledby="tab-generator"
                            className="space-y-4"
                        >
                            <div className="rounded-xl border border-[var(--border-light)] bg-[var(--card-bg)] p-3.5">
                                <div className="flex items-center justify-between text-xs text-[var(--text-dim)]">
                                    <span className="font-semibold text-[var(--text)]">
                                        Web Crypto Generator
                                    </span>
                                    <span className="font-mono font-medium text-emerald-400">
                                        {calculatedEntropy} bits entropy
                                    </span>
                                </div>

                                <div className="mt-2.5 flex items-center justify-between gap-2 rounded-lg border border-[var(--border-lighter)] bg-[var(--bg-base)] p-2.5">
                                    <span className="break-all font-mono text-xs font-semibold tracking-wider text-[var(--text)]">
                                        {generatedPassword || "Generating…"}
                                    </span>
                                    <div className="flex shrink-0 items-center gap-1">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                regeneratePassword(passLength)
                                            }
                                            className="rounded-lg p-1.5 text-[var(--text-dim)] transition-colors hover:bg-[var(--card-bg-hover)] hover:text-[var(--text)] focus-visible:outline-2 focus-visible:outline-[var(--accent-light)]"
                                            title="Generate new password"
                                            aria-label="Generate new cryptographically random password"
                                        >
                                            <RefreshCw
                                                className="h-3.5 w-3.5"
                                                aria-hidden="true"
                                            />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleCopy(
                                                    "generated",
                                                    generatedPassword,
                                                    "Generated password"
                                                )
                                            }
                                            className="shadow-xs flex items-center gap-1 rounded-lg bg-[var(--accent)] px-2.5 py-1 text-[11px] font-semibold text-white transition-opacity hover:opacity-95 focus-visible:outline-2 focus-visible:outline-[var(--accent-light)]"
                                            aria-label="Copy generated password"
                                        >
                                            {copiedId === "generated" ? (
                                                <>
                                                    <Check
                                                        className="h-3 w-3"
                                                        aria-hidden="true"
                                                    />
                                                    <span>Copied</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Copy
                                                        className="h-3 w-3"
                                                        aria-hidden="true"
                                                    />
                                                    <span>Copy</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Dynamic Entropy Progress Bar */}
                                <div className="mt-3">
                                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--card-bg-solid)]">
                                        <div
                                            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-200"
                                            style={{
                                                width: `${Math.min(
                                                    100,
                                                    Math.round(
                                                        (calculatedEntropy /
                                                            192) *
                                                            100
                                                    )
                                                )}%`,
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Length Slider */}
                                <div className="mt-4">
                                    <div className="flex justify-between text-[11px] text-[var(--text-dim)]">
                                        <label
                                            htmlFor={sliderId}
                                            className="font-medium text-[var(--text)]"
                                        >
                                            Password Length
                                        </label>
                                        <span className="font-mono font-bold text-[var(--text)]">
                                            {passLength} characters (
                                            {calculatedEntropy} bits)
                                        </span>
                                    </div>
                                    <input
                                        id={sliderId}
                                        type="range"
                                        min={12}
                                        max={32}
                                        value={passLength}
                                        onChange={(e) =>
                                            setPassLength(
                                                Number(e.target.value)
                                            )
                                        }
                                        aria-valuemin={12}
                                        aria-valuemax={32}
                                        aria-valuenow={passLength}
                                        className="mt-2 h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-[var(--card-bg-hover)] accent-[var(--accent)]"
                                        aria-label="Password length slider in characters"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2 rounded-xl border border-[var(--border-light)] bg-[var(--card-bg-solid)] p-3 text-xs text-[var(--text-muted)]">
                                <Sparkles
                                    className="h-4 w-4 shrink-0 text-[var(--accent-light)]"
                                    aria-hidden="true"
                                />
                                <span className="text-[11px] leading-relaxed">
                                    Computed locally in your browser via{" "}
                                    <code>window.crypto.getRandomValues</code>.
                                    Never transmitted across the network.
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Bottom Assurance Badge */}
                <div className="flex items-center justify-between border-t border-[var(--border-light)] bg-[var(--card-bg-solid)] px-5 py-3 text-[11px] text-[var(--text-dim)]">
                    <div className="flex items-center gap-1.5 text-emerald-400">
                        <ShieldCheck
                            className="h-3.5 w-3.5"
                            aria-hidden="true"
                        />
                        <span className="font-semibold">
                            Local SQLite Storage
                        </span>
                    </div>
                    <span>No cloud account required</span>
                </div>
            </div>
        </section>
    );
}
