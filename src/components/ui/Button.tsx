import {
    forwardRef,
    type ButtonHTMLAttributes,
    type AnchorHTMLAttributes,
    type ReactNode,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import Link from "next/link";

const buttonVariants = cva(
    "relative inline-flex items-center justify-center font-semibold text-decoration-none select-none cursor-pointer overflow-hidden outline-none transition-transform duration-160 ease-out focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)] disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97]",
    {
        variants: {
            variant: {
                primary: "btn btn-primary",
                secondary: "btn btn-outline",
                filled: "btn btn-filled",
                ghost: "btn btn-ghost",
            },
            size: {
                sm: "btn-small text-xs",
                md: "text-sm",
                lg: "btn-large text-base",
            },
        },
        defaultVariants: {
            variant: "primary",
            size: "md",
        },
    }
);

export interface ButtonProps
    extends
        ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    isLoading?: boolean;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant,
            size,
            isLoading = false,
            leftIcon,
            rightIcon,
            disabled,
            children,
            ...props
        },
        ref
    ) => {
        return (
            <button
                ref={ref}
                disabled={disabled || isLoading}
                aria-busy={isLoading}
                className={cn(buttonVariants({ variant, size, className }))}
                {...props}
            >
                <span
                    className={cn(
                        "inline-flex items-center justify-center gap-2 transition-[filter,opacity] duration-200 ease-out",
                        isLoading && "select-none opacity-0 blur-[2px] filter"
                    )}
                >
                    {leftIcon && (
                        <span
                            className="inline-flex shrink-0"
                            aria-hidden="true"
                        >
                            {leftIcon}
                        </span>
                    )}
                    {children}
                    {rightIcon && (
                        <span
                            className="inline-flex shrink-0"
                            aria-hidden="true"
                        >
                            {rightIcon}
                        </span>
                    )}
                </span>

                {isLoading && (
                    <span
                        className="absolute inset-0 flex items-center justify-center"
                        aria-hidden="true"
                    >
                        <svg
                            className="h-4 w-4 animate-spin text-current"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="3"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                        </svg>
                    </span>
                )}
            </button>
        );
    }
);
Button.displayName = "Button";

export interface ButtonLinkProps
    extends
        AnchorHTMLAttributes<HTMLAnchorElement>,
        VariantProps<typeof buttonVariants> {
    href: string;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
}

export function ButtonLink({
    href,
    className,
    variant,
    size,
    leftIcon,
    rightIcon,
    children,
    ...props
}: ButtonLinkProps) {
    const isExternal =
        href.startsWith("http://") ||
        href.startsWith("https://") ||
        href.startsWith("mailto:");

    const content = (
        <span className="inline-flex items-center justify-center gap-2">
            {leftIcon && (
                <span className="inline-flex shrink-0" aria-hidden="true">
                    {leftIcon}
                </span>
            )}
            {children}
            {rightIcon && (
                <span className="inline-flex shrink-0" aria-hidden="true">
                    {rightIcon}
                </span>
            )}
        </span>
    );

    if (isExternal) {
        return (
            <a
                href={href}
                className={cn(buttonVariants({ variant, size, className }))}
                {...props}
            >
                {content}
            </a>
        );
    }

    return (
        <Link
            href={href}
            className={cn(buttonVariants({ variant, size, className }))}
            {...props}
        >
            {content}
        </Link>
    );
}
