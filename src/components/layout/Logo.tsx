"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { LOGO_SRC, LOGO_WEBP } from "@/lib/constants";
import { cn } from "@/lib/utils";

/** Real logo with modern WebP negotiation and graceful icon fallback. */
export function Logo({
    className = "h-10 w-10 rounded-xl",
}: {
    className?: string;
}) {
    const [failed, setFailed] = useState(false);

    if (failed) {
        return (
            <span
                className={cn(
                    "inline-flex items-center justify-center bg-[var(--accent-gradient)] text-white",
                    className
                )}
                aria-hidden="true"
            >
                <Lock className="h-1/2 w-1/2" />
            </span>
        );
    }

    return (
        <picture>
            <source type="image/webp" srcSet={LOGO_WEBP} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={LOGO_SRC}
                alt="Passcodes logo"
                width={40}
                height={40}
                loading="lazy"
                decoding="async"
                className={cn("object-cover", className)}
                onError={() => setFailed(true)}
            />
        </picture>
    );
}
