"use client";

import { useQuery } from "@tanstack/react-query";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { ContributorCard } from "@/components/community/ContributorCard";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorState } from "@/components/ui/ErrorState";
import { ButtonLink } from "@/components/ui/Button";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { getContributors, getRepoInfo } from "@/lib/github";
import {
    FEATURED_CONTRIBUTORS,
    type ContributorProfile,
} from "@/lib/contributors";
import {
    GITHUB_REPO_URL,
    GITHUB_ISSUES_URL,
    PASSCODES_CONTRIBUTING_URL,
} from "@/lib/constants";
import { formatNumber } from "@passcodes/passalgo";
import { Star, GitFork, Users, BookOpen, Code2 } from "lucide-react";
import { GithubIcon } from "@/components/ui/BrandIcons";

type ContributorDisplay = ContributorProfile & { avatarUrl?: string };

export function CommunityContent() {
    const {
        data: contributors,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ["github", "contributors"],
        queryFn: getContributors,
    });
    const { data: repoInfo } = useQuery({
        queryKey: ["github", "repo-info"],
        queryFn: getRepoInfo,
    });

    const featuredLogins = new Set(
        FEATURED_CONTRIBUTORS.map((c) => c.login?.toLowerCase()).filter(
            Boolean
        ) as string[]
    );

    const apiExtra: ContributorDisplay[] = (contributors ?? [])
        .filter(
            (a) =>
                a.type !== "Bot" && !featuredLogins.has(a.login.toLowerCase())
        )
        .map((a) => ({
            name: a.login,
            role: "Contributor",
            login: a.login,
            github: a.html_url,
            avatarUrl: a.avatar_url,
        }));

    const featured: ContributorDisplay[] = FEATURED_CONTRIBUTORS.map((c) => {
        const api = contributors?.find(
            (a) => c.login && a.login.toLowerCase() === c.login.toLowerCase()
        );
        return {
            ...c,
            avatarUrl: c.avatar ?? api?.avatar_url,
            github: c.github ?? api?.html_url,
        };
    });

    // Unified contributor ecosystem: all people who build & contribute together
    const allContributors: ContributorDisplay[] = [...featured, ...apiExtra];
    const totalContributorsCount = allContributors.length;

    return (
        <div className="px-4 py-12 sm:px-6 sm:py-16">
            <div className="mx-auto max-w-5xl">
                {/* 1. Header & Community Intro */}
                <ScrollReveal delay={0}>
                    <SectionHeader
                        as="h1"
                        badge="Open Source Community"
                        title="Community"
                        subtitle="Passcodes is built entirely in the open by passionate engineers and contributors worldwide. Every commit, review, and discussion matters."
                    />

                    {/* Repository Statistics */}
                    {repoInfo && (
                        <div className="mb-12 flex flex-wrap items-center justify-center gap-3">
                            <span className="stat-badge">
                                <Star
                                    className="h-4 w-4 text-[#f59e0b]"
                                    aria-hidden="true"
                                />
                                <strong className="text-[var(--text)]">
                                    {formatNumber(repoInfo.stargazers_count)}
                                </strong>{" "}
                                stars
                            </span>
                            <span className="stat-badge">
                                <GitFork
                                    className="h-4 w-4 text-[var(--accent-light)]"
                                    aria-hidden="true"
                                />
                                <strong className="text-[var(--text)]">
                                    {formatNumber(repoInfo.forks_count)}
                                </strong>{" "}
                                forks
                            </span>
                            <span className="stat-badge">
                                <Users
                                    className="h-4 w-4 text-[var(--text-muted)]"
                                    aria-hidden="true"
                                />
                                <strong className="text-[var(--text)]">
                                    {totalContributorsCount}
                                </strong>{" "}
                                contributors
                            </span>
                        </div>
                    )}
                </ScrollReveal>

                {/* 2. Unified Contributor Section */}
                <div className="my-10 border-t border-[var(--border-light)] pt-10">
                    <ScrollReveal delay={40}>
                        <div className="mb-8 text-center">
                            <h2 className="text-xl font-bold tracking-tight text-[var(--text)] sm:text-2xl">
                                The People Behind Passcodes
                            </h2>
                            <p className="mx-auto mt-1.5 max-w-lg text-sm text-[var(--text-muted)]">
                                People who build, review, improve and contribute
                                to Passcodes.
                            </p>
                        </div>
                    </ScrollReveal>

                    {isLoading ? (
                        <div className="py-12">
                            <LoadingSpinner label="Loading open source contributors..." />
                        </div>
                    ) : error && allContributors.length === 0 ? (
                        <ErrorState
                            message="We couldn't load the community contributors from GitHub. Please check back shortly."
                            onRetry={() => {
                                void refetch();
                            }}
                        />
                    ) : (
                        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5">
                            {allContributors.map((c, i) => (
                                <ScrollReveal
                                    key={c.login ?? c.name}
                                    delay={Math.min(i * 20, 140)}
                                    distance={12}
                                >
                                    <ContributorCard c={c} />
                                </ScrollReveal>
                            ))}
                        </div>
                    )}
                </div>

                {/* 3. Open Source Call to Action */}
                <ScrollReveal
                    delay={80}
                    className="mt-14 border-t border-[var(--border-light)] pt-10"
                >
                    <div className="card bg-gradient-to-b from-[var(--card-bg)] to-[var(--card-bg-hover)] p-8 text-center sm:p-10">
                        <div className="mb-4 inline-flex rounded-xl bg-[var(--accent-subtle)] p-3 text-[var(--accent-light)]">
                            <Code2 className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-bold tracking-tight text-[var(--text)] sm:text-2xl">
                            Want to contribute?
                        </h3>
                        <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-[var(--text-muted)]">
                            Whether you want to implement a new feature, fix a
                            bug, improve documentation, or translate strings —
                            your help makes Passcodes better for everyone.
                        </p>
                        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                            <ButtonLink
                                href={PASSCODES_CONTRIBUTING_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                variant="filled"
                            >
                                <BookOpen className="h-4 w-4" />
                                <span>Read Contributing Guide</span>
                            </ButtonLink>
                            <ButtonLink
                                href={GITHUB_ISSUES_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                variant="secondary"
                            >
                                <GithubIcon className="h-4 w-4" />
                                <span>Browse Open Issues</span>
                            </ButtonLink>
                        </div>
                    </div>
                </ScrollReveal>
            </div>
        </div>
    );
}
