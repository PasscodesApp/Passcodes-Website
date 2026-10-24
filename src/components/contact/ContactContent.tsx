"use client";

import { SectionHeader } from "@/components/shared/SectionHeader";
import { ButtonLink } from "@/components/ui/Button";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import {
    GithubIcon,
    DiscordIcon,
    TelegramIcon,
} from "@/components/ui/BrandIcons";
import {
    GITHUB_REPO_URL,
    GITHUB_ISSUES_URL,
    DISCORD_URL,
    TELEGRAM_URL,
    CONTACT_EMAIL,
    USER_GUIDE_URL,
} from "@/lib/constants";
import { Bug, MessageSquare, BookOpen, Mail, ShieldAlert } from "lucide-react";

const contactOptions = [
    {
        Icon: Bug,
        title: "Report a Bug",
        badge: "Technical",
        description:
            "Found something broken or inconsistent? Open an issue on GitHub with reproduction steps.",
        href: `${GITHUB_REPO_URL}/issues/new?template=bug_report.md`,
        label: "Open Issue",
    },
    {
        Icon: MessageSquare,
        title: "Feature Requests & Ideas",
        badge: "Community",
        description:
            "Have a proposal for new functionality or design improvement? Submit a feature request on GitHub Issues.",
        href: GITHUB_ISSUES_URL,
        label: "Request Feature",
    },
    {
        Icon: DiscordIcon,
        title: "Discord Community",
        badge: "Chat",
        description:
            "Chat with developers, ask troubleshooting questions, and get real-time community assistance.",
        href: DISCORD_URL,
        label: "Open Discord",
    },
    {
        Icon: TelegramIcon,
        title: "Telegram Channel",
        badge: "Updates",
        description:
            "Subscribe to our Telegram channel for direct build releases, quick news, and project bulletins.",
        href: TELEGRAM_URL,
        label: "Join Telegram",
    },
    {
        Icon: BookOpen,
        title: "User Documentation",
        badge: "Guides",
        description:
            "Browse detailed user manuals, architecture overviews, installation instructions, and FAQ guides.",
        href: USER_GUIDE_URL,
        label: "Browse Docs",
    },
    {
        Icon: Mail,
        title: "Private & Security Inquiries",
        badge: "Direct",
        description:
            "For confidential inquiries, partnership proposals, or vulnerability disclosures, reach out directly.",
        href: `mailto:${CONTACT_EMAIL}`,
        label: "Send Email",
        mail: true,
    },
];

export function ContactContent() {
    return (
        <div className="px-4 py-12 sm:px-6 sm:py-16">
            <div className="mx-auto max-w-4xl">
                {/* 1. Header */}
                <ScrollReveal delay={0}>
                    <SectionHeader
                        as="h1"
                        badge="Get In Touch"
                        title="Contact & Support"
                        subtitle="Passcodes is open source and community-driven. Reach out through our issue tracker, discussion boards, chat channels, or direct email."
                    />
                </ScrollReveal>

                {/* 2. Communication Categories Grid (Single Minimal Group Reveal) */}
                <ScrollReveal delay={50}>
                    <div className="grid gap-5 sm:grid-cols-2">
                        {contactOptions.map((option) => (
                            <div
                                key={option.title}
                                className="card group relative flex h-full flex-col justify-between overflow-hidden text-left transition-all duration-150 hover:border-[var(--border)]"
                            >
                                <div
                                    className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--accent-light)] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                                    aria-hidden="true"
                                />
                                <div>
                                    <div className="mb-4 flex items-center justify-between">
                                        <span className="feature-icon">
                                            <option.Icon className="h-5 w-5" />
                                        </span>
                                        <span className="editorial-badge border border-[var(--border-light)] bg-[var(--card-bg)] text-[var(--text-dim)]">
                                            {option.badge}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-semibold text-[var(--text)]">
                                        {option.title}
                                    </h3>
                                    <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
                                        {option.description}
                                    </p>
                                </div>
                                <div className="mt-6 border-t border-[var(--border-light)] pt-4">
                                    <ButtonLink
                                        href={option.href}
                                        target={
                                            option.mail ? undefined : "_blank"
                                        }
                                        rel={
                                            option.mail
                                                ? undefined
                                                : "noopener noreferrer"
                                        }
                                        variant="secondary"
                                        size="sm"
                                        className="w-full justify-center sm:w-auto"
                                    >
                                        {option.label}
                                    </ButtonLink>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollReveal>

                {/* 3. Security Disclosure Note */}
                <ScrollReveal delay={100}>
                    <div className="mt-12 flex items-start gap-3.5 rounded-xl border border-[var(--border-light)] bg-[var(--card-bg)] p-5 text-xs text-[var(--text-muted)]">
                        <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-[var(--accent-light)]" />
                        <div>
                            <span className="mb-1 block font-semibold text-[var(--text)]">
                                Responsible Vulnerability Disclosure
                            </span>
                            If you discover a potential security vulnerability
                            in Passcodes, please send an email to{" "}
                            {CONTACT_EMAIL} rather than opening a public issue.
                            We investigate all security reports immediately.
                        </div>
                    </div>
                </ScrollReveal>
            </div>
        </div>
    );
}
