export const GITHUB_ORG = "PasscodesApp";
export const GITHUB_REPO = "Passcodes";
export const GITHUB_API_BASE = "https://api.github.com";
export const REPO_PATH = `${GITHUB_ORG}/${GITHUB_REPO}`;

export const API_ENDPOINTS = {
    latestRelease: `${GITHUB_API_BASE}/repos/${REPO_PATH}/releases/latest`,
    allReleases: `${GITHUB_API_BASE}/repos/${REPO_PATH}/releases`,
    contributors: `${GITHUB_API_BASE}/repos/${REPO_PATH}/contributors`,
    repoInfo: `${GITHUB_API_BASE}/repos/${REPO_PATH}`,
} as const;

export const NAV_ROUTES = [
    { label: "Home", href: "/" },
    { label: "Downloads", href: "/downloads" },
    { label: "Changelog", href: "/changelog" },
    { label: "Community", href: "/community" },
    { label: "Contact Us", href: "/contact" },
] as const;

export const SITE_META = {
    title: "Passcodes - Open Source Password Manager for Android",
    description:
        "Passcodes is a free, open-source password manager for Android. Store and manage your passwords locally on your device with no credential cloud sync.",
    url: "https://passcodesapp.github.io/Passcodes-Website",
    ogImage: "/og-image.png",
    twitterHandle: "@PasscodesApp",
} as const;

export const GITHUB_REPO_URL = `https://github.com/${REPO_PATH}`;
export const GITHUB_ISSUES_URL = `${GITHUB_REPO_URL}/issues`;
export const GITHUB_RELEASES_URL = `${GITHUB_REPO_URL}/releases`;
export const LICENSE_URL = `${GITHUB_REPO_URL}/blob/main/LICENSE.txt`;

export const PASSCODES_DOCS_REPO_URL =
    "https://github.com/PasscodesApp/Passcodes-Docs";
export const PASSCODES_DOCS_URL =
    "https://passcodesapp.github.io/Passcodes-Docs/";
export const PASSCODES_CONTRIBUTING_URL =
    "https://passcodesapp.github.io/Passcodes-Docs/contributing/CONTRIBUTING/";
export const CONTRIBUTING_GUIDE_URL = PASSCODES_CONTRIBUTING_URL;

export const USER_GUIDE_URL =
    "https://passcodesapp.github.io/Passcodes-Docs/user-docs/installing/";
export const DOCS_RELEASE_NOTES_URL =
    "https://passcodesapp.github.io/Passcodes-Docs/user-docs/release-notes/";
export const CONTACT_EMAIL = "jeeldobariya38@gmail.com";
export const LOGO_SRC = `${process.env.BASE_PATH || ""}/logo.png`;
export const LOGO_WEBP = `${process.env.BASE_PATH || ""}/logo.webp`;
export const KOMI_BADGE_SRC = `${process.env.BASE_PATH || ""}/komi-store-badge.png`;
export const KOMI_BADGE_WEBP = `${process.env.BASE_PATH || ""}/komi-store-badge.webp`;
export const DISCORD_URL = "https://discord.gg/kSSkYq7KAQ";
export const TELEGRAM_URL = "https://t.me/passcodescommunity";
export const KOMI_STORE_URL =
    "https://komistore.app/app/?repo=PasscodesApp/Passcodes";
export const RATE_LIMIT_THRESHOLD = 10;
