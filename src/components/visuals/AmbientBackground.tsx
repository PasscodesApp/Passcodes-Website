"use client";

import { useEffect, useState } from "react";

/**
 * Ambient background lighting providing restrained depth.
 * Zero WebGL/3D overhead, purely hardware-accelerated CSS layers.
 */
export function AmbientBackground() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <div
            className="pointer-events-none fixed inset-0 z-[-1] select-none overflow-hidden"
            aria-hidden="true"
        >
            {/* Ambient Sapphire Light Field (Restrained, Soft Depth) */}
            <div
                className="absolute left-1/2 top-[-12%] h-[560px] w-[920px] -translate-x-1/2 rounded-full opacity-25 blur-[140px] transition-opacity duration-1000 dark:opacity-20"
                style={{
                    background:
                        "radial-gradient(ellipse at center, rgba(37, 99, 235, 0.28) 0%, rgba(2, 132, 199, 0.12) 40%, rgba(59, 130, 246, 0.04) 65%, transparent 75%)",
                }}
            />

            {/* Subtle Horizon Grid (Ultra-faint, engineered) */}
            <div
                className="absolute inset-0 opacity-[0.03] dark:opacity-[0.035]"
                style={{
                    backgroundImage: `
                        linear-gradient(to right, currentColor 1px, transparent 1px),
                        linear-gradient(to bottom, currentColor 1px, transparent 1px)
                    `,
                    backgroundSize: "40px 40px",
                    maskImage:
                        "radial-gradient(ellipse 80% 65% at 50% 12%, black 25%, transparent 80%)",
                    WebkitMaskImage:
                        "radial-gradient(ellipse 80% 65% at 50% 12%, black 25%, transparent 80%)",
                }}
            />

            {/* Lower Ambient Depth */}
            <div
                className="dark:opacity-12 absolute bottom-[-15%] right-[-8%] h-[420px] w-[550px] rounded-full opacity-15 blur-[140px]"
                style={{
                    background:
                        "radial-gradient(ellipse at center, rgba(37, 99, 235, 0.18) 0%, rgba(14, 165, 233, 0.08) 45%, transparent 70%)",
                }}
            />
        </div>
    );
}
