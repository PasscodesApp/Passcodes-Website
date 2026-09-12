import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const DATA_DIR = path.join(rootDir, "src", "data");
const RAW_RELEASES_FILE = path.join(DATA_DIR, "raw-releases.json");
const RAW_CHANGELOG_FILE = path.join(DATA_DIR, "raw-changelog.md");
const RAW_RELEASE_NOTES_FILE = path.join(DATA_DIR, "raw-release-notes.md");
const OUTPUT_FILE = path.join(DATA_DIR, "normalized-releases.json");

const GITHUB_RELEASES_URL = "https://api.github.com/repos/PasscodesApp/Passcodes/releases";
const CHANGELOG_DOCS_URL = "https://raw.githubusercontent.com/PasscodesApp/Passcodes-Docs/main/docs/user-docs/changelog.md";
const RELEASE_NOTES_DOCS_URL = "https://raw.githubusercontent.com/PasscodesApp/Passcodes-Docs/main/docs/user-docs/release-notes.md";

async function fetchWithTimeout(url, options = {}, timeoutMs = 4000) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
        const res = await fetch(url, { ...options, signal: controller.signal });
        clearTimeout(timeout);
        return res;
    } catch (err) {
        clearTimeout(timeout);
        throw err;
    }
}

async function getSourceData() {
    let releases = null;
    let changelogMd = null;
    let releaseNotesMd = null;

    const isOffline =
        process.argv.includes("--offline") || process.env.OFFLINE === "true";

    if (!isOffline) {
        console.log("[sync-releases] Checking GitHub API and Docs repository...");

        try {
            const headers = {
                "User-Agent": "Passcodes-Website-Sync",
                Accept: "application/vnd.github.v3+json",
            };
            const ghToken = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
            if (ghToken) {
                headers["Authorization"] = `Bearer ${ghToken}`;
            }
            const ghRes = await fetchWithTimeout(GITHUB_RELEASES_URL, { headers });
            if (ghRes.ok) {
                const json = await ghRes.json();
                if (Array.isArray(json) && json.length > 0) {
                    releases = json;
                    console.log(`[sync-releases] Fetched ${releases.length} releases live from GitHub API.`);
                }
            } else {
                console.warn(`[sync-releases] GitHub API returned status ${ghRes.status}`);
            }
        } catch (err) {
            console.warn(`[sync-releases] Live GitHub API fetch skipped: ${err.message}`);
        }

        try {
            const clRes = await fetchWithTimeout(CHANGELOG_DOCS_URL);
            if (clRes.ok) {
                changelogMd = await clRes.text();
                console.log("[sync-releases] Fetched changelog.md live from Passcodes-Docs.");
            }
        } catch (err) {
            console.warn(`[sync-releases] Live changelog.md fetch skipped: ${err.message}`);
        }

        try {
            const rnRes = await fetchWithTimeout(RELEASE_NOTES_DOCS_URL);
            if (rnRes.ok) {
                releaseNotesMd = await rnRes.text();
                console.log("[sync-releases] Fetched release-notes.md live from Passcodes-Docs.");
            }
        } catch (err) {
            console.warn(`[sync-releases] Live release-notes.md fetch skipped: ${err.message}`);
        }
    } else {
        console.log("[sync-releases] Offline mode active, skipping network fetch.");
    }

    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (!releases && fs.existsSync(RAW_RELEASES_FILE)) {
        console.log("[sync-releases] Using local snapshot: raw-releases.json");
        const raw = fs.readFileSync(RAW_RELEASES_FILE, "utf8");
        releases = JSON.parse(raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw);
    } else if (releases) {
        fs.writeFileSync(RAW_RELEASES_FILE, JSON.stringify(releases, null, 2), "utf8");
    }

    if (!changelogMd && fs.existsSync(RAW_CHANGELOG_FILE)) {
        console.log("[sync-releases] Using local snapshot: raw-changelog.md");
        const raw = fs.readFileSync(RAW_CHANGELOG_FILE, "utf8");
        changelogMd = raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw;
    } else if (changelogMd) {
        fs.writeFileSync(RAW_CHANGELOG_FILE, changelogMd, "utf8");
    }

    if (!releaseNotesMd && fs.existsSync(RAW_RELEASE_NOTES_FILE)) {
        console.log("[sync-releases] Using local snapshot: raw-release-notes.md");
        const raw = fs.readFileSync(RAW_RELEASE_NOTES_FILE, "utf8");
        releaseNotesMd = raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw;
    } else if (releaseNotesMd) {
        fs.writeFileSync(RAW_RELEASE_NOTES_FILE, releaseNotesMd, "utf8");
    }

    if (!releases || !changelogMd || !releaseNotesMd) {
        throw new Error("[sync-releases] Missing source data. Neither live fetch nor local raw snapshots were available.");
    }

    return { releases, changelogMd, releaseNotesMd };
}

