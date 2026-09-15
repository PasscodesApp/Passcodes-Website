"use client";

import { Star } from "lucide-react";
import { Dialog } from "@/components/ui/Dialog";
import { useGithubStars } from "@/hooks/useGithubStars";
import { GITHUB_REPO_URL } from "@/lib/constants";
import { formatNumber } from "@passcodes/passalgo";
import { GithubIcon } from "@/components/ui/BrandIcons";
import Link from "next/link";

export function GithubStarDialog() {
    const { repoInfo, showDialog, closeDialog } = useGithubStars();

    return (
        <Dialog
            open={showDialog}
            onClose={closeDialog}
            aria-labelledby="star-dialog-title"
        >
            <div className="dialog-content">
                <div className="dialog-heading">
                    <span className="dialog-icon">
                        <Star className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h2 id="star-dialog-title">Enjoying Passcodes?</h2>
                </div>
                <p>
                    If Passcodes helps you manage your passwords locally,
                    consider giving us a star on GitHub. It helps others
                    discover the project!
                    {repoInfo && (
                        <>
                            {" "}
                            ⭐ {formatNumber(repoInfo.stargazers_count)} stars
                            and counting.
                        </>
                    )}
                </p>
                <div className="dialog-actions">
                    <button
                        type="button"
                        className="dialog-btn dialog-btn-secondary"
                        onClick={closeDialog}
                    >
                        Maybe Later
                    </button>
                    <Link
                        href={GITHUB_REPO_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="dialog-btn dialog-btn-primary"
                    >
                        <GithubIcon className="h-4 w-4" /> Star on GitHub
                    </Link>
                </div>
            </div>
        </Dialog>
    );
}
