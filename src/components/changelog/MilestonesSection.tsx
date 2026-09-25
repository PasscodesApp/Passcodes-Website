import Link from "next/link";
import { ArrowRight, Layers, Milestone, GitCommit } from "lucide-react";
import type { ChangelogEntry } from "@/lib/changelog";
import { formatDate } from "@passcodes/passalgo";
import { isDeprecatedEntry } from "@/lib/changelog";

interface MilestonesSectionProps {
    milestones: ChangelogEntry[];
}

export function MilestonesSection({ milestones }: MilestonesSectionProps) {
    if (milestones.length === 0) return null;

    return (
        <section aria-labelledby="architecture-milestones-heading" className="space-y-6">
            <div>
                <span className="editorial-badge mb-2 border border-[var(--border-light)] bg-[var(--card-bg)] text-[var(--accent-light)]">
                    Architecture &amp; History
                </span>
                <h2
                    id="architecture-milestones-heading"
                    className="text-2xl font-bold tracking-tight text-[var(--text)] sm:text-3xl"
                >
                    Major Architectural Milestones
                </h2>
                <p className="mt-1.5 text-sm text-[var(--text-muted)] sm:text-base">
                    Documented architectural shifts and foundational transitions across Passcodes&apos; open-source history.
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                {milestones.map((milestone) => {
                    const isExplicitMilestone = milestone.isMilestone;
                    const isDeprecated = isDeprecatedEntry(milestone);

                    return (
                        <div
                            key={milestone.slug}
                            className="subtle-card group flex flex-col justify-between rounded-xl border border-[var(--border-light)] bg-[var(--card-bg)] p-5 transition-all hover:border-[var(--accent-border)]"
                        >
                            <div>
                                <div className="mb-2.5 flex flex-wrap items-center gap-2">
                                    {isExplicitMilestone ? (
                                        <span className="editorial-badge border-[var(--accent-light)]/40 bg-[var(--accent-light)]/15 font-semibold text-[var(--accent-light)]">
                                            Architecture Shift
                                        </span>
                                    ) : (
                                        <span className="editorial-badge border-[var(--border-light)] bg-[var(--card-bg-solid)] text-[var(--text-muted)]">
                                            Milestone
                                        </span>
                                    )}

                                    {isDeprecated && (
                                        <span className="tag deprecated">
                                            Deprecated
                                        </span>
                                    )}

                                    <span className="font-mono text-xs font-semibold text-[var(--text)]">
                                        {milestone.version}
                                    </span>

                                    <span className="text-xs text-[var(--text-dim)]">
                                        · {formatDate(milestone.date)}
                                    </span>
                                </div>

                                <h3 className="text-base font-bold tracking-tight text-[var(--text)] group-hover:text-[var(--accent-light)] transition-colors">
                                    <Link href={`/changelog/${milestone.slug}`}>
                                        {milestone.title}
                                    </Link>
                                </h3>

                                <p className="mt-2 text-xs leading-relaxed text-[var(--text-muted)] sm:text-sm">
                                    {milestone.summary}
                                </p>

                                {milestone.highlights && milestone.highlights.length > 0 && (
                                    <ul className="mt-3 space-y-1.5 border-t border-[var(--border-lighter)] pt-2.5">
                                        {milestone.highlights.slice(0, 2).map((item, idx) => (
                                            <li
                                                key={idx}
                                                className="flex items-start gap-2 text-xs text-[var(--text-dim)]"
                                            >
                                                <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-[var(--accent-light)]" />
                                                <span className="line-clamp-2">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            <div className="mt-4 pt-3 border-t border-[var(--border-light)]">
                                <Link
                                    href={`/changelog/${milestone.slug}`}
                                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--accent-light)] transition-all hover:gap-2"
                                >
                                    <span>Read details</span>
                                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