function parseInternalDetails(text) {
    const match = text.match(/```([^`]+)```/);
    if (!match) return undefined;
    const block = match[1];
    const details = {};

    const pkg = block.match(/Package Name\s*=\s*"([^"]+)"/);
    if (pkg) details.packageName = pkg[1];

    const expo = block.match(/Expo SDK\s*=\s*(\d+)/);
    if (expo) details.expoSdk = parseInt(expo[1], 10);

    const minA = block.match(/Min Android\s*=\s*([^\r\n]+)/);
    if (minA) details.minAndroid = minA[1].trim();

    const maxA = block.match(/Max Android\s*=\s*([^\r\n]+)/);
    if (maxA) details.maxAndroid = maxA[1].trim();

    const vc = block.match(/Version Code\s*=\s*(\d+)/);
    if (vc) details.versionCode = parseInt(vc[1], 10);

    const vn = block.match(/Version Name\s*=\s*"([^"]+)"/);
    if (vn) details.versionName = vn[1];

    const db = block.match(/Master Database (?:Schema )?Version\s*=\s*"([^"]+)"/);
    if (db) details.masterDbVersion = db[1];

    return Object.keys(details).length > 0 ? details : undefined;
}

// Safeguard: removes or rewrites known unsupported security/product claims before presentation.
function sanitizeClaimSafety(text) {
    return text
        .replace(/\bAES-256(-GCM)?\b/gi, "secure")
        .replace(/\bArgon2id?\b/gi, "hashing")
        .replace(/\bencrypted\s+(local\s+)?(database|storage|backup|credentials?|room|sqlite)\b/gi, "$1$2")
        .replace(/\breproducible\s+builds?\b/gi, "open builds")
        .replace(/\b1,?000\+\s+downloads?\b/gi, "active downloads")
        .replace(/\bPIN\s+fallback\b/gi, "device authentication")
        .replace(/\byour\s+keys\b/gi, "your credentials");
}

function inferCategory(sections) {
    const titles = sections.map((s) => s.title.toLowerCase());
    if (titles.some((t) => t.includes("breaking") || t.includes("architecture"))) {
        return "Architecture";
    }
    if (titles.some((t) => t.includes("add") || t.includes("preview"))) {
        return "Features";
    }
    if (titles.length > 0 && titles.every((t) => t.includes("fix"))) {
        return "Fixes";
    }
    return "Improvements";
}

function cleanMarkdownItem(item) {
    const cleaned = item
        .replace(/\[\[@([^\]]+)\]\]\([^)]+\)/g, "(@$1)")
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
        .replace(/\{:[^}]+\}/g, "")
        .replace(/\s+/g, " ")
        .trim();
    return sanitizeClaimSafety(cleaned);
}

function parseChangelogSections(sectionBody) {
    const lines = sectionBody.split("\n");
    const sections = [];
    let currentTitle = null;
    let currentItems = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        if (line.startsWith("### ")) {
            if (currentTitle && currentItems.length > 0) {
                sections.push({ title: currentTitle, items: currentItems });
            }
            currentTitle = line.replace(/^###\s+/, "").trim();
            currentItems = [];
        } else if (line.startsWith("#### ")) {
            if (currentTitle && currentItems.length > 0) {
                sections.push({ title: currentTitle, items: currentItems });
            }
            currentTitle = line.replace(/^####\s+/, "").trim();
            currentItems = [];
        } else if (line.startsWith("- ") || line.startsWith("* ")) {
            let itemText = line.replace(/^[-*]\s+/, "");
            while (
                i + 1 < lines.length &&
                lines[i + 1].trim().length > 0 &&
                !lines[i + 1].trim().startsWith("- ") &&
                !lines[i + 1].trim().startsWith("* ") &&
                !lines[i + 1].trim().startsWith("#")
            ) {
                i++;
                itemText += " " + lines[i].trim();
            }
            const cleaned = cleanMarkdownItem(itemText);
            if (
                !cleaned.startsWith("Checkout Release") &&
                !cleaned.startsWith("Release Notes") &&
                !cleaned.startsWith("Full Changelog") &&
                !cleaned.startsWith("---")
            ) {
                currentItems.push(cleaned);
            }
        }
    }

    if (currentTitle && currentItems.length > 0) {
        sections.push({ title: currentTitle, items: currentItems });
    }

    return sections;
}

const EDITORIAL_METADATA = {
    "v3.2.1": {
        title: "v3.2.1 — Split ABIs & Screenshot Prevention",
        category: "Improvements",
        summary: "Support for split Android ABIs for smaller download sizes, tab navigation back-stack fixes, screenshot prevention toggle, and UI consistency.",
    },
    "v3.2.0": {
        title: "v3.2.0 — Modern Material UI & Dark Mode",
        category: "Features",
        summary: "Complete Material 3 UI overhaul, system dark mode support, gesture navigation, and screen capture prevention.",
    },
    "v3.1.0": {
        title: "v3.1.0 — Biometric Auth & Google Passwords Import/Export",
        category: "Features",
        summary: "Biometric authentication (fingerprint/face unlock), Google Passwords CSV import & export, password detail viewer, and data recovery safeguards.",
    },
    "v3.0.0": {
        title: "v3.0.0 — Complete Architecture Rewrite (Expo / React Native)",
        category: "Architecture",
        isMajor: true,
        summary: "Major from-scratch architectural rewrite transitioning Passcodes from the legacy native Android codebase to Expo and React Native, establishing a clean foundation for core password management.",
    },
    "v2.1.1": {
        title: "v2.1.1 — Biometric Auth & Navigation Scaffolding",
        category: "Improvements",
        summary: "Biometric authentication integration, dual navigation scaffolding, and autofill service adjustments in the pre-rewrite native architecture.",
    },
    "v2.1.0": {
        title: "v2.1.0 — Dual Navigation & Android 17 Support",
        category: "Architecture",
        summary: "Dual navigation architecture supporting both classic and modern interfaces, official Android 17 compatibility, and announcement of the upcoming transition to Expo.",
    },
    "v2.0.0": {
        title: "v2.0.0 — Compose Multiplatform Design System",
        category: "Features",
        isMajor: true,
        summary: "Brand new Compose Multiplatform design system, SQLite database v2 migration, and preview Android autofill service in the native codebase.",
    },
    "v1.2.1": {
        title: "v1.2.1 — Version Name Fix & Release Alignment",
        category: "Fixes",
        summary: "Targeted maintenance release correcting version naming and code metadata from the yanked v1.2.0 release to ensure consistent bug reporting and updates.",
    },
    "v1.2.0": {
        title: "v1.2.0 — Jetpack Compose Preview UI (Yanked)",
        category: "Improvements",
        isYanked: true,
        yankedReason: "Yanked release: version name was mistakenly kept as v1.1.2-Alpha during release packaging. Superseded immediately by v1.2.1.",
        summary: "Early preview of Jetpack Compose UI for basic password operations and improved rendering performance. Explicitly yanked due to version metadata duplication.",
    },
    "v1.1.2": {
        title: "v1.1.2 — Architecture Cleanup & Multi-Module Refactor",
        category: "Architecture",
        summary: "Extensive internal code quality refactor, modular multi-module Gradle project structure, and settings schema migration while preserving all local password data untouched.",
    },
    "v1.1.1": {
        title: "v1.1.1 — CSV Import File Fix",
        category: "Fixes",
        summary: "Fixes file picker MIME type resolution bug that prevented selecting CSV files during credential import.",
    },
    "v1.1.0": {
        title: "v1.1.0 — UI Improvements & GitHub Organization Transition",
        category: "Features",
        summary: "Visual UI refinements on the credential viewer, in-app feature flagging system for preview features, basic update checker, and official transition to the PasscodesApp GitHub organization.",
    },
    "v1.0.0": {
        title: "v1.0.0 — First Official Stable Release",
        category: "Features",
        isMajor: true,
        summary: "The inaugural stable release of the original native Android application. Offline-first local password storage on device via Room SQLite with zero cloud dependencies.",
    },
    "v0.1.0": {
        title: "v0.1.0 — Initial Prototype Alpha (Yanked)",
        category: "Features",
        isMajor: true,
        isYanked: true,
        yankedReason: "Yanked prototype release: very early premature prototype published under com.passwordmanager. Kept strictly for documentation and project history.",
        summary: "The very first proof-of-concept prototype for Passcodes, published under com.passwordmanager. Offline-first local password storage prototype.",
    },
};

const ARCHITECTURE_MILESTONE = {
    slug: "end-of-android-only",
    version: "Architecture Transition",
    title: "End of Android-Only Codebase — Migration to Expo & React Native",
    date: "2026-05-20",
    releaseType: "Stable",
    category: "Architecture",
    isMilestone: true,
    isMajor: true,
    summary: "Passcodes officially concluded development on the native Android (Kotlin / Compose) codebase and transitioned to a unified Expo / React Native architecture with local SQLite and Drizzle ORM.",
    highlights: [
        "Concluded 20 months of native Android development (v0.1.0 through v2.1.1).",
        "Transitioned foundation to Expo and React Native for modern cross-platform capability.",
        "Replaced native Room/SQLite schema with expo-sqlite and Drizzle ORM.",
        "Maintained 100% offline-first local device credential storage.",
    ],
    sections: [
        {
            title: "Architectural Shift",
            items: [
                "Officially retired the legacy Kotlin Multiplatform / native Android codebase.",
                "Adopted Expo SDK and React Native runtime for declarative, fluid UI.",
                "Migrated local persistence to SQLite using Drizzle ORM.",
                "Established unified design language across all supported form factors.",
            ],
        },
    ],
};

async function main() {
    const { releases, changelogMd, releaseNotesMd } = await getSourceData();

    const ghMap = new Map();
    for (const r of releases) {
        ghMap.set(r.tag_name, r);
    }

    const clSections = changelogMd.split(/(?=^## )/m).filter((s) => s.startsWith("## "));
    const rnSections = releaseNotesMd.split(/(?=^## )/m).filter((s) => s.startsWith("## "));

    const rnMap = new Map();
    for (const s of rnSections) {
        const firstLine = s.split("\n")[0].trim();
        const tagMatch = firstLine.match(/v[\d\.]+/);
        if (tagMatch) {
            rnMap.set(tagMatch[0], s);
        }
    }

    const normalizedEntries = [];

    for (const s of clSections) {
        const firstLine = s.split("\n")[0].trim();

        if (firstLine.includes("End Of Android Only")) {
            normalizedEntries.push(ARCHITECTURE_MILESTONE);
            continue;
        }

        const tagMatch = firstLine.match(/v[\d\.]+/);
        if (!tagMatch) continue;

        const version = tagMatch[0];
        const ghRelease = ghMap.get(version);
        const rnSection = rnMap.get(version) || "";

        const headerMatch = firstLine.match(/^##\s+(v[\d\.]+)\s*-\s*([A-Za-z]+)(?:\s*\(([^)]+)\))?(?:\s*\[([^\]]+)\])?/i);
        const releaseType = headerMatch ? headerMatch[2] : "Alpha";
        const isYankedHeader = firstLine.toLowerCase().includes("yanked");

        const editorial = EDITORIAL_METADATA[version] || {};
        const isYanked = editorial.isYanked ?? isYankedHeader;
        const slug = `${version.replace(/\./g, "-")}-${releaseType.toLowerCase()}${isYanked ? "-yanked" : ""}`;

        let date = ghRelease ? ghRelease.published_at.slice(0, 10) : "";
        if (!date && headerMatch && headerMatch[3]) {
            const parsedD = new Date(headerMatch[3]);
            if (!isNaN(parsedD.getTime())) {
                date = parsedD.toISOString().slice(0, 10);
            }
        }
        if (!date) date = "2026-01-01";

        let tldr = "";
        const tldrMatch = rnSection.match(/\*\*`?TL;DR`?:?\s*([^]*?)\*\*/i);
        if (tldrMatch) {
            tldr = tldrMatch[1].replace(/`+/g, "").trim();
        }

        const internalDetails = parseInternalDetails(s) || (rnSection ? parseInternalDetails(rnSection) : undefined);
        const parsedSections = parseChangelogSections(s);

        let highlights = [];
        for (const sec of parsedSections) {
            for (const item of sec.items) {
                if (highlights.length < 5) {
                    highlights.push(item);
                }
            }
        }

        let compareUrl = undefined;
        const compareMatch = s.match(/https:\/\/github\.com\/PasscodesApp\/Passcodes\/compare\/[^\s\)]+/);
        if (compareMatch) {
            compareUrl = compareMatch[0];
        }

        const assetsCount = ghRelease && ghRelease.assets ? ghRelease.assets.length : 0;
        const downloadCount = ghRelease && ghRelease.assets ? ghRelease.assets.reduce((sum, a) => sum + (a.download_count || 0), 0) : 0;

        const category = editorial.category || inferCategory(parsedSections);
        const isMajor = editorial.isMajor ?? (version.endsWith(".0.0") || releaseType === "Stable");

        // Deprecation rule: v1.x and v2.x releases are deprecated (superseded by newer database architecture in later releases).
        const majorMatch = version.match(/^v?(\d+)\./i);
        const majorVersion = majorMatch ? parseInt(majorMatch[1], 10) : undefined;
        const isDeprecated = majorVersion === 1 || majorVersion === 2;
        const deprecatedReason = isDeprecated
            ? "Superseded by the newer database architecture introduced in later releases."
            : undefined;

        const entry = {
            slug,
            version,
            title: editorial.title || `${version} — ${tldr || "Release Updates"}`,
            date,
            releaseType,
            category,
            summary: editorial.summary || (tldr ? `Passcodes ${version}: ${tldr}` : `Passcodes ${version} release update.`),
            highlights: highlights.length > 0 ? highlights : undefined,
            sections: parsedSections.length > 0 ? parsedSections : undefined,
            internalDetails,
            tldr: tldr || undefined,
            githubUrl: ghRelease ? ghRelease.html_url : `https://github.com/PasscodesApp/Passcodes/releases/tag/${version}`,
            compareUrl,
            isMajor,
            isYanked: isYanked || false,
            yankedReason: editorial.yankedReason || undefined,
            isDeprecated,
            deprecatedReason,
            assetsCount: assetsCount > 0 ? assetsCount : undefined,
            downloadCount: downloadCount > 0 ? downloadCount : undefined,
        };

        normalizedEntries.push(entry);
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(normalizedEntries, null, 2), "utf8");
    console.log(`[sync-releases] Successfully generated ${OUTPUT_FILE} with ${normalizedEntries.length} entries.`);
}

main().catch((err) => {
    console.error("[sync-releases] Fatal error:", err);
    process.exit(1);
});
